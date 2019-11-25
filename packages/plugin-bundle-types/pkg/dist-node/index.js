'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));
var rimraf = _interopDefault(require('rimraf'));
var types = require('@pika/types');
var rollup = require('rollup');
var rollupPluginDts = _interopDefault(require('rollup-plugin-dts'));

const DEFAULT_ENTRYPOINT = 'types';
async function beforeJob({
  out
}) {
  const typesDir = path.join(out, 'dist-types');

  if (!fs.existsSync(typesDir)) {
    throw new types.MessageError('No "dist-types/" folder exists to bundle.');
  }

  const typesEntrypoint = path.join(out, 'dist-types/index.d.ts');

  if (!fs.existsSync(typesEntrypoint)) {
    throw new types.MessageError('A "dist-types/index.d.ts" entrypoint is required, but none was found.');
  }
}
function manifest(manifest, {
  options
}) {
  if (options.entrypoint !== null) {
    let keys = options.entrypoint || [DEFAULT_ENTRYPOINT];

    if (typeof keys === 'string') {
      keys = [keys];
    }

    for (const key of keys) {
      manifest[key] = 'dist-types/index.d.ts';
    }
  }
}
async function build({
  out,
  options,
  reporter
}) {
  const readFromTypes = path.join(out, 'dist-types', 'index.d.ts');
  const writeToTypes = path.join(out, 'dist-types');
  const writeToTypesBundled = path.join(writeToTypes, 'index.d.ts');
  const result = await rollup.rollup({
    input: readFromTypes,
    plugins: [rollupPluginDts()]
  });
  rimraf.sync(writeToTypes);
  await result.write({
    file: writeToTypesBundled,
    format: 'esm'
  });
  reporter.created(writeToTypesBundled);
}

exports.beforeJob = beforeJob;
exports.build = build;
exports.manifest = manifest;
//# sourceMappingURL=index.js.map
