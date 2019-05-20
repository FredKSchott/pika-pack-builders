'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var babelPluginDynamicImportSyntax = _interopDefault(require('@babel/plugin-syntax-dynamic-import'));
var babelPluginImportMetaSyntax = _interopDefault(require('@babel/plugin-syntax-import-meta'));
var babelPresetEnv = _interopDefault(require('@babel/preset-env'));
var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));
var rollupBabel = _interopDefault(require('rollup-plugin-babel'));
var types = require('@pika/types');
var rollup = require('rollup');

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
    options
  }) {
    if (!options.name) {
      throw new types.MessageError('A "name" option is required for UMD builds.');
    }
  });
  return _beforeBuild.apply(this, arguments);
}

function beforeJob(_x2) {
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

function manifest(manifest) {
  manifest["umd:main"] = 'dist-umd/index.js';
}
function build(_x3) {
  return _build.apply(this, arguments);
}

function _build() {
  _build = _asyncToGenerator(function* ({
    out,
    reporter,
    options
  }) {
    const writeToUmd = path.join(out, 'dist-umd', 'index.js');
    const result = yield rollup.rollup({
      input: path.join(out, 'dist-src/index.js'),
      plugins: [rollupBabel({
        babelrc: false,
        compact: false,
        presets: [[babelPresetEnv, {
          modules: false,
          spec: true,
          targets: {
            // Recommended in: https://jamie.build/last-2-versions
            browsers: [">0.25%", "not op_mini all"]
          }
        }]],
        plugins: [babelPluginDynamicImportSyntax, babelPluginImportMetaSyntax]
      })],
      onwarn: (warning, defaultOnWarnHandler) => {
        // // Unresolved external imports are expected
        if (warning.code === 'UNRESOLVED_IMPORT' && !(warning.source.startsWith('./') || warning.source.startsWith('../'))) {
          return;
        }

        defaultOnWarnHandler(warning);
      }
    });
    yield result.write({
      file: writeToUmd,
      format: 'umd',
      exports: 'named',
      name: options.name
    });
    reporter.created(writeToUmd, 'umd:main');
  });
  return _build.apply(this, arguments);
}

exports.beforeBuild = beforeBuild;
exports.beforeJob = beforeJob;
exports.build = build;
exports.manifest = manifest;
