const pacote = require("pacote");
const fs = require("fs");
const path = require("path");
const os = require("os");

async function fetchPackage(pkgName) {
  console.log(`📦 Fetching package ${pkgName}...`);

  const tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), "npm-telemetry-")
  );

  await pacote.extract(pkgName, tempDir);
  console.log("📦 Fetching done ✅");

  return tempDir;
}

module.exports = fetchPackage;
