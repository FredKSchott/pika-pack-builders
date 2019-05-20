# @pika/plugin-build-web-complete

> A [@pika/pack](https://github.com/pikapkg/pack) build plugin.
> Adds an ESM distribution to your package for every published ES spec (ES2019, ES2018, etc.)


## Install

```sh
# npm:
npm install @pika/plugin-build-web-complete --save-dev
# yarn:
yarn add @pika/plugin-build-web-complete --dev
```


## Usage

```json
{
  "name": "example-package-json",
  "version": "1.0.0",
  "@pika/pack": {
    "pipeline": [
      ["@pika/plugin-standard-pkg"],
      ["@pika/plugin-build-web-complete"]
    ]
  }
}
```

For more information about @pika/pack & help getting started, [check out the main project repo](https://github.com/pikapkg/pack).


## Result

TODO