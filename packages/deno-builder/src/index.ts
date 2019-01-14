

import path from 'path';
import fs from 'fs';
import mkdirp from 'mkdirp';
import {BuilderOptions} from '@pika/types';

export async function manifest(manifest, {cwd}: BuilderOptions): Promise<void> {
  const pathToTsconfig = path.join(cwd, 'tsconfig.json');
  if (!fs.existsSync(pathToTsconfig)) {
    return;
  }
  manifest.deno = manifest.deno || 'dist-deno/index.ts';
}

export async function build({cwd, out, src}: BuilderOptions): Promise<void> {
  const pathToTsconfig = path.join(cwd, 'tsconfig.json');
  if (!fs.existsSync(pathToTsconfig)) {
    return;
  }
  for (const fileAbs of src.files) {
    const fileRel = path.relative(cwd, fileAbs);
    console.log(fileRel, fileRel.replace('/src/', '/dist-deno/'), path.resolve(out, fileRel));
    const writeToTypeScript = path.resolve(out, fileRel).replace('/src/', '/dist-deno/');
    mkdirp.sync(path.dirname(writeToTypeScript));
    fs.copyFileSync(fileAbs, writeToTypeScript);
  }
}
