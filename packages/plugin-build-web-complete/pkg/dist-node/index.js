'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));
var rollupBabel = _interopDefault(require('rollup-plugin-babel'));
var types = require('@pika/types');
var rollup = require('rollup');

async function beforeJob({
  out
}) {
  const srcDirectory = path.join(out, 'dist-src/');

  if (!fs.existsSync(srcDirectory)) {
    throw new types.MessageError('"dist-src/" does not exist, or was not yet created in the pipeline.');
  }

  const srcEntrypoint = path.join(out, 'dist-src/index.js');

  if (!fs.existsSync(srcEntrypoint)) {
    throw new types.MessageError('"dist-src/index.js" is the expected standard entrypoint, but it does not exist.');
  }
}
async function loadAllBabelPlugins() {
  const ES2019 = ['@babel/plugin-proposal-json-strings', '@babel/plugin-syntax-optional-catch-binding', '@babel/plugin-proposal-optional-catch-binding'];
  const ES2018 = [...ES2019, Promise.resolve().then(() => require('@babel/plugin-syntax-async-generators')), Promise.resolve().then(() => require('@babel/plugin-proposal-async-generator-functions')), Promise.resolve().then(() => require('@babel/plugin-transform-dotall-regex')), Promise.resolve().then(() => require('@babel/plugin-transform-named-capturing-groups-regex')), Promise.resolve().then(() => require('@babel/plugin-syntax-object-rest-spread')), Promise.resolve().then(() => require('@babel/plugin-proposal-object-rest-spread')), Promise.resolve().then(() => require('@babel/plugin-proposal-unicode-property-regex'))];
  const ES2017 = [...ES2018, Promise.resolve().then(() => require('@babel/plugin-transform-async-to-generator'))];
  const ES2016 = [...ES2017, Promise.resolve().then(() => require('@babel/plugin-transform-exponentiation-operator'))];
  const ES2015 = [...ES2016, Promise.resolve().then(() => require('@babel/plugin-transform-arrow-functions')), Promise.resolve().then(() => require('@babel/plugin-transform-block-scoped-functions')), Promise.resolve().then(() => require('@babel/plugin-transform-block-scoping')), Promise.resolve().then(() => require('@babel/plugin-transform-classes')), Promise.resolve().then(() => require('@babel/plugin-transform-computed-properties')), Promise.resolve().then(() => require('@babel/plugin-transform-destructuring')), Promise.resolve().then(() => require('@babel/plugin-transform-duplicate-keys')), Promise.resolve().then(() => require('@babel/plugin-transform-for-of')), Promise.resolve().then(() => require('@babel/plugin-transform-function-name')), Promise.resolve().then(() => require('@babel/plugin-transform-literals')), Promise.resolve().then(() => require('@babel/plugin-transform-new-target')), Promise.resolve().then(() => require('@babel/plugin-transform-object-super')), Promise.resolve().then(() => require('@babel/plugin-transform-parameters')), Promise.resolve().then(() => require('@babel/plugin-transform-shorthand-properties')), Promise.resolve().then(() => require('@babel/plugin-transform-spread')), Promise.resolve().then(() => require('@babel/plugin-transform-sticky-regex')), Promise.resolve().then(() => require('@babel/plugin-transform-template-literals')), Promise.resolve().then(() => require('@babel/plugin-transform-typeof-symbol')), Promise.resolve().then(() => require('@babel/plugin-transform-unicode-regex'))];
  return [await Promise.all(ES2019), await Promise.all(ES2018), await Promise.all(ES2017), await Promise.all(ES2016), await Promise.all(ES2015)];
}

async function buildSingleDist(distTag, distPlugins, {
  out,
  reporter
}) {
  const writeToWeb = path.join(out, distTag, 'index.js');
  const result = await rollup.rollup({
    input: path.join(out, 'dist-src/index.js'),
    plugins: [distPlugins && rollupBabel({
      babelrc: false,
      compact: false,
      plugins: distPlugins
    })],
    onwarn: (warning, defaultOnWarnHandler) => {
      // // Unresolved external imports are expected
      // TODO: rewrite here?
      if (warning.code === 'UNRESOLVED_IMPORT' && !(warning.source.startsWith('./') || warning.source.startsWith('../'))) {
        return;
      }

      defaultOnWarnHandler(warning);
    }
  });
  await result.write({
    file: writeToWeb,
    format: 'esm',
    exports: 'named'
  });
  reporter.created(writeToWeb, distTag);
}

async function build(options) {
  const [neededForES2018, neededForES2017, neededForES2016, neededForES2015] = await loadAllBabelPlugins();
  await buildSingleDist('dist-es2019', null, options);
  await buildSingleDist('dist-es2018', neededForES2018, options);
  await buildSingleDist('dist-es2017', neededForES2017, options);
  await buildSingleDist('dist-es2016', neededForES2016, options);
  await buildSingleDist('dist-es2015', neededForES2015, options);
}

exports.beforeJob = beforeJob;
exports.build = build;
exports.loadAllBabelPlugins = loadAllBabelPlugins;
