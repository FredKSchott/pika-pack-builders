# @pika/plugin-ts-standard-pkg

> A [@pika/pack](https://github.com/pikapkg/pack) build plugin.
> Builds your TypeScript package source as standard, ES2018 JavaScript. Also includes type definition files for your package automatically.

> *Note: If your package isn't written in TypeScript, check out the normal `@pika/plugin-standard-pkg` plugin.*


## Install

```sh
# npm:
npm install @pika/plugin-ts-standard-pkg --save-dev
# yarn:
yarn add @pika/plugin-ts-standard-pkg --dev
```


## Usage

```json
{
  "name": "example-package-json",
  "version": "1.0.0",
  "@pika/pack": {
    "pipeline": [
      ["@pika/plugin-ts-standard-pkg"]
    ]
  }
}
```

For more information about @pika/pack & help getting started, [check out the main project repo](https://github.com/pikapkg/pack).


## Result

Unlike other build plugins, this plugin reads directly from your package `src/` directory. Make sure your code exists in a `src/` directory, with an `index.ts` file as the package entrypoint.

Other build plugins depend on a standard ES2018 distribution, so include this plugin early in your build pipeline for others to use.

1. Adds a modern ES2018 distribution to your built package: `dist-src/`
1. Adds type definitions to your package automatically: `dist-types/`
1. Adds an "esnext" entrypoint to your built `package.json` manifest.
1. Adds a "types" entrypoint to your built `package.json` manifest.
