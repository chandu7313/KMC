const fs = require("fs");
const path = require("path");

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

walkDir("./src", function(filePath) {
  if (filePath.endsWith(".jsx") || filePath.endsWith(".js")) {
    let content = fs.readFileSync(filePath, "utf-8");
    if (content.includes("import { \nimport { useGlobalStore } from '@/app/store/globalStore';") || 
        content.includes("import {\nimport { useGlobalStore } from '@/app/store/globalStore';")) {
      
      content = content.replace(
        /import\s*\{\s*\nimport\s*\{\s*useGlobalStore\s*\}\s*from\s*'@\/app\/store\/globalStore';/g, 
        "import { useGlobalStore } from '@/app/store/globalStore';\nimport {"
      );
      fs.writeFileSync(filePath, content);
      console.log("Fixed: " + filePath);
    }
  }
});
