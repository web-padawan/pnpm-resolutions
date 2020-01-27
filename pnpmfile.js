// Put this file into your projects root.
// This will enable using "resolutions"
let fs = require("fs");

let packageJson = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
let resolutions = packageJson.resolutions;

module.exports = {
  hooks: {
    readPackage
  }
};

function readPackage(pkg) {
  const { dependencies } = pkg;
  if (dependencies) {
    for (let k in resolutions) {
      if (dependencies[k] && dependencies[k] !== resolutions[k]) {
        console.log(`Pinned ${k} required by ${pkg.name} from ${dependencies[k]} to ${resolutions[k]}`);
        pkg.dependencies[k] = resolutions[k];
      }
    }
  }

  return pkg;
}
