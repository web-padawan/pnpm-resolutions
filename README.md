## pnpm and resolutions

This is a demo how to make `"resolutions"` work when using `pnpm`.

## Install

```sh
pnpm i --shamefully-hoist=true
```

## Usage

The `pnpmfile.js` in this repository does the following:

1. Get the dependencies from `@vaadin/vaadin-shrinkwrap/package.json`:

  - look up for `.pnpm-store` assuming it is on the same drive home directory
  - check for `index.json` for `@vaadin/vaadin-shrinkwrap` package in the store
  - get the shrinkwrap package version from the root `package.json` dependencies
  - check `versions` in `index.json` above and get the shrinkwrap that we need

2. For every dependency, pin versions to the one from shrinkwrap.
