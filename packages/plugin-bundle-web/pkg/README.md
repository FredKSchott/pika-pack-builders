# @pika/plugin-bundle-web

> A [@pika/pack](https://github.com/pikapkg/pack) build plugin.
> Adds a bundled Web distribution to your package, built & optimized to run in most web browsers (and bundlers). Useful for hosting on a CDN like UNPKG and/or when package dependencies aren't written to run natively on the web.


## Install

```sh
# npm:
npm install @pika/plugin-bundle-web --save-dev
# yarn:
yarn add @pika/plugin-bundle-web --dev
```


## Usage

```js
{
  "name": "example-package-json",
  "version": "1.0.0",
  "@pika/pack": {
    "pipeline": [
      ["@pika/plugin-standard-pkg"],
      ["@pika/plugin-build-web"], // Required to precede in pipeline
      ["@pika/plugin-bundle-web", { /* options (optional) */ }]
    ]
  }
}
```

For more information about @pika/pack & help getting started, [check out the main project repo](https://github.com/pikapkg/pack).

## Options

- `"sourcemap"` (Default: `"true"`): Adds a [source map](https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/) for this build.
- `"browser"` (Default: `false`): If true, this plugin will respect the "browser" field in bundled dependencies over the usual "main" Node-specific entrypoint. This may be required for some dependencies, but may cause problems with others. YMMV.
- `"namedExports"` (Default: `undefined`): Ecplicitly specify unresolvable named exports (See [`rollup-plugin-commonjs`](https://github.com/rollup/rollup-plugin-commonjs/tree/v9.2.0#custom-named-exports) for more information).
- `"minify"` (Default: `true`): Specify if bundle should be minifed using [`terser`](https://github.com/terser-js/terser) or not. Can also be [`terser` options object](https://github.com/terser-js/terser#minify-options) to further tweak minification.
- `"targets"` (Default: `{"esmodules": true}`): The browsers supported/targeted by the build. Defaults to support all browsers that support ES Module (ESM) syntax.
- `"entrypoint"`: Add a package.json entrypoint for the bundled build. perfect for pointing [UNPKG](https://unpkg.com/) and other CDNs to this build. 
  - `{"entrypoint: "unpkg"}` will create an "unpkg" entrypoint that points to "dist-web/index.bundled.js".
  - `{"entrypoint: ["unpkg", "jsdeliver"]}` will create both "unpkg" & "jsdeliver" "dist-web/index.bundled.js" entrypoints.

## Result

1. Adds a web bundled distribution to your built package: `dist-web/index.bundled.js`
  1. ES Module (ESM) syntax
  1. Transpiled to run on all browsers where ES Module syntax is supported.
  1. All dependencies inlined into this file.
  1. Minified using terser (Can optionally be skipped)
  1. (if specified) Adds the file to your specified "entrypoint".

Note that this does not add or modify the "module" entrypoint to your package.json. Bundles should continue to use the "module" entrypoint, while this build can be loaded directly in the browser (from a CDN like UNPKG).
