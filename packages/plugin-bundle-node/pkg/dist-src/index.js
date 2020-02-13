import babelPluginDynamicImportSyntax from '@babel/plugin-syntax-dynamic-import';
import babelPluginImportMetaSyntax from '@babel/plugin-syntax-import-meta';
import babelPresetEnv from '@babel/preset-env';
import { MessageError } from '@pika/types';
import babelPluginDynamicImport from 'babel-plugin-dynamic-import-node-babel-7';
import builtinModules from 'builtin-modules';
import * as fs from 'fs';
import * as path from 'path';
import rollupBabel from 'rollup-plugin-babel';
import rollupCommonJs from '@rollup/plugin-commonjs';
import rollupJson from '@rollup/plugin-json';
import rollupNodeResolve from '@rollup/plugin-node-resolve';
import { rollup } from 'rollup';
const DEFAULT_MIN_NODE_VERSION = '8';
export async function beforeJob({ out }) {
    const srcDirectory = path.join(out, 'dist-src/');
    if (!fs.existsSync(srcDirectory)) {
        throw new MessageError('"dist-src/" does not exist, or was not yet created in the pipeline.');
    }
    const srcEntrypoint = path.join(out, 'dist-src/index.js');
    if (!fs.existsSync(srcEntrypoint)) {
        throw new MessageError('"dist-src/index.js" is the expected standard entrypoint, but it does not exist.');
    }
}
export async function build({ out, reporter, options }) {
    const writeToNode = path.join(out, 'dist-node');
    const writeToNodeBundled = path.join(writeToNode, 'index.bundled.js');
    const result = await rollup({
        input: path.join(out, 'dist-src/index.js'),
        external: builtinModules,
        plugins: [
            rollupBabel({
                babelrc: false,
                compact: false,
                presets: [
                    [
                        babelPresetEnv,
                        {
                            modules: false,
                            targets: { node: options.minNodeVersion || DEFAULT_MIN_NODE_VERSION },
                            spec: true,
                        },
                    ],
                ],
                plugins: [babelPluginDynamicImport, babelPluginDynamicImportSyntax, babelPluginImportMetaSyntax],
            }),
            rollupNodeResolve({
                mainFields: ['main'],
                preferBuiltins: false,
            }),
            rollupCommonJs({
                sourceMap: false,
            }),
            rollupJson({
                compact: true,
            }),
        ],
    });
    await result.write({
        dir: writeToNode,
        entryFileNames: '[name].bundled.js',
        chunkFileNames: '[name]-[hash].bundled.js',
        format: 'cjs',
        exports: 'named',
        sourcemap: options.sourcemap === undefined ? true : options.sourcemap,
    });
    reporter.created(writeToNodeBundled);
}
