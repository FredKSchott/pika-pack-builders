import path from 'path';
import babelPluginDynamicImportSyntax from '@babel/plugin-syntax-dynamic-import';
import babelPluginImportMetaSyntax from '@babel/plugin-syntax-import-meta';
import babelPresetEnv from '@babel/preset-env';
import babelPluginDynamicImport from 'babel-plugin-dynamic-import-node-babel-7';
import builtinModules from 'builtin-modules';
import rollupBabel from 'rollup-plugin-babel';
import {BuilderOptions} from '@pika/types';

export function manifest(manifest) {
  manifest.main = manifest.main || 'dist-node/index.js';
}

export async function build({out, rollup}: BuilderOptions): Promise<void> {
  const writeToNode = path.join(out, 'dist-node', 'index.js');

  // TODO: KEEP FIXING THIS,
  const srcBundle = await rollup('node', {
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
              targets: {node: '6'},
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
    ],
    onwarn: (warning, defaultOnWarnHandler) => {
      // Unresolved external imports are expected
      if (
        warning.code === 'UNRESOLVED_IMPORT' &&
        !(warning.source.startsWith('./') || warning.source.startsWith('../'))
      ) {
        return;
      }
      defaultOnWarnHandler(warning);
    },
  });

  await srcBundle.write({
    file: writeToNode,
    format: 'cjs',
    exports: 'named',
  });
}
