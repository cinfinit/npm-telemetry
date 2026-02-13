const fs = require("fs");
const path = require("path");

function detectPostinstall(packageDir, report) {
  const pkgJsonPath = path.join(packageDir, "package.json");

  if (!fs.existsSync(pkgJsonPath)) return;

  try {
    const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));

    if (pkg.scripts && pkg.scripts.postinstall) {
      report.postinstall = pkg.scripts.postinstall;
      // Penalize coverage heavily
      report.coveragePenalty += 30;
    }
  } catch {
    report.coveragePenalty += 5;
  }
}

module.exports = detectPostinstall;
