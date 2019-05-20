'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));
var asc = _interopDefault(require('assemblyscript/cli/asc'));

function validate({
  cwd
}) {
  return fs.existsSync(path.join(cwd, "src/index.ts"));
}
function manifest(newManifest) {
  return newManifest;
}
async function build({
  out,
  cwd,
  options,
  reporter
}) {
  const relativeOutWasm = path.relative(cwd, path.join(out, "assets/index.wasm"));
  const relativeOutTypes = path.relative(cwd, path.join(out, "assets/index.d.ts"));
  await new Promise((resolve, reject) => {
    asc.main(["src/index.ts", "--binaryFile", relativeOutWasm, "-d", relativeOutTypes, "--optimize", "--sourceMap", // Optional:
    "--use", " Math=JSMath", "-O3", "--importMemory", ...(options.args || [])], {
      stdout: reporter.stdout,
      stderr: reporter.stderr
    }, err => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
  reporter.created(path.join(out, "assets/index.wasm"));
}

exports.build = build;
exports.manifest = manifest;
exports.validate = validate;
