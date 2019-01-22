'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));
var execa = _interopDefault(require('execa'));
var types = require('@pika/types');
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

function beforeBuild(_x) {
  return _beforeBuild.apply(this, arguments);
}

function _beforeBuild() {
  _beforeBuild = _asyncToGenerator(function* ({
    cwd,
    reporter
  }) {
    const tscBin = path.join(cwd, "node_modules/.bin/tsc");

    if (!fs.existsSync(tscBin)) {
      throw new types.MessageError('"tsc" executable not found. Make sure "typescript" is installed as a project dependency.');
    }
    const tsConfigLoc = path.join(cwd, "tsconfig.json");

    if (!fs.existsSync(tsConfigLoc)) {
      throw new types.MessageError('"tsconfig.json" manifest not found.');
    }
    const tsConfig = JSON.parse(fs.readFileSync(tsConfigLoc, {
      encoding: 'utf8'
    }));
    const _tsConfig$compilerOpt = tsConfig.compilerOptions,
          target = _tsConfig$compilerOpt.target,
          mod = _tsConfig$compilerOpt.module;

    if (target !== 'es2018') {
      reporter.warning(`tsconfig.json [compilerOptions.target] should be "es2018", but found "${target}". You may encounter problems building.`);
    }

    if (mod !== 'esnext') {
      reporter.warning(`tsconfig.json [compilerOptions.module] should be "esnext", but found "${mod}". You may encounter problems building.`);
    }
  });
  return _beforeBuild.apply(this, arguments);
}

function afterJob(_x2) {
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
  newManifest.source = newManifest.source || 'dist-src/index.js';
  newManifest.types = newManifest.types || 'dist-types/index.js';
  return newManifest;
}
function build(_x3) {
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

exports.beforeBuild = beforeBuild;
exports.afterJob = afterJob;
exports.manifest = manifest;
exports.build = build;
