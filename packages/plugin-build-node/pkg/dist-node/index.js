'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = _interopDefault(require('fs'));
var path = _interopDefault(require('path'));
var babelPluginDynamicImportSyntax = _interopDefault(require('@babel/plugin-syntax-dynamic-import'));
var babelPluginImportMetaSyntax = _interopDefault(require('@babel/plugin-syntax-import-meta'));
var babelPresetEnv = _interopDefault(require('@babel/preset-env'));
var babelPluginDynamicImport = _interopDefault(require('babel-plugin-dynamic-import-node-babel-7'));
var builtinModules = _interopDefault(require('builtin-modules'));
var rollupBabel = _interopDefault(require('rollup-plugin-babel'));
var types = require('@pika/types');
var rollup = require('rollup');

const DEFAULT_ENTRYPOINT = 'main';
const DEFAULT_MIN_NODE_VERSION = '8';
function manifest(manifest, {
  options
}) {
  if (options.entrypoint !== null) {
    let keys = options.entrypoint || [DEFAULT_ENTRYPOINT];

    if (typeof keys === 'string') {
      keys = [keys];
    }

    for (const key of keys) {
      manifest[key] = manifest[key] || 'dist-node/index.js';
    }
  }
}
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
  const writeToNode = path.join(out, 'dist-node', 'index.js'); // TODO: KEEP FIXING THIS,

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
    })],
    onwarn: (warning, defaultOnWarnHandler) => {
      // Unresolved external imports are expected
      if (warning.code === 'UNRESOLVED_IMPORT' && !(warning.source.startsWith('./') || warning.source.startsWith('../'))) {
        return;
      }

      defaultOnWarnHandler(warning);
    }
  });
  await result.write({
    file: writeToNode,
    format: 'cjs',
    exports: 'named',
    sourcemap: options.sourcemap === undefined ? true : options.sourcemap
  });
  reporter.created(writeToNode, 'main');
}

exports.beforeJob = beforeJob;
exports.build = build;
exports.manifest = manifest;
//# sourceMappingURL=index.js.map
