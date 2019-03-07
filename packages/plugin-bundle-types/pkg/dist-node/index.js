'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var dtsBundleGenerator = require('dts-bundle-generator');
var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));

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
  manifest.types = "dist-types/types.d.ts";
}
function build(_x) {
  return _build.apply(this, arguments);
}

function _build() {
  _build = _asyncToGenerator(function* ({
    cwd,
    out,
    reporter
  }) {
    const definitionInput = path.join(out, "dist-types/index.d.ts");
    const definitionOutput = path.join(out, "dist-types/types.d.ts");

    if (!fs.existsSync(definitionInput)) {
      console.error(`
⚠️  dist-types/: Attempted to generate a bundle of type definitions, but "dist-types/index.d.ts" file was not found.
                Please ensure that you have "@pika/plugin-build-types" in your pipeline.
`);
      throw new Error(`Failed to build: dist-types/`);
    }

    const definitionBundle = dtsBundleGenerator.generateDtsBundle([{
      filePath: definitionInput
    }]);
    fs.writeFileSync(definitionOutput, definitionBundle);
    reporter.created(definitionOutput, 'types');
  });
  return _build.apply(this, arguments);
}

exports.manifest = manifest;
exports.build = build;
