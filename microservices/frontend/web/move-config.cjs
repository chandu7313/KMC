const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const oldConfigDir = path.join(srcDir, 'config');
const newConfigDir = path.join(srcDir, 'app/config');

if (fs.existsSync(oldConfigDir)) {
  if (!fs.existsSync(newConfigDir)) {
    fs.mkdirSync(newConfigDir, { recursive: true });
  }

  const files = fs.readdirSync(oldConfigDir);
  files.forEach(file => {
    const oldPath = path.join(oldConfigDir, file);
    const newPath = path.join(newConfigDir, file);
    fs.renameSync(oldPath, newPath);
    console.log(`Moved ${file} to app/config/`);
  });

  // Clean up old dir
  fs.rmSync(oldConfigDir, { recursive: true, force: true });
  console.log("Config migration complete.");
} else {
  console.log("src/config not found. Already moved?");
}
