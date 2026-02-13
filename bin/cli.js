#!/usr/bin/env node

const fetchPackage = require("../lib/fetchPackage");
const walk = require("../lib/fileWalker");

const analyzeFile = require("../lib/analyzer");
const detectPostinstall = require("../lib/postInstall");

// -------------------------
// Helper: Colored console output
// -------------------------
const reset = "\x1b[0m";
const red = (str) => `\x1b[31m${str}${reset}`;
const green = (str) => `\x1b[32m${str}${reset}`;
const yellow = (str) => `\x1b[33m${str}${reset}`;
const cyan = (str) => `\x1b[36m${str}${reset}`;

// -------------------------
// Helper: Print report
// -------------------------
function printReport(pkgName, report, coverage) {
  console.log(`\n🔍 Analysis Report: ${cyan(pkgName)}\n`);
  console.log("Permissions:");
  console.log(`🌐 Network: ${report.network ? red("YES") : "NO"}`);
  console.log(`📁 FS Read: ${report.fsRead ? yellow("YES") : "NO"}`);
  console.log(`📁 FS Write: ${report.fsWrite ? red("YES") : "NO"}`);
  console.log(`🔐 Env Access: ${report.env ? yellow("YES") : "NO"}`);
  console.log(`⚙️ Child Process: ${report.childProcess ? red("YES") : "NO"}`);

  if (report.usesEval) console.log(red("⚠ Dynamic code execution (eval/new Function) detected"));
  if (report.dynamicRequire) console.log(yellow("⚠ Dynamic require detected"));
  if (report.postinstall) console.log(red(`⚠ Postinstall script detected: ${report.postinstall}`));

  console.log(`\n📊 Analysis Coverage: ${coverage}%\n`);
}

// -------------------------
// Main CLI
// -------------------------
async function main() {
  const pkgName = process.argv[2];

  if (!pkgName) {
    console.log("Usage: npx npm-telemetry <package_name>");
    process.exit(0);
  }

  // Initialize report
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

  // Fetch package
  // console.log(`📦 Fetching package ${pkgName}...`);
  const packageDir = await fetchPackage(pkgName);

  // If argument is a folder, use it directly; else fetch from npm
// const packageDir = fs.existsSync(pkgName) && fs.statSync(pkgName).isDirectory()
//   ? path.resolve(pkgName)
//   : fetchPackage(pkgName);

  // Walk files
  const files = walk(packageDir);

  // Analyze files
  files.forEach((file) => analyzeFile(file, report));

  // Detect postinstall script
  detectPostinstall(packageDir, report);

  // Calculate coverage
  const coverage = Math.max(0, 100 - report.coveragePenalty);

  // Print final report
  printReport(pkgName, report, coverage);
}

main();
