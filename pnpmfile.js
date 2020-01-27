// Put this file into your projects root, together with "fetch-versions.js"
const fs = require('fs');

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const versions = JSON.parse(fs.readFileSync('./index.json', 'utf-8')).versions;

let vaadinDeps;

module.exports = {
  hooks: {
    readPackage
  }
};

function getExactVersion(string) {
  return string.replace('^', '');
}

function getVaadinDeps() {
  if (vaadinDeps) {
    return vaadinDeps;
  }
  // index.json file contains info about all the versions
  const version = getExactVersion(
    packageJson.dependencies['@vaadin/vaadin-shrinkwrap']
  );

  const data = versions[version];
  const deps = data.dependencies;

  vaadinDeps = {};
  Object.keys(deps).forEach(key => {
    // Do not pin vaadin-core-shrinkwrap
    if (key.indexOf('shrinkwrap') === -1) {
      vaadinDeps[key] = getExactVersion(deps[key]);
    }
  });

  return vaadinDeps;
}

function readPackage(pkg) {
  const deps = getVaadinDeps();

  const { dependencies } = pkg;

  if (dependencies) {
    for (let k in deps) {
      if (dependencies[k] && dependencies[k] !== deps[k]) {
        console.log(
          `Pinned ${k} required by ${pkg.name} from ${dependencies[k]} to ${deps[k]}`
        );
        pkg.dependencies[k] = deps[k];
      }
    }
  }

  return pkg;
}
