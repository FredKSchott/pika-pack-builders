# @pika/plugin-wasm-bindings

> A [@pika/pack](https://github.com/pikapkg/pack) build plugin.
> Adds simple JavaScript bindings that work with any WASM file.




## Install

```sh
# npm:
npm install @pika/plugin-wasm-bindings --save-dev
# yarn:
yarn add @pika/plugin-wasm-bindings --dev
```


## Usage

```json
{
  "name": "example-package-json",
  "version": "1.0.0",
  "@pika/pack": {
    "pipeline": [
      ["@pika/plugin-wasm-assemblyscript"],
      ["@pika/plugin-wasm-bindings"],
      ["@pika/plugin-build-web"]
    ]
  }
}
```

For more information about @pika/pack & help getting started, [check out the main project repo](https://github.com/pikapkg/pack).


## Result

1. Adds ES2018 JavaScript bindings to your package: `dist-src/index.js`
1. Adds an "esnext" entrypoint to your built `package.json` manifest.

Note that this plugin is only responsible for building the WASM bindings. Be sure to include a plugin that compiles the relevant WASM asset.