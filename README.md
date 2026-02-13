
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