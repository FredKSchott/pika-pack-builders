# @pika/plugin-build-types

> A [@pika/pack](https://github.com/pikapkg/pack) build plugin.
> Automatically adds TypeScript type definitions to your package build.

*Note: This plugin is not needed if you are already writing TypeScript and using the [ts-standard-pkg](/packages/plugin-ts-standard-pkg) plugin.*


## Install

```sh
# npm:
npm install @pika/plugin-build-types --save-dev
# yarn:
yarn add @pika/plugin-build-types --dev
```


## Usage

```json
{
  "name": "example-package-json",
  "version": "1.0.0",
  "@pika/pack": {
    "pipeline": [
      ["@pika/plugin-standard-pkg"],
      ["@pika/plugin-build-types"]
    ]
  }
}
```

For more information about @pika/pack & help getting started, [check out the main project repo](https://github.com/pikapkg/pack).


## Options

- `"tsconfig"`: The relative path to the `tsconfig.json` config file to use. Defaults to the top-level project TypeScript config file, if one exists.
- `"args"`: Optional, an array of additional arguments for tsc. Example: `["--build"]`
- `"entrypoint"` (Default: `"types"`): Customize the package.json manifest entrypoint set by this plugin. Accepts either a string or an array of strings. Changing this is not recommended for most usage.


## Result

1. Adds or generates TypeScript definitions for your package build: `dist-types/`
  - If your package is written in TypeScript: Types are automatically generated from your source.
  - If your package already includes custom-written type definitions: These files are automatically copied into your package build.
  - Otherwise: Automatically generate definitions from your JavaScript source. *(Note that this currently requires that you include `@pika/plugin-build-node` or some other Node.js build earlier in the pipeline.)*
2. Adds a "types" entrypoint to your built `package.json` manifest.
