'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var babelPluginDynamicImportSyntax = _interopDefault(require('@babel/plugin-syntax-dynamic-import'));
var babelPluginImportMetaSyntax = _interopDefault(require('@babel/plugin-syntax-import-meta'));
var babelPresetEnv = _interopDefault(require('@babel/preset-env'));
var types = require('@pika/types');
var babelPluginDynamicImport = _interopDefault(require('babel-plugin-dynamic-import-node-babel-7'));
var builtinModules = _interopDefault(require('builtin-modules'));
var fs = require('fs');
var path = require('path');
var rollupBabel = _interopDefault(require('rollup-plugin-babel'));
var rollupCommonJs = _interopDefault(require('@rollup/plugin-commonjs'));
var rollupJson = _interopDefault(require('@rollup/plugin-json'));
var rollupNodeResolve = _interopDefault(require('@rollup/plugin-node-resolve'));
var rollup = require('rollup');

const DEFAULT_MIN_NODE_VERSION = '8';
async function beforeJob({
  out
}) {
  const srcDirectory = path.join(out, 'dist-src/');

  if (!fs.existsSync(srcDirectory)) {
    throw new types.MessageError('"dist-src/" does not exist, or was not yet created in the pipeline.');
  }

  const srcEntrypoint = path.join(out, 'dist-src/index.js');

  if (!fs.existsSync(srcEntrypoint)) {
    throw new types.MessageError('"dist-src/index.js" is the expected standard entrypoint, but it does not exist.');
  }
}
async function build({
  out,
  reporter,
  options
}) {
  const writeToNode = path.join(out, 'dist-node');
  const writeToNodeBundled = path.join(writeToNode, 'index.bundled.js');
  const result = await rollup.rollup({
    input: path.join(out, 'dist-src/index.js'),
    external: builtinModules,
    plugins: [rollupBabel({
      babelrc: false,
      compact: false,
      presets: [[babelPresetEnv, {
        modules: false,
        targets: {
          node: options.minNodeVersion || DEFAULT_MIN_NODE_VERSION
        },
        spec: true
      }]],
      plugins: [babelPluginDynamicImport, babelPluginDynamicImportSyntax, babelPluginImportMetaSyntax]
    }), rollupNodeResolve({
      mainFields: ['main'],
      preferBuiltins: false
    }), rollupCommonJs({
      sourceMap: false
    }), rollupJson({
      compact: true
    })]
  });
  await result.write({
    dir: writeToNode,
    entryFileNames: '[name].bundled.js',
    chunkFileNames: '[name]-[hash].bundled.js',
    format: 'cjs',
    exports: 'named',
    sourcemap: options.sourcemap === undefined ? true : options.sourcemap
  });
  reporter.created(writeToNodeBundled);
}

exports.beforeJob = beforeJob;
exports.build = build;
//# sourceMappingURL=index.js.map
