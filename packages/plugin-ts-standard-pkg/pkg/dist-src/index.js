import path from 'path';
import fs from 'fs';
import execa from 'execa';
export function validate({
  cwd
}) {
  const tscBin = path.join(cwd, "node_modules/.bin/tsc");
  const tsConfig = path.join(cwd, "tsconfig.json");
  return fs.existsSync(tscBin) && fs.existsSync(tsConfig);
}
export function manifest(newManifest) {
  newManifest.source = newManifest.source || 'dist-src/index.js';
  newManifest.types = newManifest.types || 'dist-types/index.js';
  return newManifest;
}
export async function build({
  cwd,
  out,
  reporter
}) {
  const tscBin = path.join(cwd, "node_modules/.bin/tsc");
  await execa(tscBin, ["--outDir", path.join(out, "dist-src/"), "-d", "--declarationDir", path.join(out, "dist-types/"), "--declarationMap", "false", "--target", "es2018", "--module", "esnext"], {
    cwd
  });
  reporter.created(path.join(out, "dist-src", "index.js"), 'esnext');
  reporter.created(path.join(out, "dist-types", "index.d.ts"), 'types');
}