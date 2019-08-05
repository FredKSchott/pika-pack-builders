# @pika/plugin-wasm-assemblyscript

> A [@pika/pack](https://github.com/pikapkg/pack) build plugin.
> Builds TypeScript as WASM via AssemblyScript.




## Install

```sh
# npm:
npm install @pika/plugin-wasm-assemblyscript --save-dev
# yarn:
yarn add @pika/plugin-wasm-assemblyscript --dev
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

Unlike other build plugins, this plugin reads directly from your package `src/` directory. Make sure your code exists in a `src/` directory, with an `index.ts` file as the package entrypoint.

1. Compiles your TypeScript to WASM: `assets/index.wasm`

Note that this plugin is only responsible for building the WASM asset. Be sure to include JavaScript bindings so that your package can be loaded like any other JavaScript module.