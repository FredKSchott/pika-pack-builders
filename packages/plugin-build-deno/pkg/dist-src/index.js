import path from 'path';
import fs from 'fs';
import mkdirp from 'mkdirp';
export async function manifest(manifest, {
  cwd
}) {
  const pathToTsconfig = path.join(cwd, 'tsconfig.json');

  if (!fs.existsSync(pathToTsconfig)) {
    return;
  }

  manifest.deno = manifest.deno || 'dist-deno/index.ts';
}
export async function build({
  cwd,
  out,
  src
}) {
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