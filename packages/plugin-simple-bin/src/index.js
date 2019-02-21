import path from "path";
import fs from "fs";
import esprima from 'esprima';
import {MessageError} from '@pika/types';
const BIN_FILENAME = "dist-node/index.bin.js";

export function beforeBuild({ options }) {
  if (!options.bin) {
    return new MessageError(
      'option "bin" must be defined. Example: {"bin": "example-cli"}'
    );
  }
}

export async function beforeJob({out}) {
  const nodeDirectory = path.join(out, "dist-node");
  if (!fs.existsSync(nodeDirectory)) {
    throw new MessageError('"dist-node/" does not exist, or was not yet created in the pipeline.');
  }
  const nodeEntrypoint = path.join(out, "dist-node/index.js");
  if (!fs.existsSync(nodeEntrypoint)) {
    throw new MessageError('"dist-node/index.js" is the expected standard entrypoint, but it does not exist.');
  }

  // Check index.js for valid exports
  const possibleExports = ['run', 'cli'];
  const program = fs.readFileSync(nodeEntrypoint, { encoding: 'utf-8' })
  const parsed = esprima.parse(program);
  const candidates = parsed.body.filter((stmt) => {
    // Exports are defined as an ExpressionStatement that are a kind of assignment
    // in which the left-hand object is exports and the right hand type is an Identifier
    if(
      stmt.type === "ExpressionStatement" &&
      stmt.expression.type === "AssignmentExpression" &&
      stmt.expression.left.object.name === "exports" &&
      stmt.expression.right.type === 'Identifier'
    ) {
      // And the left-hand property name is either a named export of "run" or "cli"
      // or the left-hand property value is default
      if(
        possibleExports.indexOf(stmt.expression.left.property.name) > -1 ||
        stmt.expression.left.property.value === 'default'
      ) {
        return true;
      }
    }
    return false;
  });

  if (candidates.length === 0) {
    throw new MessageError('"dist-node/index.js" must have an export of "run", "cli", or a default export, but it does not.');
  }
}

export function manifest(newManifest, { options }) {
  const { bin } = options;
  newManifest.bin = newManifest.bin || {};
  newManifest.bin[bin] = BIN_FILENAME;
  return newManifest;
}

export function build({ out, cwd, options, reporter }) {
  const { minNodeVersion, v8CompileCache } = options;
  const binFilename = path.join(out, BIN_FILENAME);
  if (v8CompileCache) {
    const v8CompileCacheRead = path.join(
      cwd,
      "node_modules/v8-compile-cache/v8-compile-cache.js"
    );
    const v8CompileCacheWrite = path.join(out, "dist-node/v8-compile-cache.js");
    fs.copyFileSync(v8CompileCacheRead, v8CompileCacheWrite);
  }

  fs.writeFileSync(
    binFilename,
    `#!/usr/bin/env node
'use strict';
${
      minNodeVersion
        ? `
const ver = process.versions.node;
const majorVer = parseInt(ver.split('.')[0], 10);

if (majorVer < ${minNodeVersion}) {
  console.error('Node version ' + ver + ' is not supported, please use Node.js ${minNodeVersion}.0 or higher.');
  process.exit(1);
}
`
        : ``
    }${
      v8CompileCache
        ? `
try {
  require('./v8-compile-cache.js');
} catch (err) {
  // We don't have/need this on legacy builds and dev builds
}
`
        : ``
    }
let cli;
try {
  cli = require('./index.bundled.js');
} catch (err) {
  // We don't have/need this on legacy builds and dev builds
  // If an error happens here, throw it, that means no Node.js distribution exists at all.
  cli = require('../');
}

if (cli.autoRun) {
  return;
}

const run = cli.run || cli.cli || cli.default;
run(process.argv).catch(function (error) {
  console.error(error.stack || error.message || error);
  process.exitCode = 1;
});
`
  );

  fs.chmodSync(binFilename, "755");
  reporter.created(path.join(out, BIN_FILENAME), `bin.${options.bin}`);
}
