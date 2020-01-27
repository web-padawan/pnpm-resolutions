## pnpm and resolutions

This is a demo how to make `"resolutions"` work when using `pnpm`.

## Install

```sh
pnpm i --shamefully-hoist=true
```

## Usage

When generating `package.json` in Flow, we need to do the following:

1. Get the dependencies from `@vaadin/vaadin-shrinkwrap/package.json`

2. List every dependency in the `"resolutions"` like this:

```j
  "resolutions": {
    "@vaadin/vaadin-element-mixin": "2.2.0",
    "@vaadin/vaadin-overlay": "3.2.18"
  }
```

3. Place `pnpmfile.js` to the folder where `package.json` is located

This way we can pin transitive dependencies like `vaadin-overlay`.
