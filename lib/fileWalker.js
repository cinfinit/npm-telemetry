const fs = require("fs");
const path = require("path");

function walk(dir, fileList = []) {
  const entries = fs.readdirSync(dir);

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (entry === "node_modules") continue;
      walk(fullPath, fileList);
    } else if (
      entry.endsWith(".js") ||
      entry.endsWith(".mjs") ||
      entry.endsWith(".cjs")
    ) {
      fileList.push(fullPath);
    }
  }

  return fileList;
}

module.exports = walk;
