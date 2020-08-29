# @pika/plugin-bundle-node

> A [@pika/pack](https://github.com/pikapkg/pack) build plugin.
> Adds a bundled Node.js distribution to your package, built & optimized to run on [Node.js](https://nodejs.org/) with all dependencies included. Useful for reducing the install time for CLIs.


## Install

```sh
# npm:
npm install @pika/plugin-bundle-node --save-dev
# yarn:
yarn add @pika/plugin-bundle-node --dev
```


## Usage

```json
{
  "name": "example-package-json",
  "version": "1.0.0",
  "@pika/pack": {
    "pipeline": [
      ["@pika/plugin-standard-pkg"],
      ["@pika/plugin-build-node"],
      ["@pika/plugin-bundle-node"]
    ]
  }
}
```

For more information about @pika/pack & help getting started, [check out the main project repo](https://github.com/pikapkg/pack).

## Options

- `"sourcemap"` (Default: `"true"`): Adds a [source map](https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/) for this build.
- `"minNodeVersion"` (Default: `"10"`): This plugin will bundle your package for the current minimum [Node.js LTS](https://github.com/nodejs/Release) major version. This option allows you to target later versions of Node.js only.


## Result

1. Adds a bundled Node.js distribution to your built package: `dist-node/index.bundled.js`
  1. Common.js (CJS) Module Syntax.
  1. All dependencies included in this file.

Note that this does not add or modify the "main" entrypoint to your package.json. See `@pika/plugin-simple-bin` for an example of how to automatically point to this bundled build.
