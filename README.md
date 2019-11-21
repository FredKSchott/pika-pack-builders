# @pika/pack plugins

This repo contains the official build plugins for @pika/pack.

- **Write your own plugin!** @pika/pack can load build plugins from package name & relative path. Check out [this GitHub template](https://github.com/kevinpollet/pika-pack-plugin-template) or any of the existing build plugins to get started writing your own!
- **Publish & Share your plugin!** These official builders are just the start. Create a PR to add your community plugin to this list!

## Official Plugins

#### Source Builders:

> **NOTE: Include a source builder early in your pipeline.** Source builders take your project source code (ESNext, TS, etc.) and compile it to standard, ES2018 JavaScript. Other builders will then consume that standardized build to base their own work off of.

 - [`@pika/plugin-standard-pkg`](https://github.com/pikapkg/builders/tree/master/packages/plugin-standard-pkg/): Compiles JavaScript/TypeScript to ES2018. Supports personalized, top-level `.babelrc` plugins/config.
 - [`@pika/plugin-ts-standard-pkg`](https://github.com/pikapkg/builders/tree/master/packages/plugin-ts-standard-pkg/): Compiles TypeScript to ES2018 (Uses `tsc` internally instead of Babel, and builds type definitions automatically).
 - [`@pika/plugin-copy-assets`](https://github.com/pikapkg/builders/tree/master/packages/plugin-copy-assets/): Copies static assets from your root source directory into the built `pkg/` directory.
 
#### Distribution Builders:

 - [`@pika/plugin-build-deno`](https://github.com/pikapkg/builders/tree/master/packages/plugin-build-deno/): Builds a distribution that runs on Deno (TS projects only).
 - [`@pika/plugin-build-node`](https://github.com/pikapkg/builders/tree/master/packages/plugin-build-node/): Builds a distribution that runs on Node LTS (v6+).
 - [`@pika/plugin-build-types`](https://github.com/pikapkg/builders/tree/master/packages/plugin-build-types/): Builds TypeScript definitions from your TS, or automatically generate them from your JS. Not required if you use `@pika/plugin-ts-standard-pkg`.
 - [`@pika/plugin-build-web`](https://github.com/pikapkg/builders/tree/master/packages/plugin-build-web/): Builds an ESM distribution optimized for browsers & bundlers.

#### WASM & Non-JS Builders:
 - [`@pika/plugin-wasm-assemblyscript`](https://github.com/pikapkg/builders/tree/master/packages/plugin-wasm-assemblyscript/): Builds WASM from TypeScript using [AssemblyScript](https://github.com/AssemblyScript/assemblyscript).
 - [`@pika/plugin-wasm-emscripten`](https://github.com/pikapkg/issues/1): Builds WASM from C/C++ using [Emscripten](https://github.com/emscripten-core/emscripten) (Coming Soon).
 - [`@pika/plugin-wasm-bindings`](https://github.com/pikapkg/builders/tree/master/packages/plugin-wasm-bindings/): Builds a simple JS wrapper for any WASM build.
  - [`@pika/plugin-source-bucklescript`](https://github.com/pikapkg/builders/tree/master/packages/plugin-source-bucklescript/): Builds ES2018 JavaScript from ReasonML or OCaml via BuckleScript.

#### Advanced Builders:
 - [`@pika/plugin-bundle-node`](https://github.com/pikapkg/builders/tree/master/packages/plugin-bundle-node/): Creates a Node.js build with all code (including dependencies) bundled into a single file. Useful for CLIs.
 - [`@pika/plugin-bundle-web`](https://github.com/pikapkg/builders/tree/master/packages/plugin-bundle-web/): Creates a ESM build with all code (including dependencies) bundled. Useful for unpkg & serving code directly to browsers.
 - [`@pika/plugin-simple-bin`](https://github.com/pikapkg/builders/tree/master/packages/plugin-simple-bin/):  Generates & configures a CLI wrapper to run your library from the command line.
 
 
## Community Plugins

- [`@ryaninvents/plugin-bundle-zip-node`](https://www.npmjs.com/package/@ryaninvents/plugin-bundle-zip-node): zip built files for Node.js.
- [`@ryaninvents/plugin-bundle-dependencies`](https://www.npmjs.com/package/@ryaninvents/plugin-bundle-dependencies): zip your package's dependencies.
- [`@ryaninvents/plugin-bundle-nextjs`](https://www.npmjs.com/package/@ryaninvents/plugin-bundle-nextjs): Package a Next.js app for AWS Lambda.
- [`pika-plugin-minify`](https://www.npmjs.com/package/pika-plugin-minify): Minifies your index.js files in `/pkg/*` using terser.
- [`pika-plugin-unpkg-field`](https://www.npmjs.com/package/pika-plugin-unpkg-field): sets the `"unpkg"` field in `pkg/package.json`.
- [`pika-plugin-pkg-node`](https://www.npmjs.com/package/pika-plugin-pkg-node): Package a Node.js app into an executable.
- [`pika-plugin-merge-properties`](https://github.com/jabuco/pika-plugin-merge-properties): Merge selected existing package.json properties into built package.json
- [`pika-plugin-add-properties`](https://github.com/jabuco/pika-plugin-add-properties): Add custom values to built package.json
- [`pika-plugin-package.json`](https://github.com/yumauri/pika-plugin-package.json): Modify (add/remove/merge) built `pkg/package.json` with new properties.
