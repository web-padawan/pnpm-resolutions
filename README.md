## pnpm and resolutions

This is a demo how to pin dependency versions when using `pnpm`.

## Install

Fetch versions first:

```sh
node pnpmfile.js --fetch
```

Then install as usual:

```sh
pnpm i --shamefully-hoist=true
```

## Usage

The `pnpmfile.js` in this repository does two different things.

1. When executed manually: `node pnpmfile.js --fetch`:

  - fetch data from `https://registry.npmjs.org/@vaadin/vaadin-shrinkwrap`
  - save data including versions information to `versions.json` file

2. When executed by `pnpm` itself during installation:

  - get the shrinkwrap package version from the root `package.json` dependencies
  - check `versions` in `versions.json` and get the shrinkwrap that we need
  - for every dependency, pin versions to the ones from the shrinkwrap
