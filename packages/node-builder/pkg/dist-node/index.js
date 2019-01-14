'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var babelPluginDynamicImportSyntax = _interopDefault(require('@babel/plugin-syntax-dynamic-import'));
var babelPluginImportMetaSyntax = _interopDefault(require('@babel/plugin-syntax-import-meta'));
var babelPresetEnv = _interopDefault(require('@babel/preset-env'));
var babelPluginDynamicImport = _interopDefault(require('babel-plugin-dynamic-import-node-babel-7'));
var builtinModules = _interopDefault(require('builtin-modules'));
var rollupBabel = _interopDefault(require('rollup-plugin-babel'));

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
  manifest.main = manifest.main || 'dist-node/index.js';
}
function build(_x) {
  return _build.apply(this, arguments);
}

function _build() {
  _build = _asyncToGenerator(function* ({
    out,
    rollup
  }) {
    const writeToNode = path.join(out, 'dist-node', 'index.js'); // TODO: KEEP FIXING THIS,

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
      })],
      onwarn: (warning, defaultOnWarnHandler) => {
        // Unresolved external imports are expected
        if (warning.code === 'UNRESOLVED_IMPORT' && !(warning.source.startsWith('./') || warning.source.startsWith('../'))) {
          return;
        }

        defaultOnWarnHandler(warning);
      }
    });
    yield srcBundle.write({
      file: writeToNode,
      format: 'cjs',
      exports: 'named'
    });
  });
  return _build.apply(this, arguments);
}

exports.manifest = manifest;
exports.build = build;
