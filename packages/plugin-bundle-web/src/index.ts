import rollupCommonJs from 'rollup-plugin-commonjs';
import rollupJson from 'rollup-plugin-json';
import rollupNodeResolve from 'rollup-plugin-node-resolve';
import {terser as rollupTerser} from 'rollup-plugin-terser';
import path from 'path';
import fs from 'fs';
import {BuilderOptions, MessageError} from '@pika/types';
import {rollup} from 'rollup';

export async function beforeJob({out}: BuilderOptions) {
  const srcDirectory = path.join(out, 'dist-web/');
  if (!fs.existsSync(srcDirectory)) {
    throw new MessageError('"dist-web/" does not exist. "plugin-bundle-web" requires "plugin-build-dev" to precede in pipeline.');
  }
  const srcEntrypoint = path.join(out, 'dist-web/index.js');
  if (!fs.existsSync(srcEntrypoint)) {
    throw new MessageError('"dist-web/index.js" is the expected standard entrypoint, but it does not exist.');
  }
}

export async function build({out, options, reporter}: BuilderOptions): Promise<void> {
  const readFromWeb = path.join(out, 'dist-web', 'index.js');
  const writeToWeb = path.join(out, 'dist-web', 'index.bundled.js');
  const result = await rollup({
    input: readFromWeb,
    plugins: [
      rollupNodeResolve({
        preferBuiltins: true,
        browser: !!options.browser,
      }),
      rollupCommonJs({
        include: 'node_modules/**',
        sourceMap: false,
        namedExports: options.namedExports,
      }),
      rollupJson({
        include: 'node_modules/**',
        compact: true,
      }) as any,
      options.minify !== false
        ? rollupTerser(
          typeof options.minify === 'object'
            ? options.minify
            : undefined
        )
        : undefined,
    ],
  });

  await result.write({
    file: writeToWeb,
    format: 'esm',
    exports: 'named',
  });
  reporter.created(writeToWeb);
}

export function manifest(manifest: any, {options}: BuilderOptions) {
  if(options.unpkg !== false){
    manifest.unpkg = 'dist-web/index.bundled.js';
  }
}
