// Put this file into your projects root, together with "fetch-versions.js"
const fs = require('fs');
const http = require('http');
const { promisify } = require('util');

http.get[promisify.custom] = function getAsync(options) {
  return new Promise((resolve, reject) => {
    http
      .get(options, response => {
        response.end = new Promise(resolve => response.on('end', resolve));
        resolve(response);
      })
      .on('error', reject);
  });
};

const get = promisify(http.get);

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
  if (vaadinDeps) {
    return vaadinDeps;
  }
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
  const versions = JSON.parse(fs.readFileSync('./versions.json', 'utf-8')).versions;

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

(async function main() {
  const args = process.argv.slice(2);
  if (args[0] === '--fetch') {
    console.log('fetching versions from npm');
    const response = await get(
      'http://registry.npmjs.org/@vaadin/vaadin-shrinkwrap'
    );
    let body = '';
    response.on('data', chunk => (body += chunk));
    await response.end;
    fs.writeFileSync('versions.json', body);
  }
})();
