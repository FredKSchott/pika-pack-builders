'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));

const BIN_FILENAME = "dist-node/index.bin.js";
function validate({
  options
}) {
  if (!options.bin) {
    return new Error('option "bin" must be defined. Example: {"bin": "example-cli"}');
  }

  return true;
}
function manifest(newManifest, {
  options
}) {
  const bin = options.bin;
  newManifest.bin = newManifest.bin || {};
  newManifest.bin[bin] = BIN_FILENAME;
  return newManifest;
}
function build({
  out,
  cwd,
  options
}) {
  const minNodeVersion = options.minNodeVersion,
        v8CompileCache = options.v8CompileCache;
  const binFilename = path.join(out, BIN_FILENAME);

  if (v8CompileCache) {
    const v8CompileCacheRead = path.join(cwd, "node_modules/v8-compile-cache/v8-compile-cache.js");
    const v8CompileCacheWrite = path.join(out, "dist-node/v8-compile-cache.js");
    fs.copyFileSync(v8CompileCacheRead, v8CompileCacheWrite);
  }

  fs.writeFileSync(binFilename, `#!/usr/bin/env node
'use strict';

${minNodeVersion ? `
var ver = process.versions.node;
var majorVer = parseInt(ver.split('.')[0], 10);

if (majorVer < ${minNodeVersion}) {
  console.error('Node version ' + ver + ' is not supported, please use Node.js 6.0 or higher.');
  process.exit(1);
}` : ``}

${v8CompileCache ? `
try {
  require('./v8-compile-cache.js');
} catch (err) {
  // We don't have/need this on legacy builds and dev builds
}` : ``}

let cli;
try {
  cli = require('./index.bundled.js');
} catch (err) {
  // We don't have/need this on legacy builds and dev builds
  // If an error happens here, throw it, that means no code exists at all.
  cli = require('./index.js');
}

if (!cli.autoRun) {
  cli.default().catch(function (error) {
    console.error(error.stack || error.message || error);
    process.exitCode = 1;
  });
}
`);
  fs.chmodSync(binFilename, "755");
}

exports.validate = validate;
exports.manifest = manifest;
exports.build = build;
