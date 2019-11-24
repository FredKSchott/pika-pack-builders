# @pika/plugin-build-web

> A [@pika/pack](https://github.com/pikapkg/pack) build plugin.
> Adds an ESM distribution to your package optimized for web bundlers and tooling. For a standalone build meant to run directly in the browser, check out [plugin-bundle-web](/packages/plugin-bundle-web).


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

## Options

- `"sourcemap"` (Default: `"true"`): Adds a [source map](https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/) for this build.
- `"entrypoint"` (Default: `"module"`): Customize the package.json manifest entrypoint set by this plugin. Accepts either a string, an array of strings, or `null` to disable entrypoint. Changing this is not recommended for most usage.


## Result

1. Adds a web distribution to your built package: `dist-web/index.js` Targets Modern (ES2019) syntax optimized for bundlers & web tooling.
1. Adds a "module" entrypoint to your built `package.json` manifest.

Packages that use this plugin will work on the Pika CDN. To support running directly from UNPKG, check out [plugin-bundle-web](/packages/plugin-bundle-web).