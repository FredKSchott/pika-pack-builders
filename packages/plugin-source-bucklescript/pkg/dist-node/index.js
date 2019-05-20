'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));
var rollupBuckleScript = _interopDefault(require('rollup-plugin-bucklescript'));
var rollup = require('rollup');

function validate({
  cwd
}) {
  return fs.existsSync(path.join(cwd, 'src/index.re')) || fs.existsSync(path.join(cwd, 'src/index.ml'));
}
function manifest(newManifest) {
  newManifest.es2015 = newManifest.es2015 || 'dist-src/index.js';
  return newManifest;
}
async function build({
  cwd,
  out,
  reporter
}) {
  const writeToSrc = path.join(out, 'dist-src', 'index.js');
  const isReason = fs.existsSync(path.join(cwd, 'src/index.re'));
  const result = await rollup.rollup({
    input: isReason ? 'src/index.re' : 'src/index.ml',
    plugins: [rollupBuckleScript()]
  });
  await result.write({
    file: writeToSrc,
    format: 'esm',
    exports: 'named'
  });
  reporter.created(writeToSrc, 'es2015');
}

exports.build = build;
exports.manifest = manifest;
exports.validate = validate;
