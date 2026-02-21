
# 📦 npm-telemetry

[![NPM version](https://img.shields.io/npm/v/npm-telemetry.svg?style=flat)](https://www.npmjs.com/package/npm-telemetry) [![NPM downloads](https://img.shields.io/npm/dm/npm-telemetry.svg?style=flat)](https://npmjs.org/package/npm-telemetry)

**“Dependencies should not be silent.”** 💡

Ever installed an npm package and wondered…

> “Wait, what exactly is this thing doing on my machine?”

`npm-telemetry` gives you **the truth behind your dependencies**—before you trust them.

---

## 💡 What It Does

* Shows which **permissions** a package actually uses:

  * 🌐 Network access
  * 📁 File system read/write
  * 🔐 Environment variables
  * ⚙️ Child processes
* Flags **dynamic code execution** (`eval` / `new Function`)
* Detects **postinstall scripts** that run automatically
* Calculates **Analysis Coverage** so you know how much we could see

Think of it as **nutrition labels for npm packages**: you don’t blindly trust, you inspect. 🕵️‍♂️

---

## ⚡ Installation / Usage

You don’t need to install globally—just run:

```bash
npx npm-telemetry <package_name>
```

Example:

```bash
npx npm-telemetry <somepackage>
```

Output:

```
🔍 Analysis Report: somepackage

Permissions:
🌐 Network: YES
📁 FS Read: NO
📁 FS Write: NO
🔐 Env Access: NO
⚙️ Child Process: NO
⚠ Dynamic code execution (eval/new Function) detected
⚠ Postinstall script detected: node index.js
```

---

## 📦 Programmatic Usage (New)

`npm-telemetry` can now be used as a Node.js library in addition to the CLI.

This allows you to integrate telemetry analysis into:

* CI pipelines
* Security dashboards
* Custom scripts
* Automated dependency checks

---

### ✅ CommonJS

```js
const analyzePackage = require("npm-telemetry");

(async () => {
  const result = await analyzePackage("axios");

  console.log(result.coverage);
  console.log(result.report.network);
})();
```

---

### ✅ ES Modules (ESM)

```js
import analyzePackage from "npm-telemetry";

const result = await analyzePackage("axios");

console.log(result.coverage);
console.log(result.report.network);
```

---

### 📊 Returned Object Structure

```js
{
  package: "axios",
  coverage: 92,
  report: {
    fsRead: false,
    fsWrite: false,
    network: true,
    env: false,
    childProcess: false,
    usesEval: false,
    dynamicRequire: false,
    postinstall: null
  }
}
```

This makes it easy to:

* Fail builds if certain permissions are detected
* Build custom risk scoring
* Store analysis results in a database
* Compare versions of the same package

---

## 🎯 Why This Is Huge

* Makes **dependency behavior visible**
* Changes the **trust model of npm**
* Forces maintainers to be **explicit about what their package actually does**

No more silent surprises. No more hidden horrors.

---

## 💭 Philosophy

Every dependency should answer the question:

> “What am I doing on your system?”

`npm-telemetry` gives **visibility, honesty, and peace of mind**—because software should not be magic. 🧙‍♂️

---

## ⚡ Run It Now

```bash
npx npm-telemetry <package_name>
```

…because your dependencies deserve a **nutrition label**, and so do you. 🍎

## 👤 Author

**[cinfinit](https://github.com/cinfinit)** – part-time coder (NOT AT ALLLLLLL ;)) , full-time curiosity inspector.
Building tools to **peek behind the curtains of your dependencies** and make npm a little less magical , more logical (and a lot safer).

When not staring at ASTs or wrangling `eval`, you can find me **overthinking variable names and writing witty READMEs**.

---

# Changelog

## [1.1.0] - 2026-02-21

### Added

* ✨ Programmatic API support (`require("npm-telemetry")`)
* ✨ ES Module (ESM) support (`import analyzePackage from "npm-telemetry"`)
* ✨ Dual export support via `exports` field
* ✨ Structured analysis result return object

### Changed

* 🔄 Refactored internal architecture to separate:

  * Core analysis engine
  * CLI presentation layer
* 🔄 CLI now acts as a thin wrapper around the reusable analysis engine

### Technical

* Added dual entry points:

  * `"main"` for CommonJS
  * `"exports"` for ESM support
* Improved package architecture for extensibility and CI integration

---

