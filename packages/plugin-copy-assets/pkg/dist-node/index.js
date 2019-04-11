'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var copy = _interopDefault(require('copy-concurrently'));
var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));
var types = require('@pika/types');

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

function manifest(manifest) {}
function beforeJob(_x) {
  return _beforeJob.apply(this, arguments);
}

function _beforeJob() {
  _beforeJob = _asyncToGenerator(function* ({
    cwd,
    options
  }) {
    const files = options.files || ['assets/'];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        const fileRel = _step.value;
        const fileLoc = path.join(cwd, fileRel);

        if (!fs.existsSync(fileLoc)) {
          throw new types.MessageError(`"${fileRel}" does not exist.`);
        }
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
  return _beforeJob.apply(this, arguments);
}

function build(_x2) {
  return _build.apply(this, arguments);
}

function _build() {
  _build = _asyncToGenerator(function* ({
    out,
    cwd,
    reporter,
    options
  }) {
    const files = options.files || ['assets/'];
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = files[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        const fileRel = _step2.value;
        const fileLoc = path.join(cwd, fileRel);
        const writeToLoc = path.join(out, fileRel);
        reporter.info(`copying ${fileRel}...`);
        yield copy(fileLoc, writeToLoc);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  });
  return _build.apply(this, arguments);
}

exports.beforeJob = beforeJob;
exports.build = build;
exports.manifest = manifest;
