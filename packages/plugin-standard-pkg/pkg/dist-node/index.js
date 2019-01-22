'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));
var mkdirp = _interopDefault(require('mkdirp'));
var babel = _interopDefault(require('@babel/core'));
var babelPluginDynamicImportSyntax = _interopDefault(require('@babel/plugin-syntax-dynamic-import'));
var babelPluginImportMetaSyntax = _interopDefault(require('@babel/plugin-syntax-import-meta'));
var babelPresetTypeScript = _interopDefault(require('@babel/preset-typescript'));
var babelPluginImportRewrite = _interopDefault(require('@pika/babel-plugin-esm-import-rewrite'));
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
    out
  }) {
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
    src,
    reporter
  }) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = src.files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        const fileAbs = _step.value;
        const writeToSrc = fileAbs.replace(path.join(cwd, 'src/'), path.join(out, '/dist-src/')).replace('.ts', '.js').replace('.tsx', '.js').replace('.jsx', '.js').replace('.mjs', '.js');
        const resultSrc = yield babel.transformFileAsync(fileAbs, {
          cwd,
          presets: [[babelPresetTypeScript]],
          plugins: [[babelPluginImportRewrite, {
            addExtensions: true
          }], babelPluginDynamicImportSyntax, babelPluginImportMetaSyntax]
        });
        mkdirp.sync(path.dirname(writeToSrc));
        fs.writeFileSync(writeToSrc, resultSrc.code);
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

    reporter.created(path.join(out, "dist-src", "index.js"), 'esnext');
  });
  return _build.apply(this, arguments);
}

exports.afterJob = afterJob;
exports.manifest = manifest;
exports.build = build;
