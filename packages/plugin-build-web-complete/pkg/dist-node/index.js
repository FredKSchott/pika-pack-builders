'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

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

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
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

function loadAllBabelPlugins() {
  return _loadAllBabelPlugins.apply(this, arguments);
}

function _loadAllBabelPlugins() {
  _loadAllBabelPlugins = _asyncToGenerator(function* () {
    const ES2019 = ["@babel/plugin-proposal-json-strings", "@babel/plugin-syntax-optional-catch-binding", "@babel/plugin-proposal-optional-catch-binding"];
    const ES2018 = [...ES2019, Promise.resolve().then(() => require("@babel/plugin-syntax-async-generators")), Promise.resolve().then(() => require("@babel/plugin-proposal-async-generator-functions")), Promise.resolve().then(() => require("@babel/plugin-transform-dotall-regex")), Promise.resolve().then(() => require("@babel/plugin-transform-named-capturing-groups-regex")), Promise.resolve().then(() => require("@babel/plugin-syntax-object-rest-spread")), Promise.resolve().then(() => require("@babel/plugin-proposal-object-rest-spread")), Promise.resolve().then(() => require("@babel/plugin-proposal-unicode-property-regex"))];
    const ES2017 = [...ES2018, Promise.resolve().then(() => require("@babel/plugin-transform-async-to-generator"))];
    const ES2016 = [...ES2017, Promise.resolve().then(() => require("@babel/plugin-transform-exponentiation-operator"))];
    const ES2015 = [...ES2016, Promise.resolve().then(() => require("@babel/plugin-transform-arrow-functions")), Promise.resolve().then(() => require("@babel/plugin-transform-block-scoped-functions")), Promise.resolve().then(() => require("@babel/plugin-transform-block-scoping")), Promise.resolve().then(() => require("@babel/plugin-transform-classes")), Promise.resolve().then(() => require("@babel/plugin-transform-computed-properties")), Promise.resolve().then(() => require("@babel/plugin-transform-destructuring")), Promise.resolve().then(() => require("@babel/plugin-transform-duplicate-keys")), Promise.resolve().then(() => require("@babel/plugin-transform-for-of")), Promise.resolve().then(() => require("@babel/plugin-transform-function-name")), Promise.resolve().then(() => require("@babel/plugin-transform-literals")), Promise.resolve().then(() => require("@babel/plugin-transform-new-target")), Promise.resolve().then(() => require("@babel/plugin-transform-object-super")), Promise.resolve().then(() => require("@babel/plugin-transform-parameters")), Promise.resolve().then(() => require("@babel/plugin-transform-shorthand-properties")), Promise.resolve().then(() => require("@babel/plugin-transform-spread")), Promise.resolve().then(() => require("@babel/plugin-transform-sticky-regex")), Promise.resolve().then(() => require("@babel/plugin-transform-template-literals")), Promise.resolve().then(() => require("@babel/plugin-transform-typeof-symbol")), Promise.resolve().then(() => require("@babel/plugin-transform-unicode-regex"))];
    return [yield Promise.all(ES2019), yield Promise.all(ES2018), yield Promise.all(ES2017), yield Promise.all(ES2016), yield Promise.all(ES2015)];
  });
  return _loadAllBabelPlugins.apply(this, arguments);
}

function buildSingleDist(_x2, _x3, _x4) {
  return _buildSingleDist.apply(this, arguments);
}

function _buildSingleDist() {
  _buildSingleDist = _asyncToGenerator(function* (distTag, distPlugins, {
    out,
    reporter
  }) {
    const writeToWeb = path.join(out, distTag, "index.js");
    const result = yield rollup.rollup({
      input: path.join(out, "dist-src/index.js"),
      plugins: [distPlugins && rollupBabel({
        babelrc: false,
        compact: false,
        plugins: distPlugins
      })],
      onwarn: (warning, defaultOnWarnHandler) => {
        // // Unresolved external imports are expected
        // TODO: rewrite here?
        if (warning.code === "UNRESOLVED_IMPORT" && !(warning.source.startsWith("./") || warning.source.startsWith("../"))) {
          return;
        }

        defaultOnWarnHandler(warning);
      }
    });
    yield result.write({
      file: writeToWeb,
      format: "esm",
      exports: "named"
    });
    reporter.created(writeToWeb, distTag);
  });
  return _buildSingleDist.apply(this, arguments);
}

function build(_x5) {
  return _build.apply(this, arguments);
}

function _build() {
  _build = _asyncToGenerator(function* (options) {
    const _ref = yield loadAllBabelPlugins(),
          _ref2 = _slicedToArray(_ref, 4),
          neededForES2018 = _ref2[0],
          neededForES2017 = _ref2[1],
          neededForES2016 = _ref2[2],
          neededForES2015 = _ref2[3];

    yield buildSingleDist('dist-es2019', null, options);
    yield buildSingleDist('dist-es2018', neededForES2018, options);
    yield buildSingleDist('dist-es2017', neededForES2017, options);
    yield buildSingleDist('dist-es2016', neededForES2016, options);
    yield buildSingleDist('dist-es2015', neededForES2015, options);
  });
  return _build.apply(this, arguments);
}

exports.beforeJob = beforeJob;
exports.build = build;
exports.loadAllBabelPlugins = loadAllBabelPlugins;
