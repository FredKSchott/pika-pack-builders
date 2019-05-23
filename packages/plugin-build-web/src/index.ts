import babelPluginDynamicImportSyntax from '@babel/plugin-syntax-dynamic-import';
import babelPluginImportMetaSyntax from '@babel/plugin-syntax-import-meta';
import babelPresetEnv from '@babel/preset-env';
import path from 'path';
import fs from 'fs';
import rollupBabel from 'rollup-plugin-babel';
import {BuilderOptions, MessageError} from '@pika/types';
import {rollup} from 'rollup';

export async function beforeJob({out}: BuilderOptions) {
  const srcDirectory = path.join(out, 'dist-src/');
  if (!fs.existsSync(srcDirectory)) {
    throw new MessageError('"dist-src/" does not exist, or was not yet created in the pipeline.');
  }
  const srcEntrypoint = path.join(out, 'dist-src/index.js');
  if (!fs.existsSync(srcEntrypoint)) {
    throw new MessageError('"dist-src/index.js" is the expected standard entrypoint, but it does not exist.');
  }
}

export function manifest(manifest) {
  manifest.module = manifest.module || 'dist-web/index.js';
}

export async function build({out, reporter}: BuilderOptions): Promise<void> {
  const writeToWeb = path.join(out, 'dist-web', 'index.js');

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
            },
          ],
        ],
        plugins: [babelPluginDynamicImportSyntax, babelPluginImportMetaSyntax],
      }),
    ],
    onwarn: ((warning, defaultOnWarnHandler) => {
      // // Unresolved external imports are expected
      if (
        warning.code === 'UNRESOLVED_IMPORT' &&
        !(warning.source.startsWith('./') || warning.source.startsWith('../'))
      ) {
        return;
      }
      defaultOnWarnHandler(warning);
    }) as any,
  });

  await result.write({
    file: writeToWeb,
    format: 'esm',
    exports: 'named',
  });
  reporter.created(writeToWeb, 'module');
}
