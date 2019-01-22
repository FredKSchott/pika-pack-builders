import path from "path";
import fs from "fs";
import rollupBuckleScript from 'rollup-plugin-bucklescript';
import { rollup } from 'rollup';
export function validate({
  cwd
}) {
  return fs.existsSync(path.join(cwd, "src/index.re")) || fs.existsSync(path.join(cwd, "src/index.ml"));
}
export function manifest(newManifest) {
  newManifest.es2015 = newManifest.es2015 || 'dist-src/index.js';
  return newManifest;
}
export async function build({
  cwd,
  out,
  reporter
}) {
  const writeToSrc = path.join(out, 'dist-src', 'index.js');
  const isReason = fs.existsSync(path.join(cwd, "src/index.re"));
  const result = await rollup({
    input: isReason ? 'src/index.re' : 'src/index.ml',
    plugins: [rollupBuckleScript()]
  });
  await result.write({
    file: writeToSrc,
    format: 'esm',
    exports: 'named'
  });
  reporter.created(writeToSrc, 'es2015');
}