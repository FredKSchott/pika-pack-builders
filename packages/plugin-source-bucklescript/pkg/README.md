# @pika/plugin-source-bucklescript

> A [@pika/pack](https://github.com/pikapkg/pack) build plugin.
> Builds ES2018 JavaScript from ReasonML or OCaml via [BuckleScript](https://bucklescript.github.io).




## Install

```sh
# npm:
npm install @pika/plugin-source-bucklescript --save-dev
# yarn:
yarn add @pika/plugin-source-bucklescript --dev
```


## Usage

```json
{
  "name": "example-package-json",
  "version": "1.0.0",
  "@pika/pack": {
    "pipeline": [
      ["@pika/plugin-source-bucklescript"],
      ["@pika/plugin-build-node"],
      ["@pika/plugin-build-web"],
      ["@pika/plugin-build-types"]
    ]
  }
}
```

For more information about @pika/pack & help getting started, [check out the main project repo](https://github.com/pikapkg/pack).


## Result

Unlike other build plugins, this plugin reads directly from your package `src/` directory. Make sure your code exists in a `src/` directory, with an `src/index.ml` or `src/index.re` file acting as your package entrypoint.

Other build plugins will depend on the resulting distribution, so include this plugin early in your build pipeline for others to use.

1. Adds a modern ES2018 distribution to your built package: `dist-src/`
1. Adds an "esnext" entrypoint to your built `package.json` manifest.
