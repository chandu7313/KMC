const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const srcDir = path.join(__dirname, 'src');

console.log("Restoring accidentally deleted layout files...");
try {
  // Restore the src/layouts directory from git
  execSync('git checkout -- src/layouts', { stdio: 'inherit' });
  
  // Now carefully move only the layout files to app/layouts
  const layoutsDir = path.join(srcDir, 'layouts');
  const targetDir = path.join(srcDir, 'app/layouts');
  
  if (fs.existsSync(layoutsDir)) {
    const files = fs.readdirSync(layoutsDir);
    files.forEach(file => {
      const srcFile = path.join(layoutsDir, file);
      if (fs.statSync(srcFile).isFile() && file.endsWith('.jsx')) {
        const destFile = path.join(targetDir, file);
        fs.renameSync(srcFile, destFile);
        console.log(`Moved layout: ${file} -> app/layouts`);
      }
    });
    
    // Fix imports in the newly moved layouts
    const movedLayouts = fs.readdirSync(targetDir);
    movedLayouts.forEach(file => {
      const filePath = path.join(targetDir, file);
      if (fs.statSync(filePath).isFile()) {
        let content = fs.readFileSync(filePath, 'utf-8');
        let originalContent = content;
        
        // Fix imports inside the layouts
        content = content.replace(/['"](\.\/)?components\/(.*?)['"]/g, "'@/app/layouts/$2'");
        content = content.replace(/['"]\.\.\/pages\/farmer\/(.*?)['"]/g, "'@/modules/farmer/pages/$1'");
        
        if (content !== originalContent) {
          fs.writeFileSync(filePath, content, 'utf-8');
          console.log(`Fixed imports in layout: ${file}`);
        }
      }
    });
    
    console.log("Layout files properly migrated! You can safely delete the old src/layouts folder now.");
  }
} catch (e) {
  console.error("Failed to restore from git. Please manually run: git restore src/layouts");
}
