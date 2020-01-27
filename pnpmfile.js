// Put this file into your projects root.
// This will enable using "resolutions"
const fs = require('fs');
const path = require('path');
const os = require('os');

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

// These are defaults with 4.x
const STORE_DIR = '.pnpm-store';
const STORE_VERSION = '2';

const storePath = path.join(
  getHomedir(),
  STORE_DIR,
  STORE_VERSION,
  'registry.npmjs.org'
);

let vaadinDeps;

module.exports = {
  hooks: {
    readPackage
  }
};

function getHomedir() {
  const home = os.homedir();
  if (!home) {
    throw new Error('Could not find the homedir');
  }
  return home;
}

function getExactVersion(string) {
  return string.replace('^', '');
}

function getVaadinPath() {
  return path.join(storePath, '@vaadin', 'vaadin-shrinkwrap', 'index.json');
}

function getVaadinDeps() {
  const path = getVaadinPath();
  const json = JSON.parse(fs.readFileSync(path, 'utf-8'));
  // index.json file in the store contains versions info
  const version = getExactVersion(
    packageJson.dependencies['@vaadin/vaadin-shrinkwrap']
  );
  const data = json.versions[version];
  const deps = data.dependencies;
  const result = {};
  Object.keys(deps).forEach(key => {
    // Do not pin vaadin-core-shrinkwrap
    if (key.indexOf('shrinkwrap') === -1) {
      result[key] = getExactVersion(deps[key]);
    }
  });
  return result;
}

function readPackage(pkg) {
  vaadinDeps = vaadinDeps || getVaadinDeps();
  const { dependencies } = pkg;

  if (dependencies) {
    for (let k in vaadinDeps) {
      if (dependencies[k] && dependencies[k] !== vaadinDeps[k]) {
        console.log(
          `Pinned ${k} required by ${pkg.name} from ${dependencies[k]} to ${vaadinDeps[k]}`
        );
        pkg.dependencies[k] = vaadinDeps[k];
      }
    }
  }

  return pkg;
}
