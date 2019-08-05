'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));
var util = _interopDefault(require('util'));
var glob = _interopDefault(require('glob'));
var mkdirp = _interopDefault(require('mkdirp'));

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

exports.build = build;
exports.manifest = manifest;
//# sourceMappingURL=index.js.map
