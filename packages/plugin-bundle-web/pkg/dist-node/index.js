'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var rollupCommonJs = _interopDefault(require('@rollup/plugin-commonjs'));
var rollupJson = _interopDefault(require('@rollup/plugin-json'));
var rollupNodeResolve = _interopDefault(require('@rollup/plugin-node-resolve'));
var rollupPluginTerser = require('rollup-plugin-terser');
var rollupBabel = _interopDefault(require('rollup-plugin-babel'));
var babelPluginDynamicImportSyntax = _interopDefault(require('@babel/plugin-syntax-dynamic-import'));
var babelPluginImportMetaSyntax = _interopDefault(require('@babel/plugin-syntax-import-meta'));
var babelPresetEnv = _interopDefault(require('@babel/preset-env'));
var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));
var types = require('@pika/types');
var rollup = require('rollup');

const DEFAULT_ENTRYPOINT = 'browser';
async function beforeJob({
  out
}) {
  const srcDirectory = path.join(out, 'dist-web/');

  if (!fs.existsSync(srcDirectory)) {
    throw new types.MessageError('"dist-web/" does not exist. "plugin-bundle-web" requires "plugin-build-dev" to precede in pipeline.');
  }

  const srcEntrypoint = path.join(out, 'dist-web/index.js');

  if (!fs.existsSync(srcEntrypoint)) {
    throw new types.MessageError('"dist-web/index.js" is the expected standard entrypoint, but it does not exist.');
  }
}
function manifest(manifest, {
  options
}) {
  if (options.entrypoint !== null) {
    let keys = options.entrypoint || [DEFAULT_ENTRYPOINT];

    if (typeof keys === 'string') {
      keys = [keys];
    }

    for (const key of keys) {
      manifest[key] = manifest[key] || 'dist-web/index.bundled.js';
    }
  }
}
async function build({
  out,
  options,
  reporter
}) {
  const readFromWeb = path.join(out, 'dist-web', 'index.js');
  const writeToWeb = path.join(out, 'dist-web');
  const writeToWebBundled = path.join(writeToWeb, 'index.bundled.js');
  const result = await rollup.rollup({
    input: readFromWeb,
    plugins: [rollupNodeResolve({
      preferBuiltins: true,
      browser: !!options.browser
    }), rollupCommonJs({
      include: 'node_modules/**',
      sourceMap: false,
      namedExports: options.namedExports
    }), rollupJson({
      include: 'node_modules/**',
      compact: true
    }), rollupBabel({
      babelrc: false,
      compact: false,
      presets: [[babelPresetEnv, {
        modules: false,
        targets: options.targets || {
          esmodules: true
        }
      }]],
      plugins: [babelPluginDynamicImportSyntax, babelPluginImportMetaSyntax]
    }), options.minify !== false ? rollupPluginTerser.terser(typeof options.minify === 'object' ? options.minify : undefined) : {}]
  });
  await result.write({
    dir: writeToWeb,
    entryFileNames: '[name].bundled.js',
    chunkFileNames: '[name]-[hash].bundled.js',
    format: 'esm',
    exports: 'named',
    sourcemap: options.sourcemap === undefined ? true : options.sourcemap
  });
  reporter.created(writeToWebBundled);
}

exports.beforeJob = beforeJob;
exports.build = build;
exports.manifest = manifest;
//# sourceMappingURL=index.js.map
