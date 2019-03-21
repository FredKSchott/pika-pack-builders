import path from 'path';
import fs from 'fs';
import util from 'util';
import glob from 'glob';
import mkdirp from 'mkdirp';
import { MessageError } from '@pika/types';
import execa from "execa";
export async function beforeBuild({ cwd }) {
    return execa('deno', ["--version"], { cwd }).catch((err) => {
        throw new MessageError('@pika/plugin-build-deno can only handle packages already written for Deno. Exiting because we could not find deno on your machine.');
    });
}
export async function manifest(manifest, { cwd }) {
    const pathToTsconfig = path.join(cwd, 'tsconfig.json');
    if (!fs.existsSync(pathToTsconfig)) {
        return;
    }
    manifest.deno = manifest.deno || 'dist-deno/index.ts';
}
export async function build({ cwd, out, options }) {
    const pathToTsconfig = path.join(cwd, 'tsconfig.json');
    if (!fs.existsSync(pathToTsconfig)) {
        return;
    }
    const files = await util.promisify(glob)(`src/**/*`, {
        cwd,
        nodir: true,
        absolute: true,
        ignore: (options.exclude || []).map(g => path.join('src', g)),
    });
    for (const fileAbs of files) {
        if (path.extname(fileAbs) !== '.ts' && path.extname(fileAbs) !== '.tsx') {
            continue;
        }
        const fileRel = path.relative(cwd, fileAbs);
        const writeToTypeScript = path.resolve(out, fileRel).replace(`${path.sep}src${path.sep}`, `${path.sep}dist-deno${path.sep}`);
        mkdirp.sync(path.dirname(writeToTypeScript));
        fs.copyFileSync(fileAbs, writeToTypeScript);
    }
}
