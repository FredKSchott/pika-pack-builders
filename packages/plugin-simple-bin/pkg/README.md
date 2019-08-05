# @pika/plugin-simple-bin

> A [@pika/pack](https://github.com/pikapkg/pack) build plugin.
> Adds a simple CLI wrapper to your package and properly configures your package.json `"bin"` field to point to it. Useful for quickly adding a command line interface to your library.


## Install

```sh
# npm:
npm install @pika/plugin-simple-bin --save-dev
# yarn:
yarn add @pika/plugin-simple-bin --dev
```


## Usage

```json
{
  "name": "example-package-json",
  "version": "1.0.0",
  "@pika/pack": {
    "pipeline": [
      ["@pika/plugin-standard-pkg"],
      ["@pika/plugin-build-node"],
      ["@pika/plugin-simple-bin", {"bin": "my-cli"}]
    ]
  }
}
```

For more information about @pika/pack & help getting started, [check out the main project repo](https://github.com/pikapkg/pack).


## Result

1. Adds a simple bin/CLI wrapper to your built package: `dist-node/index.bin.js`
  1. Built for Node.js
  1. Loads your library, and calls an exported `run()` method with the CLI args.
  1. Will load a bundled Node.js distribution if one exists.
1. Configures the built package.json with a new `"bin"` entrypoint, so that npm knows to install your package as a CLI.