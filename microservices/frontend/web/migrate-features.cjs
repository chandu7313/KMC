const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const mappings = [
  { old: 'auth', new: 'auth' },
  { old: 'ecommerce', new: 'ecommerce' },
  { old: 'soil-testing', new: 'soil' },
  { old: 'market', new: 'market' },
  { old: 'expert-consultation', new: 'fieldVisit' },
  { old: 'disease-detection', new: 'disease' },
  { old: 'orders', new: 'farmer' }
];

function moveFeature(oldName, newName) {
  const oldDir = path.join(srcDir, 'features', oldName);
  const newDir = path.join(srcDir, 'modules', newName);

  if (!fs.existsSync(oldDir)) return;

  // Move everything from oldDir to newDir, merging directories
  const walkAndMove = (currentOld, currentNew) => {
    if (!fs.existsSync(currentNew)) fs.mkdirSync(currentNew, { recursive: true });
    
    const items = fs.readdirSync(currentOld);
    items.forEach(item => {
      const srcPath = path.join(currentOld, item);
      const destPath = path.join(currentNew, item);
      
      if (fs.statSync(srcPath).isDirectory()) {
        walkAndMove(srcPath, destPath);
      } else {
        // Move file
        fs.renameSync(srcPath, destPath);
        console.log(`Moved ${srcPath.split('src/')[1]} -> ${destPath.split('src/')[1]}`);
      }
    });
  };

  walkAndMove(oldDir, newDir);
  // Clean up old dir
  fs.rmSync(oldDir, { recursive: true, force: true });
}

console.log("Starting Phase 4: Feature to Module Migration...");

mappings.forEach(m => moveFeature(m.old, m.new));

// After moving, update all imports in the newly moved files to point to the new apiClient and absolute paths
function getAllJsxJsFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllJsxJsFiles(filePath, fileList);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allModuleFiles = getAllJsxJsFiles(path.join(srcDir, 'modules'));

allModuleFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // Update Axios instance imports
  content = content.replace(/['"](\.\.\/)*core\/api\/axios\.instance['"]/g, "'@/shared/services/http/axios.client'");
  
  // Update old API config imports (if they exist, point to some constants or just leave them, 
  // actually I haven't moved api.config.js yet. Let's point it to the absolute path for now)
  content = content.replace(/['"](\.\.\/)*core\/api\/api\.config['"]/g, "'@/core/api/api.config'");
  
  // Fix imports from features to modules
  mappings.forEach(m => {
    const regex = new RegExp(`['"](\\.\\.\\/)*features\\/${m.old}\\/(.*?)['"]`, 'g');
    content = content.replace(regex, `'@/modules/${m.new}/$2'`);
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated imports in ${filePath.split('src/')[1]}`);
  }
});

console.log("Feature Migration Complete!");
