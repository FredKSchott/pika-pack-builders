import path from 'path';
import fs from 'fs';
import mkdirp from 'mkdirp';
import execa from 'execa';
import { MessageError } from '@pika/types';
const DEFAULT_ENTRYPOINT = 'types';
function getTsConfigPath(options, cwd) {
    return path.resolve(cwd, options.tsconfig || 'tsconfig.json');
}
function getTscBin(cwd) {
    try {
        return require.resolve('typescript/bin/tsc', { paths: [cwd] });
    }
    catch (err) {
        // ignore err
        return null;
    }
}
export function manifest(manifest, { options }) {
    if (options.entrypoint !== null) {
        let keys = options.entrypoint || [DEFAULT_ENTRYPOINT];
        if (typeof keys === 'string') {
            keys = [keys];
        }
        for (const key of keys) {
            manifest[key] = manifest[key] || 'dist-types/index.d.ts';
        }
    }
}
export async function beforeBuild({ options, cwd }) {
    const tsConfigPath = getTsConfigPath(options, cwd);
    if (options.tsconfig && !fs.existsSync(tsConfigPath)) {
        throw new MessageError(`"${tsConfigPath}" file does not exist.`);
    }
}
export async function build({ cwd, out, options, reporter }) {
    await (async () => {
        const writeToTypings = path.join(out, 'dist-types/index.d.ts');
        const importAsNode = path.join(out, 'dist-node', 'index.js');
        if (fs.existsSync(path.join(cwd, 'index.d.ts'))) {
            mkdirp.sync(path.dirname(writeToTypings));
            fs.copyFileSync(path.join(cwd, 'index.d.ts'), writeToTypings);
            return;
        }
        if (fs.existsSync(path.join(cwd, 'src', 'index.d.ts'))) {
            mkdirp.sync(path.dirname(writeToTypings));
            fs.copyFileSync(path.join(cwd, 'src', 'index.d.ts'), writeToTypings);
            return;
        }
        const tsConfigPath = getTsConfigPath(options, cwd);
        const tscBin = getTscBin(cwd);
        const additionalArgs = options.args || [];
        if (!tscBin || !fs.existsSync(tsConfigPath)) {
            reporter.warning(`No manual type definitions found.

To generate types automatically:
  1. Install TypeScript as a "dev" dependency in your project: \`npm install --save-dev typescript@^3.7.0\`
  2. Add a basic tsconfig.json file to your project: \`{"include": ["src"]}\`
  3. Re-run this build.
`);
            return;
        }
        reporter.info('no manual type definitions found, auto-generating...');
        await execa(tscBin, [
            '-d',
            '--allowJs',
            '--emitDeclarationOnly',
            '--declarationMap',
            'false',
            '--project',
            tsConfigPath,
            '--declarationDir',
            path.join(out, 'dist-types/'),
            ...additionalArgs,
        ], { cwd });
    })();
    reporter.created(path.join(out, 'dist-types', 'index.d.ts'), 'types');
}
