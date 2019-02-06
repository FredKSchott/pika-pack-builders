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

function beforeBuild(_x) {
  return _beforeBuild.apply(this, arguments);
}

function _beforeBuild() {
  _beforeBuild = _asyncToGenerator(function* ({
    cwd
  }) {
    return execa('deno', ["--version"], {
      cwd
    }).catch(err => {
      throw new types.MessageError('@pika/plugin-build-deno can only handle packages already written for Deno. Exiting because we could not find deno on your machine.');
    });
  });
  return _beforeBuild.apply(this, arguments);
}

function manifest(_x2, _x3) {
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

function build(_x4) {
  return _build.apply(this, arguments);
}

function _build() {
  _build = _asyncToGenerator(function* ({
    cwd,
    out,
    options
  }) {
    const pathToTsconfig = path.join(cwd, 'tsconfig.json');

    if (!fs.existsSync(pathToTsconfig)) {
      return;
    }

    const files = yield util.promisify(glob)(`src/**/*`, {
      cwd,
      nodir: true,
      absolute: true,
      ignore: (options.exclude || []).map(g => path.join('src', g))
    });
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        const fileAbs = _step.value;

        if (path.extname(fileAbs) !== 'ts' && path.extname(fileAbs) !== 'tsx') {
          continue;
        }

        const fileRel = path.relative(cwd, fileAbs);
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

exports.beforeBuild = beforeBuild;
exports.manifest = manifest;
exports.build = build;
