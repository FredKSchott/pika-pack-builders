

import babelPluginDynamicImportSyntax from '@babel/plugin-syntax-dynamic-import';
import babelPluginImportMetaSyntax from '@babel/plugin-syntax-import-meta';
import babelPresetEnv from '@babel/preset-env';
import path from 'path';
import rollupBabel from 'rollup-plugin-babel';
import {BuilderOptions} from '@pika/types';

export function manifest(manifest) {
  manifest.module = manifest.module || 'dist-web/index.js';
}

export async function build({out, rollup, reporter}: BuilderOptions): Promise<void> {
  const writeToWeb = path.join(out, 'dist-web', 'index.js');

  const srcBundle = await rollup('web', {
    plugins: [
      rollupBabel({
        babelrc: false,
        compact: false,
        presets: [
          [
            babelPresetEnv,
            {
              modules: false,
              targets: {esmodules: true},
              spec: true,
            },
          ],
        ],
        plugins: [babelPluginDynamicImportSyntax, babelPluginImportMetaSyntax],
      }),
    ],
    onwarn: (warning, defaultOnWarnHandler) => {
      // // Unresolved external imports are expected
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
    file: writeToWeb,
    format: 'esm',
    exports: 'named',
  });
  reporter.created(writeToWeb, 'module');
}
