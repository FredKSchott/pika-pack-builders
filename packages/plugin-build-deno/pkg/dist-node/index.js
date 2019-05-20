'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));
var util = _interopDefault(require('util'));
var glob = _interopDefault(require('glob'));
var mkdirp = _interopDefault(require('mkdirp'));
var types = require('@pika/types');
var execa = _interopDefault(require('execa'));

async function beforeBuild({
  cwd
}) {
  return execa('deno', ['--version'], {
    cwd
  }).catch(err => {
    throw new types.MessageError('@pika/plugin-build-deno can only handle packages already written for Deno. Exiting because we could not find deno on your machine.');
  });
}
async function manifest(manifest, {
  cwd
}) {
  const pathToTsconfig = path.join(cwd, 'tsconfig.json');

  if (!fs.existsSync(pathToTsconfig)) {
    return;
  }

  manifest.deno = manifest.deno || 'dist-deno/index.ts';
}
async function build({
  cwd,
  out,
  options
}) {
  const pathToTsconfig = path.join(cwd, 'tsconfig.json');

  if (!fs.existsSync(pathToTsconfig)) {
    return;
  }

  const files = await util.promisify(glob)(`src/**/*`, {
    cwd,
    nodir: true,
    absolute: true,
    ignore: (options.exclude || []).map(g => path.join('src', g))
  });

  for (const fileAbs of files) {
    if (path.extname(fileAbs) !== '.ts' && path.extname(fileAbs) !== '.tsx') {
      continue;
    }

    const fileRel = path.relative(cwd, fileAbs);
    const writeToTypeScript = path.resolve(out, fileRel).replace(`${path.sep}src${path.sep}`, `${path.sep}dist-deno${path.sep}`);
    mkdirp.sync(path.dirname(writeToTypeScript));
    fs.copyFileSync(fileAbs, writeToTypeScript);
  }
}

exports.beforeBuild = beforeBuild;
exports.build = build;
exports.manifest = manifest;
