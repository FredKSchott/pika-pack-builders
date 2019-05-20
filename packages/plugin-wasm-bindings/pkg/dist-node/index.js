'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));
var mkdirp = _interopDefault(require('mkdirp'));

const SRC_WRAPPER = `export function createWASM(deps = {}) {
  const url = new URL("../assets/index.wasm", import.meta.url);
  const input = window.fetch(url);
  return WebAssembly.instantiateStreaming(input, deps);
}
export default createWASM;
`;
const WEB_WRAPPER = `export function createWASM(deps = {}) {
  if (typeof __webpack_require__ !== "undefined") {
    return __webpack_require__("../assets/index.wasm");
  }
  const url = new URL("../assets/index.wasm", import.meta.url);
  const input = window.fetch(url);
  return WebAssembly.instantiateStreaming(input, deps);
}
export default createWASM;
`;
const NODE_WRAPPER = `const fs = require('fs');
const path = require('path');
exports.default = exports.createWASM = function createWASM(deps = {}) {
  const buf = fs.readFileSync(path.join(__dirname, '../assets/index.wasm'));
  return WebAssembly.instantiate(buf, deps);
}
`;
const TYPE_DEF = `declare class WASMInstance {
  readonly exports: any;
  constructor(module: any, importObject?: any);
}
interface ResultObject {module: any; instance: WASMInstance}
export function createWASM(importObject?: object): Promise<ResultObject>;
export default function createWASM(importObject?: object): Promise<ResultObject>;
`;
function validate({
  cwd
}) {
  return true;
}
function manifest(newManifest) {
  newManifest["src"] = "dist-src/index.js";
  newManifest["web"] = "dist-web/index.js";
  newManifest["node"] = "dist-node/index.js";
  newManifest["types"] = "dist-types/index.js";
  return newManifest;
}
async function build({
  out,
  reporter
}) {
  mkdirp.sync(path.join(out, "dist-src"));
  fs.writeFileSync(path.join(out, "dist-src/index.js"), SRC_WRAPPER, "utf8");
  reporter.created(path.join(out, "dist-src/index.js"), 'esnext');
  mkdirp.sync(path.join(out, "dist-web"));
  fs.writeFileSync(path.join(out, "dist-web/index.js"), WEB_WRAPPER, "utf8");
  reporter.created(path.join(out, "dist-web/index.js"), 'module');
  mkdirp.sync(path.join(out, "dist-node"));
  fs.writeFileSync(path.join(out, "dist-node/index.js"), NODE_WRAPPER, "utf8");
  reporter.created(path.join(out, "dist-node/index.js"), 'main');
  mkdirp.sync(path.join(out, "dist-types"));
  fs.writeFileSync(path.join(out, "dist-types/index.d.ts"), TYPE_DEF, "utf8");
  reporter.created(path.join(out, "dist-types/index.d.ts"), 'types');
}

exports.build = build;
exports.manifest = manifest;
exports.validate = validate;
