import babelPluginDynamicImportSyntax from '@babel/plugin-syntax-dynamic-import';
import babelPluginImportMetaSyntax from '@babel/plugin-syntax-import-meta';
import babelPresetEnv from '@babel/preset-env';
import { BuilderOptions, MessageError } from '@pika/types';
import babelPluginDynamicImport from 'babel-plugin-dynamic-import-node-babel-7';
import builtinModules from 'builtin-modules';
import * as fs from 'fs';
import * as path from 'path';
import rollupBabel from 'rollup-plugin-babel';
import rollupCommonJs from 'rollup-plugin-commonjs';
import rollupJson from 'rollup-plugin-json';
import rollupNodeResolve from 'rollup-plugin-node-resolve';
import {rollup} from 'rollup';

const DEFAULT_MIN_NODE_VERSION = '6';

export async function beforeJob({out}: BuilderOptions) {
  const srcDirectory = path.join(out, "dist-src/");
  if (!fs.existsSync(srcDirectory)) {
    throw new MessageError('"dist-src/" does not exist, or was not yet created in the pipeline.');
  }
  const srcEntrypoint = path.join(out, "dist-src/index.js");
  if (!fs.existsSync(srcEntrypoint)) {
    throw new MessageError('"dist-src/index.js" is the expected standard entrypoint, but it does not exist.');
  }
}

export async function build({out, isFull, reporter, options}: BuilderOptions): Promise<void> {
  if (!isFull) {
    return;
  }

  const writeToNodeBundled = path.join(out, 'dist-node', 'index.bundled.js');
  const result = await rollup({
    input: path.join(out, 'dist-src/index.js'),
    external: builtinModules as string[],
    plugins: [
      rollupBabel({
        babelrc: false,
        compact: false,
        presets: [
          [
            babelPresetEnv,
            {
              modules: false,
              targets: {node: options.minNodeVersion || DEFAULT_MIN_NODE_VERSION},
              spec: true,
            },
          ],
        ],
        plugins: [
          babelPluginDynamicImport,
          babelPluginDynamicImportSyntax,
          babelPluginImportMetaSyntax,
        ],
      }),
      rollupNodeResolve({
        module: false,
        preferBuiltins: false,
      }),
      rollupCommonJs({
        include: 'node_modules/**',
        sourceMap: false,
      }),
      rollupJson({
        include: 'node_modules/**',
        compact: true,
      }),
    ],
  });

  await result.write({
    file: writeToNodeBundled,
    format: 'cjs',
    exports: 'named',
  });
  reporter.created(writeToNodeBundled);
}
