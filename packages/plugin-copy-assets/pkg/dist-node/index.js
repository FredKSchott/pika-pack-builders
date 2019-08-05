'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var copy = _interopDefault(require('copy-concurrently'));
var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));
var types = require('@pika/types');

function manifest(manifest, {
  options
}) {
  const files = options.files || ['assets/'];
  manifest.files = (manifest.files || []).concat(files);
}
async function beforeJob({
  cwd,
  options
}) {
  const files = options.files || ['assets/'];

  for (const fileRel of files) {
    const fileLoc = path.join(cwd, fileRel);

    if (!fs.existsSync(fileLoc)) {
      throw new types.MessageError(`"${fileRel}" does not exist.`);
    }
  }
}
async function build({
  out,
  cwd,
  reporter,
  options
}) {
  const files = options.files || ['assets/'];

  for (const fileRel of files) {
    const fileLoc = path.join(cwd, fileRel);
    const writeToLoc = path.join(out, fileRel);
    reporter.info(`copying ${fileRel}...`);
    await copy(fileLoc, writeToLoc);
  }
}

exports.beforeJob = beforeJob;
exports.build = build;
exports.manifest = manifest;
//# sourceMappingURL=index.js.map
