'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));
var mkdirp = _interopDefault(require('mkdirp'));

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

function manifest(_x, _x2) {
  return _manifest.apply(this, arguments);
}

function _manifest() {
  _manifest = _asyncToGenerator(function* (manifest, {
    cwd
  }) {
    const pathToTsconfig = path.join(cwd, 'tsconfig.json');

    if (!fs.existsSync(pathToTsconfig)) {
      return;
    }

    manifest.deno = manifest.deno || 'dist-deno/index.ts';
  });
  return _manifest.apply(this, arguments);
}

function build(_x3) {
  return _build.apply(this, arguments);
}

function _build() {
  _build = _asyncToGenerator(function* ({
    cwd,
    out,
    src
  }) {
    const pathToTsconfig = path.join(cwd, 'tsconfig.json');

    if (!fs.existsSync(pathToTsconfig)) {
      return;
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = src.files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        const fileAbs = _step.value;
        const fileRel = path.relative(cwd, fileAbs);
        console.log(fileRel, fileRel.replace('/src/', '/dist-deno/'), path.resolve(out, fileRel));
        const writeToTypeScript = path.resolve(out, fileRel).replace('/src/', '/dist-deno/');
        mkdirp.sync(path.dirname(writeToTypeScript));
        fs.copyFileSync(fileAbs, writeToTypeScript);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  });
  return _build.apply(this, arguments);
}

exports.manifest = manifest;
exports.build = build;
