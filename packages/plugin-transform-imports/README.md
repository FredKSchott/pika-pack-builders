# @pika/plugin-transform-imports

> A [@pika/pack](https://github.com/pikapkg/pack) build plugin.
> rewrite imports, if you need that sort of thing.

> *Note: This is an advanced plugin that 99.99% of people won't need.*


## Install

```sh
# npm:
npm install @pika/plugin-transform-imports --save-dev
# yarn:
yarn add @pika/plugin-transform-imports --dev
```


## Usage

```js
{
  "name": "example-package-json",
  "version": "1.0.0",
  "@pika/pack": {
    "pipeline": [
      ["@pika/plugin-ts-standard-pkg"],
      ["@pika/plugin-transform-imports", { /* options: see below */ }],
      /* your other build plugins */
    ]
  }
}
```

For more information about @pika/pack & help getting started, [check out the main project repo](https://github.com/pikapkg/pack).


## Options

- `"rewrite"`: An object map of imports to rewrite in some of the dist directories.