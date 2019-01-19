'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));
var asc = _interopDefault(require('assemblyscript/cli/asc'));

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function validate({
  cwd
}) {
  return fs.existsSync(path.join(cwd, "src/index.ts"));
}
function manifest(newManifest) {
  return newManifest;
}
function build(_x) {
  return _build.apply(this, arguments);
}

function _build() {
  _build = _asyncToGenerator(function* ({
    out,
    cwd,
    options,
    reporter
  }) {
    const relativeOutWasm = path.relative(cwd, path.join(out, "assets/index.wasm"));
    const relativeOutTypes = path.relative(cwd, path.join(out, "assets/index.d.ts"));
    yield new Promise((resolve, reject) => {
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
  });
  return _build.apply(this, arguments);
}

exports.validate = validate;
exports.manifest = manifest;
exports.build = build;
