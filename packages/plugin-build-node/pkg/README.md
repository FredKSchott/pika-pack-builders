# @pika/plugin-build-node

> A [@pika/pack](https://github.com/pikapkg/pack) build plugin.
> Adds a Node.js distribution to your package, built & optimized to run on [Node.js](https://nodejs.org/). If no other distribution is included with your package, many other tools & bundlers can understand this format as well.


## Install

```sh
# npm:
npm install @pika/plugin-build-node --save-dev
# yarn:
yarn add @pika/plugin-build-node --dev
```


## Usage

```json
{
  "name": "example-package-json",
  "version": "1.0.0",
  "@pika/pack": {
    "pipeline": [
      ["@pika/plugin-standard-pkg"],
      ["@pika/plugin-build-node", {}]
    ]
  }
}
```

For more information about @pika/pack & help getting started, [check out the main project repo](https://github.com/pikapkg/pack).


## Options

- `"sourcemap"` (Default: `"true"`): Adds a [source map](https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/) for this build.
- `"minNodeVersion"` (Default: `"8"`): This plugin will build your package for the current minimum [Node.js LTS](https://github.com/nodejs/Release) major version. This option allows you to target later versions of Node.js only.
- `"entrypoint"` (Default: `"main"`): Customize the package.json manifest entrypoint set by this plugin. Accepts either a string, an array of strings, or `null` to disable entrypoint. Changing this is not recommended for most usage.


## Result

1. Adds a Node.js distribution to your built package: `dist-node/index.js`
  1. Common.js (CJS) Module Syntax
  1. Transpiled to run on Node.js LTS (Currently, supports Node.js version v6+)
1. Adds a "main" entrypoint to your built `package.json` manifest.
