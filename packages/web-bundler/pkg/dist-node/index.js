'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var rollupCommonJs = _interopDefault(require('rollup-plugin-commonjs'));
var rollupJson = _interopDefault(require('rollup-plugin-json'));
var rollupNodeResolve = _interopDefault(require('rollup-plugin-node-resolve'));
var path = _interopDefault(require('path'));

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

function manifest(manifest) {
  manifest.module = manifest.module || 'dist-web/index.js';
}
function build(_x) {
  return _build.apply(this, arguments);
}

function _build() {
  _build = _asyncToGenerator(function* ({
    out,
    rollup
  }) {
    const readFromWeb = path.join(out, 'dist-web', 'index.js');
    const writeToWeb = path.join(out, 'dist-web', 'index.bundled.js');
    const srcBundle = yield rollup('web', {
      input: readFromWeb,
      plugins: [rollupNodeResolve({
        preferBuiltins: true
      }), rollupCommonJs({
        include: 'node_modules/**',
        sourceMap: false
      }), rollupJson({
        include: 'node_modules/**',
        compact: true
      })]
    });
    yield srcBundle.write({
      file: writeToWeb,
      format: 'esm',
      exports: 'named'
    });
  });
  return _build.apply(this, arguments);
}

exports.manifest = manifest;
exports.build = build;
