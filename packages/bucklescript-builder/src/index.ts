import path from "path";
import fs from "fs";
import rollupBuckleScript from 'rollup-plugin-bucklescript'
import {BuilderOptions} from '@pika/types';

export function validate({ cwd }) {
  return fs.existsSync(path.join(cwd, "src/index.re")) || fs.existsSync(path.join(cwd, "src/index.ml"));
}

export function manifest(newManifest) {
  newManifest.es2015 = newManifest.es2015 || 'dist-src/index.js';
  return newManifest;
}

export async function build({cwd, out, rollup, reporter}: BuilderOptions): Promise<void> {
  const writeToSrc = path.join(out, 'dist-src', 'index.js');
  const isReason = fs.existsSync(path.join(cwd, "src/index.re"));

  const srcBundle = await rollup('src', {
    input: isReason ? 'src/index.re' : 'src/index.ml',
    plugins: [
      rollupBuckleScript()
    ],
  });

  await srcBundle.write({
    file: writeToSrc,
    format: 'esm',
    exports: 'named',
  });
  reporter.created(writeToSrc, 'es2015');

}
