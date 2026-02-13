const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const fs = require("fs");

const FS_READ_METHODS = new Set([
  "readFile","readFileSync","createReadStream","readdir","readdirSync","stat","statSync","existsSync"
]);
const FS_WRITE_METHODS = new Set([
  "writeFile","writeFileSync","appendFile","appendFileSync","createWriteStream","unlink","unlinkSync","rm","rmSync","rmdir","mkdir"
]);

function analyzeFile(filePath, report) {
  let code;
  try { code = fs.readFileSync(filePath, "utf8"); } catch { report.coveragePenalty += 2; return; }
  let ast;
  try {
    ast = parser.parse(code, { sourceType:"unambiguous", plugins:["jsx","typescript"] });
  } catch { report.coveragePenalty += 5; return; }

  const fsNamespaceIdentifiers = new Set();
  const fsReadIdentifiers = new Set();
  const fsWriteIdentifiers = new Set();

  traverse(ast, {
    ImportDeclaration(path) {
      const source = path.node.source.value;
      if (source === "fs") {
        for (const specifier of path.node.specifiers) {
          if (specifier.type==="ImportDefaultSpecifier" || specifier.type==="ImportNamespaceSpecifier")
            fsNamespaceIdentifiers.add(specifier.local.name);
          if (specifier.type==="ImportSpecifier") {
            const importedName = specifier.imported.name;
            const localName = specifier.local.name;
            if (FS_READ_METHODS.has(importedName)) fsReadIdentifiers.add(localName);
            if (FS_WRITE_METHODS.has(importedName)) fsWriteIdentifiers.add(localName);
          }
        }
      }
      detectModule(source, report);
    },

    VariableDeclarator(path) {
      const init = path.node.init;
      if (init && init.type==="CallExpression" && init.callee.name==="require" && init.arguments.length && init.arguments[0].type==="StringLiteral") {
        const mod = init.arguments[0].value;
        if (mod==="fs") {
          if (path.node.id.type==="Identifier") fsNamespaceIdentifiers.add(path.node.id.name);
          if (path.node.id.type==="ObjectPattern") {
            for (const prop of path.node.id.properties) {
              const importedName = prop.key.name;
              const localName = prop.value.name;
              if (FS_READ_METHODS.has(importedName)) fsReadIdentifiers.add(localName);
              if (FS_WRITE_METHODS.has(importedName)) fsWriteIdentifiers.add(localName);
            }
          }
        }
      }
    },

    CallExpression(path) {
      const callee = path.node.callee;

      // require()
      if (callee.type==="Identifier" && callee.name==="require") {
        const arg = path.node.arguments[0];
        if (arg && arg.type==="StringLiteral") detectModule(arg.value, report);
        else { report.dynamicRequire=true; report.coveragePenalty+=20; }
      }

      // fs.method()
      if (callee.type==="MemberExpression" && callee.object.type==="Identifier") {
        const objName = callee.object.name;
        const method = callee.property.name;
        if (fsNamespaceIdentifiers.has(objName)) {
          if (FS_READ_METHODS.has(method)) report.fsRead = true;
          if (FS_WRITE_METHODS.has(method)) report.fsWrite = true;
        }
      }

      // destructured fs methods
      if (callee.type==="Identifier") {
        const fn = callee.name;
        if (fsReadIdentifiers.has(fn)) report.fsRead = true;
        if (fsWriteIdentifiers.has(fn)) report.fsWrite = true;
      }

      // eval detection
      if (callee.type==="Identifier" && callee.name==="eval") {
        report.usesEval = true;
        report.coveragePenalty+=30;
      }
    },

    NewExpression(path) {
      if (path.node.callee.type==="Identifier" && path.node.callee.name==="Function") {
        report.usesEval = true;
        report.coveragePenalty+=30;
      }
    },

    MemberExpression(path) {
      const obj = path.node.object;
      const prop = path.node.property;
      if (obj.type==="Identifier" && obj.name==="process" && prop && prop.name==="env") {
        report.env = true;
      }
    }
  });
}

function detectModule(mod, report) {
  if (mod==="http"||mod==="https"||mod==="net") report.network=true;
  if (mod==="child_process") report.childProcess=true;
}

module.exports = analyzeFile;
