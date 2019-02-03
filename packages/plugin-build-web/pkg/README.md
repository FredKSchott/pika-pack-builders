# @pika/plugin-build-web

> A [@pika/pack](https://github.com/pikapkg/pack) build plugin.
> Adds an ESM distribution to your package, built & optimized to run in most web browsers (and bundlers).


## Install

```sh
# npm:
npm install @pika/plugin-build-web --save-dev
# yarn:
yarn add @pika/plugin-build-web --dev
```


## Usage

```json
{
  "name": "example-package-json",
  "version": "1.0.0",
  "@pika/pack": {
    "pipeline": [
      ["@pika/plugin-standard-pkg"],
      ["@pika/plugin-build-web"]
    ]
  }
}
```

For more information about @pika/pack & help getting started, [check out the main project repo](https://github.com/pikapkg/pack).


## Result

1. Adds a web distribution to your built package: `dist-web/index.js`
  1. ES Module (ESM) Syntax
  1. Transpiled to run on all browsers where ES Module syntax is supported.
1. Adds a "module" entrypoint to your built `package.json` manifest.
