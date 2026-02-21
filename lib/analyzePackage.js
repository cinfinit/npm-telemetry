const fetchPackage = require("./fetchPackage");
const walk = require("./fileWalker");
const analyzeFile = require("./analyzer");
const detectPostinstall = require("./postInstall");

async function analyzePackage(pkgName) {
  const report = {
    fsRead: false,
    fsWrite: false,
    network: false,
    env: false,
    childProcess: false,
    usesEval: false,
    dynamicRequire: false,
    postinstall: null,
    coveragePenalty: 0,
  };

  const packageDir = await fetchPackage(pkgName);

  // If argument is a folder, use it directly; else fetch from npm
// const packageDir = fs.existsSync(pkgName) && fs.statSync(pkgName).isDirectory()
//   ? path.resolve(pkgName)
//   : fetchPackage(pkgName);
  const files = walk(packageDir);

  files.forEach((file) => analyzeFile(file, report));
  detectPostinstall(packageDir, report);

  const coverage = Math.max(0, 100 - report.coveragePenalty);

  return {
    package: pkgName,
    report,
    coverage,
  };
}

module.exports = analyzePackage;