'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var rollupCommonJs = _interopDefault(require('rollup-plugin-commonjs'));
var rollupJson = _interopDefault(require('rollup-plugin-json'));
var rollupNodeResolve = _interopDefault(require('rollup-plugin-node-resolve'));
var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));
var types = require('@pika/types');
var rollup = require('rollup');

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
  options,
  reporter
}) {
  const readFromWeb = path.join(out, 'dist-web', 'index.js');
  const writeToWeb = path.join(out, 'dist-web', 'index.bundled.js');
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
    })]
  });
  await result.write({
    file: writeToWeb,
    format: 'esm',
    exports: 'named'
  });
  reporter.created(writeToWeb);
}

exports.beforeJob = beforeJob;
exports.build = build;
