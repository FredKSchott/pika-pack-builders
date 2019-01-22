import path from 'path';
import fs from 'fs';
import execa from 'execa';
import {BuilderOptions, MessageError} from '@pika/types';
import {Lint} from 'standard-pkg';

export async function beforeBuild({cwd, reporter}: BuilderOptions) {
  const tscBin = path.join(cwd, "node_modules/.bin/tsc");
  if (!fs.existsSync(tscBin)) {
    throw new MessageError('"tsc" executable not found. Make sure "typescript" is installed as a project dependency.');
  };
  const tsConfigLoc = path.join(cwd, "tsconfig.json");
  if (!fs.existsSync(tsConfigLoc)) {
    throw new MessageError('"tsconfig.json" manifest not found.');
  };
  const tsConfig = JSON.parse(fs.readFileSync(tsConfigLoc, {encoding: 'utf8'}));
  const {target, module: mod} = tsConfig.compilerOptions;
  if (target !== 'es2018') {
    reporter.warning(`tsconfig.json [compilerOptions.target] should be "es2018", but found "${target}". You may encounter problems building.`);
  }
  if (mod !== 'esnext') {
    reporter.warning(`tsconfig.json [compilerOptions.module] should be "esnext", but found "${mod}". You may encounter problems building.`);
  }
}

export async function afterJob({out}: BuilderOptions) {
  const linter = new Lint(out);
  await linter.init();
  linter.summary();
}

export function manifest(newManifest) {
  newManifest.source = newManifest.source || 'dist-src/index.js';
  newManifest.types = newManifest.types || 'dist-types/index.js';
  return newManifest;
}

export async function build({cwd, out, reporter}: BuilderOptions): Promise<void> {
  const tscBin = path.join(cwd, "node_modules/.bin/tsc");
    await execa(
      tscBin,
      [
        "--outDir",
        path.join(out, "dist-src/"),
        "-d",
        "--declarationDir",
        path.join(out, "dist-types/"),
        "--declarationMap",
        "false",
        "--target",
        "es2018",
        "--module",
        "esnext",
      ],
      { cwd }
    );
  reporter.created(path.join(out, "dist-src", "index.js"), 'esnext');
  reporter.created(path.join(out, "dist-types", "index.d.ts"), 'types');
}
