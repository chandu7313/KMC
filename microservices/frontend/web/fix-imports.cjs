const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function getAllJsxFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllJsxFiles(filePath, fileList);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const filesToFix = [
  ...getAllJsxFiles(path.join(srcDir, 'modules')),
  ...getAllJsxFiles(path.join(srcDir, 'app/layouts')),
  ...getAllJsxFiles(path.join(srcDir, 'shared/ui')),
  ...getAllJsxFiles(path.join(srcDir, 'core/router')) // if it exists
];

filesToFix.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // Fix layouts
  content = content.replace(/['"](\.\.\/)+layouts\/components\/(.*?)['"]/g, "'@/app/layouts/$2'");
  
  // Fix context -> providers
  content = content.replace(/['"](\.\.\/)+context\/(.*?)['"]/g, "'@/app/providers/$2'");
  
  // Fix shared/components/ui and feedback -> shared/ui
  content = content.replace(/['"](\.\.\/)+shared\/components\/ui\/(.*?)['"]/g, "'@/shared/ui/$2'");
  content = content.replace(/['"](\.\.\/)+shared\/components\/feedback\/(.*?)['"]/g, "'@/shared/ui/$2'");
  
  // Fix assets
  content = content.replace(/['"](\.\.\/)+assets\/(.*?)['"]/g, "'@/assets/$2'");
  
  // Fix cross-module or pages imports (rare but happens)
  content = content.replace(/['"](\.\.\/)+pages\/farmer\/(.*?)['"]/g, "'@/modules/farmer/pages/$2'"); // just a fallback
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Fixed imports in ${filePath.split('src/')[1]}`);
  }
});

console.log('Import fixing complete.');
