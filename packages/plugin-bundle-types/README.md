# @pika/plugin-build-types

> A [@pika/pack](https://github.com/pikapkg/pack) build plugin.
> Creates a bundle from your TypeScript type definitions, using [DTS Bundle Generator](https://github.com/timocov/dts-bundle-generator).


## Install

```sh
# npm:
npm install @pika/plugin-bundle-types --save-dev
# yarn:
yarn add @pika/plugin-bundle-types --dev
```


## Usage

```json
{
  "name": "example-package-json",
  "version": "1.0.0",
  "@pika/pack": {
    "pipeline": [
      ["@pika/plugin-standard-pkg"],
      ["@pika/plugin-build-types"],
      ["@pika/plugin-bundle-types"]
    ]
  }
}
```

For more information about @pika/pack & help getting started, [check out the main project repo](https://github.com/pikapkg/pack).


## Result

1. Generates a single file with TypeScript definitions for your package build: `dist-types/`
1. Adds a "types" entrypoint to your built `package.json` manifest.
