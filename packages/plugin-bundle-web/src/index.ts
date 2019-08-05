import rollupCommonJs from 'rollup-plugin-commonjs';
import rollupJson from 'rollup-plugin-json';
import rollupNodeResolve from 'rollup-plugin-node-resolve';
import {terser as rollupTerser} from 'rollup-plugin-terser';
import rollupBabel from 'rollup-plugin-babel';
import babelPluginDynamicImportSyntax from '@babel/plugin-syntax-dynamic-import';
import babelPluginImportMetaSyntax from '@babel/plugin-syntax-import-meta';
import babelPresetEnv from '@babel/preset-env';

import path from 'path';
import fs from 'fs';
import {BuilderOptions, MessageError} from '@pika/types';
import {rollup} from 'rollup';

export async function beforeJob({out}: BuilderOptions) {
  const srcDirectory = path.join(out, 'dist-web/');
  if (!fs.existsSync(srcDirectory)) {
    throw new MessageError(
      '"dist-web/" does not exist. "plugin-bundle-web" requires "plugin-build-dev" to precede in pipeline.',
    );
  }
  const srcEntrypoint = path.join(out, 'dist-web/index.js');
  if (!fs.existsSync(srcEntrypoint)) {
    throw new MessageError('"dist-web/index.js" is the expected standard entrypoint, but it does not exist.');
  }
}

export function manifest(manifest, {options}: BuilderOptions) {
  if (options.entrypoint) {
    if (options.entrypoint instanceof Array) {
      options.entrypoint.forEach((entrypoint) => {
        manifest[entrypoint] = 'dist-web/index.bundled.js';
      })
    } else {
      manifest[options.entrypoint] = 'dist-web/index.bundled.js';
    }
  }
}

export async function build({out, options, reporter}: BuilderOptions): Promise<void> {
  const readFromWeb = path.join(out, 'dist-web', 'index.js');
  const writeToWeb = path.join(out, 'dist-web');
  const writeToWebBundled = path.join(writeToWeb, 'index.bundled.js');
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
      rollupBabel({
        babelrc: false,
        compact: false,
        presets: [
          [
            babelPresetEnv,
            {
              modules: false,
              targets: options.targets || {esmodules: true},
            },
          ],
        ],
        plugins: [babelPluginDynamicImportSyntax, babelPluginImportMetaSyntax],
      }),
      options.minify !== false
        ? rollupTerser(typeof options.minify === 'object' ? options.minify : undefined)
        : undefined,
    ],
  });

  await result.write({
    dir: writeToWeb,
    entryFileNames: '[name].bundled.js',
    chunkFileNames: '[name]-[hash].bundled.js',
    format: 'esm',
    exports: 'named',
    sourcemap: options.sourcemap === undefined ? true : options.sourcemap,
  });
  reporter.created(writeToWebBundled);
}
