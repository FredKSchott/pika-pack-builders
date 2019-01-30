import babelPluginDynamicImportSyntax from '@babel/plugin-syntax-dynamic-import';
import babelPluginImportMetaSyntax from '@babel/plugin-syntax-import-meta';
import babelPresetEnv from '@babel/preset-env';
import path from 'path';
import fs from 'fs';
import rollupBabel from 'rollup-plugin-babel';
import { MessageError } from '@pika/types';
import { rollup } from 'rollup';
export async function beforeBuild({ options }) {
    if (!options.name) {
        throw new MessageError('A "name" option is required for UMD builds.');
    }
}
export async function beforeJob({ out }) {
    const srcDirectory = path.join(out, "dist-src/");
    if (!fs.existsSync(srcDirectory)) {
        throw new MessageError('"dist-src/" does not exist, or was not yet created in the pipeline.');
    }
    const srcEntrypoint = path.join(out, "dist-src/index.js");
    if (!fs.existsSync(srcEntrypoint)) {
        throw new MessageError('"dist-src/index.js" is the expected standard entrypoint, but it does not exist.');
    }
}
export function manifest(manifest) {
    manifest["umd:main"] = 'dist-umd/index.js';
}
export async function build({ out, reporter, options }) {
    const writeToUmd = path.join(out, 'dist-umd', 'index.js');
    const result = await rollup({
        input: path.join(out, 'dist-src/index.js'),
        plugins: [
            rollupBabel({
                babelrc: false,
                compact: false,
                presets: [
                    [
                        babelPresetEnv,
                        {
                            modules: false,
                            spec: true,
                            targets: {
                                // Recommended in: https://jamie.build/last-2-versions
                                browsers: [
                                    ">0.25%",
                                    "not ie 11",
                                    "not op_mini all"
                                ],
                            },
                        },
                    ],
                ],
                plugins: [babelPluginDynamicImportSyntax, babelPluginImportMetaSyntax],
            }),
        ],
        onwarn: ((warning, defaultOnWarnHandler) => {
            // // Unresolved external imports are expected
            if (warning.code === 'UNRESOLVED_IMPORT' &&
                !(warning.source.startsWith('./') || warning.source.startsWith('../'))) {
                return;
            }
            defaultOnWarnHandler(warning);
        }),
    });
    await result.write({
        file: writeToUmd,
        format: 'umd',
        exports: 'named',
        name: options.name,
    });
    reporter.created(writeToUmd, 'umd:main');
}
