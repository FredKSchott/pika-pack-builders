# @pika/plugin-copy-assets

> A [@pika/pack](https://github.com/pikapkg/pack) build plugin.
> Copies static assets from your root source directory into the built `pkg/` directory. Useful for non-JS associated files (like CSS, images).


## Install

```sh
# npm:
npm install @pika/plugin-copy-assets --save-dev
# yarn:
yarn add @pika/plugin-copy-assets --dev
```


## Usage

```json
{
  "name": "example-package-json",
  "version": "1.0.0",
  "@pika/pack": {
    "pipeline": [
      ["@pika/plugin-standard-pkg"],
      ["@pika/plugin-build-node", {}]
      ["@pika/plugin-copy-assets", {}]
    ]
  }
}
```

For more information about @pika/pack & help getting started, [check out the main project repo](https://github.com/pikapkg/pack).


## Options

- `"files"` (Default: `["assets/"]`): An array of files/folders to copy into the pkg out directory. Does not support glob pattern matching, but will copy any directories recursively.


## Result

1. See the package description. Copies static assets from your root source directory into the built `pkg/` directory (example: "assets/" => "pkg/assets").