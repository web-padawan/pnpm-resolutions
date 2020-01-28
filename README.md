## pnpm and resolutions

This is a demo how to make `"resolutions"` work when using `pnpm`.

## Install

Fetch versions first:

```sh
node ./fetch-versions.js
```

Then install as usual:

```sh
pnpm i --shamefully-hoist=true
```

## Usage

The files in this repository do the following:

1. `fetch-versions.js` (must be executed before `pnpm install`)

  - fetch data from `https://registry.npmjs.org/@vaadin/vaadin-shrinkwrap`
  - save data including versions information to `index.json` file

2. `pnpmfile.js` executed by `pnpm` itself during installation

  - get the shrinkwrap package version from the root `package.json` dependencies
  - check `versions` in `index.json` above and get the shrinkwrap that we need
  - for every dependency, pin versions to the ones from the shrinkwrap
