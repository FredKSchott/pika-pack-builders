'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));
var rollupBuckleScript = _interopDefault(require('rollup-plugin-bucklescript'));

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
  return fs.existsSync(path.join(cwd, "src/index.re")) || fs.existsSync(path.join(cwd, "src/index.ml"));
}
function manifest(newManifest) {
  newManifest.es2015 = newManifest.es2015 || 'dist-src/index.js';
  return newManifest;
}
function build(_x) {
  return _build.apply(this, arguments);
}

function _build() {
  _build = _asyncToGenerator(function* ({
    cwd,
    out,
    rollup,
    reporter
  }) {
    const writeToSrc = path.join(out, 'dist-src', 'index.js');
    const isReason = fs.existsSync(path.join(cwd, "src/index.re"));
    const srcBundle = yield rollup('src', {
      input: isReason ? 'src/index.re' : 'src/index.ml',
      plugins: [rollupBuckleScript()]
    });
    yield srcBundle.write({
      file: writeToSrc,
      format: 'esm',
      exports: 'named'
    });
    reporter.created(writeToSrc, 'es2015');
  });
  return _build.apply(this, arguments);
}

exports.validate = validate;
exports.manifest = manifest;
exports.build = build;
