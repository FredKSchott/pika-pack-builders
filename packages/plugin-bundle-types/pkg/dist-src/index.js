import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';
import { MessageError } from '@pika/types';
import { rollup } from 'rollup';
import rollupPluginDts from 'rollup-plugin-dts';
const DEFAULT_ENTRYPOINT = 'types';
export async function beforeJob({ out }) {
    const typesDir = path.join(out, 'dist-types');
    if (!fs.existsSync(typesDir)) {
        throw new MessageError('No "dist-types/" folder exists to bundle.');
    }
    const typesEntrypoint = path.join(out, 'dist-types/index.d.ts');
    if (!fs.existsSync(typesEntrypoint)) {
        throw new MessageError('A "dist-types/index.d.ts" entrypoint is required, but none was found.');
    }
}
export function manifest(manifest, { options }) {
    if (options.entrypoint !== null) {
        let keys = options.entrypoint || [DEFAULT_ENTRYPOINT];
        if (typeof keys === 'string') {
            keys = [keys];
        }
        for (const key of keys) {
            manifest[key] = 'dist-types/index.d.ts';
        }
    }
}
export async function build({ out, options, reporter }) {
    const readFromTypes = path.join(out, 'dist-types', 'index.d.ts');
    const writeToTypes = path.join(out, 'dist-types');
    const writeToTypesBundled = path.join(writeToTypes, 'index.d.ts');
    const result = await rollup({
        input: readFromTypes,
        plugins: [rollupPluginDts()],
    });
    rimraf.sync(writeToTypes);
    await result.write({
        file: writeToTypesBundled,
        format: 'esm',
    });
    reporter.created(writeToTypesBundled);
}
