# @pika/plugin-bundle-types

> A [@pika/pack](https://github.com/pikapkg/pack) build plugin.
> Bundle & tree-shake all TypeScript definitions into a single file.


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
      ["@pika/plugin-ts-standard-pkg"],
      ["@pika/plugin-build-node"],
      ["@pika/plugin-bundle-types"]
    ]
  }
}
```

For more information about @pika/pack & help getting started, [check out the main project repo](https://github.com/pikapkg/pack).

## Options

- `"tsconfig"`: The relative path to the `tsconfig.json` config file to use. Defaults to the top-level project TypeScript config file, if one exists.
- `"entrypoint"` (Default: `"types"`): Customize the package.json manifest entrypoint set by this plugin. Accepts either a string or an array of strings. Changing this is not recommended for most usage.

## Result

TODO