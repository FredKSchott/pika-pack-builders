'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var standardPkg = require('standard-pkg');

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

function afterJob(_x) {
  return _afterJob.apply(this, arguments);
}

function _afterJob() {
  _afterJob = _asyncToGenerator(function* ({
    out,
    reporter
  }) {
    reporter.info('Linting with standard-pkg...');
    const linter = new standardPkg.Lint(out);
    yield linter.init();
    linter.summary();
  });
  return _afterJob.apply(this, arguments);
}

function manifest(newManifest) {
  newManifest.esnext = newManifest.esnext || 'dist-src/index.js';
  return newManifest;
}
function build(_x2) {
  return _build.apply(this, arguments);
}

function _build() {
  _build = _asyncToGenerator(function* ({
    cwd,
    out,
    options,
    reporter
  }) {
    const builder = new standardPkg.Build(path.join(cwd, 'src'), options);
    yield builder.init();
    yield builder.write(path.join(out, '/dist-src/'));
    reporter.created(path.join(out, "dist-src", "index.js"), 'esnext');
  });
  return _build.apply(this, arguments);
}

exports.afterJob = afterJob;
exports.manifest = manifest;
exports.build = build;
