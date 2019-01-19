import * as path from 'path';
import babelPluginDynamicImportSyntax from '@babel/plugin-syntax-dynamic-import';
import babelPluginImportMetaSyntax from '@babel/plugin-syntax-import-meta';
import babelPresetEnv from '@babel/preset-env';
import babelPluginDynamicImport from 'babel-plugin-dynamic-import-node-babel-7';
import builtinModules from 'builtin-modules';
import rollupBabel from 'rollup-plugin-babel';
import rollupCommonJs from 'rollup-plugin-commonjs';
import rollupJson from 'rollup-plugin-json';
import rollupNodeResolve from 'rollup-plugin-node-resolve';
export async function build({
  out,
  isFull,
  rollup,
  reporter
}) {
  if (!isFull) {
    return;
  }

  const writeToNode = path.join(out, 'dist-node', 'index.bundled.js');
  const srcBundle = await rollup('node', {
    external: builtinModules,
    plugins: [rollupBabel({
      babelrc: false,
      compact: false,
      presets: [[babelPresetEnv, {
        modules: false,
        targets: {
          node: '6'
        },
        spec: true
      }]],
      plugins: [babelPluginDynamicImport, babelPluginDynamicImportSyntax, babelPluginImportMetaSyntax]
    }), rollupNodeResolve({
      module: false,
      preferBuiltins: false
    }), rollupCommonJs({
      include: 'node_modules/**',
      sourceMap: false
    }), rollupJson({
      include: 'node_modules/**',
      compact: true
    })]
  });
  await srcBundle.write({
    file: writeToNode,
    format: 'cjs',
    exports: 'named'
  });
  reporter.created(writeToNode);
}