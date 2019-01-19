'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));
var execa = _interopDefault(require('execa'));

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
  const tscBin = path.join(cwd, "node_modules/.bin/tsc");
  const tsConfig = path.join(cwd, "tsconfig.json");
  return fs.existsSync(tscBin) && fs.existsSync(tsConfig);
}
function manifest(newManifest) {
  newManifest.source = newManifest.source || 'dist-src/index.js';
  newManifest.types = newManifest.types || 'dist-types/index.js';
  return newManifest;
}
function build(_x) {
  return _build.apply(this, arguments);
}

function _build() {
  _build = _asyncToGenerator(function* ({
    cwd,
    out,
    reporter
  }) {
    const tscBin = path.join(cwd, "node_modules/.bin/tsc");
    yield execa(tscBin, ["--outDir", path.join(out, "dist-src/"), "-d", "--declarationDir", path.join(out, "dist-types/"), "--declarationMap", "false", "--target", "es2018", "--module", "esnext"], {
      cwd
    });
    reporter.created(path.join(out, "dist-src", "index.js"), 'esnext');
    reporter.created(path.join(out, "dist-types", "index.d.ts"), 'types');
  });
  return _build.apply(this, arguments);
}

exports.validate = validate;
exports.manifest = manifest;
exports.build = build;
