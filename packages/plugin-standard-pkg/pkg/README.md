# @pika/plugin-standard-pkg

> A [@pika/pack](https://github.com/pikapkg/pack) build plugin.
> Builds your package source as standard, ES2018 JavaScript. Supports TypeScript. Supports experimental language features via Babel.

> *Note: If your package is written in TypeScript, check out `@pika/plugin-ts-standard-pkg` which uses TypeScript internally to build your package instead of Babel.*



## Install

```sh
# npm:
npm install @pika/plugin-standard-pkg --save-dev
# yarn:
yarn add @pika/plugin-standard-pkg --dev
```


## Usage

```json
{
  "name": "example-package-json",
  "version": "1.0.0",
  "@pika/pack": {
    "pipeline": [
      ["@pika/plugin-standard-pkg"]
    ]
  }
}
```

For more information about @pika/pack & help getting started, [check out the main project repo](https://github.com/pikapkg/pack).


## Result

Unlike other build plugins, this plugin reads directly from your package `src/` directory. Make sure your code exists in a `src/` directory, with an `index.js`/`index.ts` file as the package entrypoint.

Other build plugins depend on a standard ES2018 distribution, so include this plugin early in your build pipeline for others to use.

1. Adds a modern ES2018 distribution to your built package: `dist-src/`
  1. TypeScript supported automatically.
  1. Experimental ESNext JavaScript features are handled via your existing Babel config (`.babelrc` or similar.)
1. Adds an "esnext" entrypoint to your built `package.json` manifest.
