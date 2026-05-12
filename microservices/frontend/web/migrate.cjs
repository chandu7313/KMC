const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const dirsToCreate = [
  'app/router', 'app/providers', 'app/layouts', 'app/store', 'app/hooks', 'app/config',
  'shared/ui', 'shared/components', 'shared/hooks', 'shared/services/http', 'shared/utils', 'shared/constants', 'shared/types', 'shared/assets', 'shared/lib',
  'modules/auth/api', 'modules/auth/components', 'modules/auth/hooks', 'modules/auth/pages', 'modules/auth/store', 'modules/auth/routes', 'modules/auth/schemas', 'modules/auth/types',
  'modules/farmer/api', 'modules/farmer/components', 'modules/farmer/hooks', 'modules/farmer/pages', 'modules/farmer/store', 'modules/farmer/routes', 'modules/farmer/schemas', 'modules/farmer/types',
  'modules/onboarding/api', 'modules/onboarding/components', 'modules/onboarding/hooks', 'modules/onboarding/pages', 'modules/onboarding/store', 'modules/onboarding/routes', 'modules/onboarding/schemas', 'modules/onboarding/types',
  'modules/soil/api', 'modules/soil/components', 'modules/soil/hooks', 'modules/soil/pages', 'modules/soil/store', 'modules/soil/routes', 'modules/soil/schemas', 'modules/soil/types',
  'modules/market/api', 'modules/market/components', 'modules/market/hooks', 'modules/market/pages', 'modules/market/store', 'modules/market/routes', 'modules/market/schemas', 'modules/market/types',
  'modules/ecommerce/api', 'modules/ecommerce/components', 'modules/ecommerce/hooks', 'modules/ecommerce/pages', 'modules/ecommerce/store', 'modules/ecommerce/routes', 'modules/ecommerce/schemas', 'modules/ecommerce/types',
  'modules/orchard/api', 'modules/orchard/components', 'modules/orchard/hooks', 'modules/orchard/pages', 'modules/orchard/store', 'modules/orchard/routes', 'modules/orchard/schemas', 'modules/orchard/types',
  'modules/fieldVisit/api', 'modules/fieldVisit/components', 'modules/fieldVisit/hooks', 'modules/fieldVisit/pages', 'modules/fieldVisit/store', 'modules/fieldVisit/routes', 'modules/fieldVisit/schemas', 'modules/fieldVisit/types',
  'modules/disease/api', 'modules/disease/components', 'modules/disease/hooks', 'modules/disease/pages', 'modules/disease/store', 'modules/disease/routes', 'modules/disease/schemas', 'modules/disease/types',
  'modules/content/api', 'modules/content/components', 'modules/content/hooks', 'modules/content/pages', 'modules/content/store', 'modules/content/routes', 'modules/content/schemas', 'modules/content/types',
  'modules/info/api', 'modules/info/components', 'modules/info/hooks', 'modules/info/pages', 'modules/info/store', 'modules/info/routes', 'modules/info/schemas', 'modules/info/types'
];

// Create directories
dirsToCreate.forEach(dir => {
  const fullPath = path.join(srcDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Helper to move files safely
function moveFiles(sourceDir, targetDir, filterFn = null) {
  if (!fs.existsSync(sourceDir)) return;
  const files = fs.readdirSync(sourceDir);
  files.forEach(file => {
    const srcFile = path.join(sourceDir, file);
    if (fs.statSync(srcFile).isFile()) {
      if (!filterFn || filterFn(file)) {
        const destFile = path.join(targetDir, file);
        fs.renameSync(srcFile, destFile);
        console.log(`Moved ${file} -> ${targetDir.split('src/')[1] || targetDir}`);
      }
    }
  });
}

// 1. Move layouts -> app/layouts
moveFiles(path.join(srcDir, 'layouts/components'), path.join(srcDir, 'app/layouts'));
// Optional: remove old layouts dir if empty
if (fs.existsSync(path.join(srcDir, 'layouts/components'))) {
  if (fs.readdirSync(path.join(srcDir, 'layouts/components')).length === 0) {
    fs.rmSync(path.join(srcDir, 'layouts'), { recursive: true, force: true });
  }
}

// 2. Move shared/components -> shared/ui (pure UI) and shared/components (business logic)
// Let's just move everything in shared/components/ui to shared/ui, 
// and shared/components/feedback to shared/ui
moveFiles(path.join(srcDir, 'shared/components/ui'), path.join(srcDir, 'shared/ui'));
moveFiles(path.join(srcDir, 'shared/components/feedback'), path.join(srcDir, 'shared/ui'));

// 3. Move context -> app/providers
moveFiles(path.join(srcDir, 'context'), path.join(srcDir, 'app/providers'));

// 4. Domain Module Extraction - mapping pages/farmer/* to specific modules
const farmerPages = path.join(srcDir, 'pages/farmer');
const mappings = [
  { module: 'auth', files: ['LoginPage.jsx', 'ResetPasswordPage.jsx', 'EmailVerifyPage.jsx'] },
  { module: 'onboarding', files: ['OnboardingSurveyPage.jsx'] },
  { module: 'soil', files: ['SoilTestingPage.jsx', 'SoilHistoryPage.jsx'] },
  { module: 'market', files: ['MarketPage.jsx'] },
  { module: 'ecommerce', files: ['ShopPage.jsx', 'ProductDetailPage.jsx', 'CartPage.jsx', 'CheckoutPage.jsx', 'EquipmentsPage.jsx', 'FertilizersPage.jsx', 'PackagesPage.jsx'] },
  { module: 'orchard', files: ['OrchardPlanningPage.jsx', 'PlanEstateFormPage.jsx', 'CropSelectionPage.jsx'] },
  { module: 'fieldVisit', files: ['BookFarmVisitPage.jsx', 'ExpertConsultationPage.jsx'] },
  { module: 'disease', files: ['DiseaseDetectionPage.jsx'] },
  { module: 'content', files: ['BlogsPage.jsx', 'BlogDetailPage.jsx', 'SuccessStoriesPage.jsx', 'GovernmentSchemesPage.jsx', 'WeatherInsightsPage.jsx'] },
  { module: 'info', files: ['AboutPage.jsx', 'ContactPage.jsx', 'CustomerCarePage.jsx', 'NotFoundPage.jsx'] },
  { module: 'farmer', files: ['HomePage.jsx', 'ProfilePage.jsx', 'OrdersPage.jsx'] }
];

mappings.forEach(map => {
  const targetPagesDir = path.join(srcDir, `modules/${map.module}/pages`);
  if (!fs.existsSync(targetPagesDir)) fs.mkdirSync(targetPagesDir, { recursive: true });
  
  moveFiles(farmerPages, targetPagesDir, file => map.files.includes(file));
});

// Clean up empty directories
function cleanEmptyDirs(dir) {
  if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
    const files = fs.readdirSync(dir);
    if (files.length === 0) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
}

cleanEmptyDirs(path.join(srcDir, 'pages/farmer'));

console.log('Migration step 1 complete.');
