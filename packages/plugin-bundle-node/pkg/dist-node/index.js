'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var babelPluginDynamicImportSyntax = _interopDefault(require('@babel/plugin-syntax-dynamic-import'));
var babelPluginImportMetaSyntax = _interopDefault(require('@babel/plugin-syntax-import-meta'));
var babelPresetEnv = _interopDefault(require('@babel/preset-env'));
var types = require('@pika/types');
var babelPluginDynamicImport = _interopDefault(require('babel-plugin-dynamic-import-node-babel-7'));
var builtinModules = _interopDefault(require('builtin-modules'));
var fs = require('fs');
var path = require('path');
var rollupBabel = _interopDefault(require('rollup-plugin-babel'));
var rollupCommonJs = _interopDefault(require('rollup-plugin-commonjs'));
var rollupJson = _interopDefault(require('rollup-plugin-json'));
var rollupNodeResolve = _interopDefault(require('rollup-plugin-node-resolve'));

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

function beforeJob(_x) {
  return _beforeJob.apply(this, arguments);
}

function _beforeJob() {
  _beforeJob = _asyncToGenerator(function* ({
    out
  }) {
    const srcDirectory = path.join(out, "dist-src/");

    if (!fs.existsSync(srcDirectory)) {
      throw new types.MessageError('"dist-src/" does not exist, or was not yet created in the pipeline.');
    }

    const srcEntrypoint = path.join(out, "dist-src/index.js");

    if (!fs.existsSync(srcEntrypoint)) {
      throw new types.MessageError('"dist-src/index.js" is the expected standard entrypoint, but it does not exist.');
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
    isFull,
    rollup,
    reporter
  }) {
    if (!isFull) {
      return;
    }

    const writeToNode = path.join(out, 'dist-node', 'index.bundled.js');
    const srcBundle = yield rollup('node', {
      external: builtinModules,
      plugins: [rollupBabel({
        babelrc: false,
        compact: false,
        presets: [[babelPresetEnv, {
          modules: false,
          targets: {
            node: '6'
          },
          spec: true
        }]],
        plugins: [babelPluginDynamicImport, babelPluginDynamicImportSyntax, babelPluginImportMetaSyntax]
      }), rollupNodeResolve({
        module: false,
        preferBuiltins: false
      }), rollupCommonJs({
        include: 'node_modules/**',
        sourceMap: false
      }), rollupJson({
        include: 'node_modules/**',
        compact: true
      })]
    });
    yield srcBundle.write({
      file: writeToNode,
      format: 'cjs',
      exports: 'named'
    });
    reporter.created(writeToNode);
  });
  return _build.apply(this, arguments);
}

exports.beforeJob = beforeJob;
exports.build = build;
