'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));
var types = require('@pika/types');
var standardPkg = require('standard-pkg');

async function beforeJob({
  cwd
}) {
  const srcDirectory = path.join(cwd, 'src/');

  if (!fs.existsSync(srcDirectory)) {
    throw new types.MessageError('@pika/pack expects a standard package format, where package source must live in "src/".');
  }

  if (!fs.existsSync(path.join(cwd, 'src/index.js')) && !fs.existsSync(path.join(cwd, 'src/index.ts')) && !fs.existsSync(path.join(cwd, 'src/index.jsx')) && !fs.existsSync(path.join(cwd, 'src/index.tsx'))) {
    throw new types.MessageError('@pika/pack expects a standard package format, where the package entrypoint must live at "src/index".');
  }
}
async function afterJob({
  out,
  reporter
}) {
  reporter.info('Linting with standard-pkg...');
  const linter = new standardPkg.Lint(out);
  await linter.init();
  linter.summary();
}
function manifest(newManifest) {
  newManifest.esnext = newManifest.esnext || 'dist-src/index.js';
  return newManifest;
}
async function build({
  cwd,
  out,
  options,
  reporter
}) {
  const builder = new standardPkg.Build(path.join(cwd, 'src'), options);
  await builder.init();
  await builder.write(path.join(out, '/dist-src/'));
  reporter.created(path.join(out, 'dist-src', 'index.js'), 'esnext');
}

exports.afterJob = afterJob;
exports.beforeJob = beforeJob;
exports.build = build;
exports.manifest = manifest;
