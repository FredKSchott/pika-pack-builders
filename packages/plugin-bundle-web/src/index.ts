
import rollupCommonJs from 'rollup-plugin-commonjs';
import rollupJson from 'rollup-plugin-json';
import rollupNodeResolve from 'rollup-plugin-node-resolve';
import path from 'path';
import fs from 'fs';
import {BuilderOptions, MessageError} from '@pika/types';

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

export function manifest(manifest) {
  manifest.module = manifest.module || 'dist-web/index.js';
}

export async function build({out, options, rollup, reporter}: BuilderOptions): Promise<void> {
  const readFromWeb = path.join(out, 'dist-web', 'index.js');
  const writeToWeb = path.join(out, 'dist-web', 'index.bundled.js');

  const srcBundle = await rollup('web', {
    input: readFromWeb,
    plugins: [
      rollupNodeResolve({
        preferBuiltins: true,
      }),
      rollupCommonJs({
        include: 'node_modules/**',
        sourceMap: false,
        namedExports: options.namedExports
      }),
      rollupJson({
        include: 'node_modules/**',
        compact: true,
      }) as any,
    ],
  });

  await srcBundle.write({
    file: writeToWeb,
    format: 'esm',
    exports: 'named',
  });
  reporter.created(writeToWeb);
}
