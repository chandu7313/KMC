const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const globalStoreVars = new Set([
  'backendUrl', 'isLoggedin', 'setIsLoggedin', 'userData', 'setUserData',
  'getUserData', 'loading', 'setLoading', 'runTour', 'setRunTour', 'completeTour',
  'voiceEnabled', 'toggleVoice'
]);

const cartStoreVars = new Set([
  'cartItems', 'setCartItems', 'getCartData', 'getCartCount'
]);

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  if (!content.includes('AppContext')) return;

  // 1. Remove import { AppContext } from ...
  content = content.replace(/import\s+\{\s*AppContext\s*\}\s+from\s+['"][^'"]+['"];?\n?/g, '');

  // 2. Find useContext(AppContext) and replace
  // regex to match: const { var1, var2 } = useContext(AppContext);
  const useContextRegex = /(?:const|let|var)\s+\{\s*([^}]+)\s*\}\s*=\s*useContext\(\s*AppContext\s*\);?/g;
  
  let needsGlobal = false;
  let needsCart = false;
  
  content = content.replace(useContextRegex, (match, varsStr) => {
    const vars = varsStr.split(',').map(v => v.trim()).filter(v => v);
    
    const globals = [];
    const carts = [];
    
    vars.forEach(v => {
      // Handle aliasing like `backendUrl: url`
      const baseVar = v.split(':')[0].trim();
      if (globalStoreVars.has(baseVar)) {
        globals.push(v);
        needsGlobal = true;
      } else if (cartStoreVars.has(baseVar)) {
        carts.push(v);
        needsCart = true;
      } else {
        // Unknown var, put it in globals by default
        globals.push(v);
        needsGlobal = true;
      }
    });

    let replacement = '';
    if (globals.length > 0) {
      replacement += `const { ${globals.join(', ')} } = useGlobalStore();\n`;
    }
    if (carts.length > 0) {
      // Handle indentation if necessary, but this is fine for now
      replacement += `  const { ${carts.join(', ')} } = useCartStore();\n`;
    }
    
    return replacement.trim();
  });

  // 3. Add Store Imports
  let importsToAdd = '';
  if (needsGlobal) {
    importsToAdd += `import { useGlobalStore } from '@/app/store/globalStore';\n`;
  }
  if (needsCart) {
    importsToAdd += `import { useCartStore } from '@/modules/ecommerce/store/cartStore';\n`;
  }

  if (importsToAdd) {
    // Find the last import statement
    const lastImportIndex = content.lastIndexOf('import ');
    if (lastImportIndex !== -1) {
      const endOfLastImport = content.indexOf('\n', lastImportIndex);
      content = content.slice(0, endOfLastImport + 1) + importsToAdd + content.slice(endOfLastImport + 1);
    } else {
      content = importsToAdd + '\n' + content;
    }
  }

  // 4. Clean up useContext if it's unused
  if (!content.includes('useContext(')) {
    // try to remove useContext from react import
    content = content.replace(/,\s*useContext\b/, '');
    content = content.replace(/\buseContext\s*,\s*/, '');
    content = content.replace(/\{\s*useContext\s*\}/, '{}');
    // if import {} from 'react' is empty, we could remove it, but let's leave it.
  }

  fs.writeFileSync(filePath, content);
  console.log(`Migrated: ${filePath}`);
}

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      processFile(fullPath);
    }
  }
}

console.log("Starting Zustand migration...");
traverse(srcDir);
console.log("Migration complete.");
