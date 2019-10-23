'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var babelPluginDynamicImportSyntax = _interopDefault(require('@babel/plugin-syntax-dynamic-import'));
var babelPluginImportMetaSyntax = _interopDefault(require('@babel/plugin-syntax-import-meta'));
var babelPresetEnv = _interopDefault(require('@babel/preset-env'));
var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));
var rollupBabel = _interopDefault(require('rollup-plugin-babel'));
var types = require('@pika/types');
var rollup = require('rollup');

const DEFAULT_ENTRYPOINT = 'umd:main';
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
function manifest(manifest, {
  options
}) {
  let keys = options.entrypoint || [DEFAULT_ENTRYPOINT];

  if (typeof keys === 'string') {
    keys = [keys];
  }

  for (const key of keys) {
    manifest[key] = manifest[key] || 'dist-umd/index.js';
  }
}
async function build({
  out,
  reporter,
  options
}) {
  const umdExportName = options.name || manifest.name;
  const writeToUmd = path.join(out, 'dist-umd', 'index.js');
  const result = await rollup.rollup({
    input: path.join(out, 'dist-src/index.js'),
    plugins: [rollupBabel({
      babelrc: false,
      compact: false,
      presets: [[babelPresetEnv, {
        modules: false,
        spec: true,
        targets: {
          // Recommended in: https://jamie.build/last-2-versions
          browsers: ['>0.25%', 'not op_mini all']
        }
      }]],
      plugins: [babelPluginDynamicImportSyntax, babelPluginImportMetaSyntax]
    })],
    onwarn: (warning, defaultOnWarnHandler) => {
      // // Unresolved external imports are expected
      if (warning.code === 'UNRESOLVED_IMPORT' && !(warning.source.startsWith('./') || warning.source.startsWith('../'))) {
        return;
      }

      defaultOnWarnHandler(warning);
    }
  });
  await result.write({
    file: writeToUmd,
    format: 'umd',
    exports: 'named',
    name: umdExportName,
    sourcemap: options.sourcemap === undefined ? true : options.sourcemap
  });
  reporter.created(writeToUmd, 'umd:main');
}

exports.beforeJob = beforeJob;
exports.build = build;
exports.manifest = manifest;
//# sourceMappingURL=index.js.map
