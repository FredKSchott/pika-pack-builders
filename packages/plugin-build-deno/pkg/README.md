# @pika/plugin-build-deno

> A [@pika/pack](https://github.com/pikapkg/pack) build plugin.
> Adds a TypeScript distribution to your package, built to run on [Deno](https://deno.land/).

**Note:** The plugin is currently only smart enough to build a distribution from source that would already run on Deno. Converting npm imports to run on Deno is coming soon.


## Install

```sh
# npm:
npm install @pika/plugin-build-deno --save-dev
# yarn:
yarn add @pika/plugin-build-deno --dev
```


## Usage

```json
{
  "name": "example-package-json",
  "version": "1.0.0",
  "@pika/pack": {
    "pipeline": [
      ["@pika/plugin-ts-standard-pkg"],
      ["@pika/plugin-build-deno"]
    ]
  }
}
```

For more information about @pika/pack & help getting started, [check out the main project repo](https://github.com/pikapkg/pack).


## Result

1. Adds a TypeScript distribution to your built package: `dist-deno/`
2. Adds a "deno" entrypoint to your built `package.json` manifest.

> *Note:* This package is still experimental, and the built distribution is more or less a copy of your TypeScript source code. We'd love some help making this smarter (for example: rewriting npm package `import` statements from package names to unpkg.com URLs).