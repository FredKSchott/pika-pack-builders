import path from 'path';
import fs from 'fs';
import {BuilderOptions, MessageError} from '@pika/types';
import {rollup} from 'rollup';
import rollupBabel from 'rollup-plugin-babel';

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

export async function build({out, cwd, options, reporter}: BuilderOptions): Promise<void> {
  const writeToWeb = path.join(out, 'dist-web', 'index.js');

  const result = await rollup({
    input: options.input || path.join(cwd, `src/index.js`),
    plugins: [
      rollupBabel({
        exclude: 'node_modules/**',
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
    sourcemap: options.sourcemap === undefined ? true : options.sourcemap,
  });
  reporter.created(writeToWeb, 'module');
}
