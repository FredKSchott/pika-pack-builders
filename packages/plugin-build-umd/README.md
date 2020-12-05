# @pika/plugin-build-umd

> A [@pika/pack](https://github.com/pikapkg/pack) build plugin.
> Adds a UMD distribution to your package, built to be flexible & run on legacy browsers & environments. If you're looking to build for web browsers and/or UNPKG, we recommend using `@pika/plugin-build-web` instead.


## Install

```sh
# npm:
npm install @pika/plugin-build-umd --save-dev
# yarn:
yarn add @pika/plugin-build-umd --dev
```


## Usage

```json
{
  "name": "example-package-json",
  "version": "1.0.0",
  "@pika/pack": {
    "pipeline": [
      ["@pika/plugin-standard-pkg"],
      ["@pika/plugin-build-umd"]
    ]
  }
}
```

For more information about @pika/pack & help getting started, [check out the main project repo](https://github.com/pikapkg/pack).


## Options

- `"sourcemap"` (Default: `"true"`): Adds a [source map](https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/) for this build.
- `"name"` (Defaults: your package name): Sets the name that your package is attached to on the `window` object.
- `"entrypoint"` (Default: `"umd:main"`): Customize the package.json manifest entrypoint set by this plugin. Accepts either a string, an array of strings, or `null` to disable entrypoint. Changing this is not recommended for most usage.
- `"exports"` (Default: `"named"`): Customize rollup [`output.exports`](option https://rollupjs.org/guide/en/#outputexports).


## Result

1. Adds a UMD distribution to your built package: `dist-umd/index.js`
  1. UMD Syntax
  1. All dependencies bundled with the package.
  1. Transpiled to run on all actively used and maintained browsers (excluding IE 11 and Opera Mini).
1. Adds a "umd:main" entrypoint to your built `package.json` manifest.
