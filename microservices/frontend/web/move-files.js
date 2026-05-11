const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'src');

const copies = [
  // Farmer pages
  ['pages/General/Home.jsx', 'pages/farmer/HomePage.jsx'],
  ['pages/General/NotFoundPage.jsx', 'pages/farmer/NotFoundPage.jsx'],
  ['pages/Auth/Login.jsx', 'pages/farmer/LoginPage.jsx'],
  ['pages/Auth/EmailVerify.jsx', 'pages/farmer/EmailVerifyPage.jsx'],
  ['pages/Auth/ResetPassword.jsx', 'pages/farmer/ResetPasswordPage.jsx'],
  ['pages/Farming/CropDoctor.jsx', 'pages/farmer/DiseaseDetectionPage.jsx'],
  ['pages/Farming/SoilTestAndCropAdvice.jsx', 'pages/farmer/SoilTestingPage.jsx'],
  ['pages/Farming/SoilHistory.jsx', 'pages/farmer/SoilHistoryPage.jsx'],
  ['pages/Farming/MarketPrices.jsx', 'pages/farmer/MarketPage.jsx'],
  ['pages/Marketplace/Marketplace.jsx', 'pages/farmer/ShopPage.jsx'],
  ['pages/Marketplace/ProductDetail.jsx', 'pages/farmer/ProductDetailPage.jsx'],
  ['pages/Marketplace/CartPage.jsx', 'pages/farmer/CartPage.jsx'],
  ['pages/Marketplace/Checkout.jsx', 'pages/farmer/CheckoutPage.jsx'],
  ['pages/Farming/Fertilizers.jsx', 'pages/farmer/FertilizersPage.jsx'],
  ['pages/Farming/Equipments.jsx', 'pages/farmer/EquipmentsPage.jsx'],
  ['pages/Farming/MyOrders.jsx', 'pages/farmer/OrdersPage.jsx'],
  ['pages/Farming/Advisor.jsx', 'pages/farmer/ExpertConsultationPage.jsx'],
  ['pages/Farming/BookFarmVisit.jsx', 'pages/farmer/BookFarmVisitPage.jsx'],
  ['pages/Farming/FarmerDashboard.jsx', 'pages/farmer/DashboardPage.jsx'],
  ['pages/Farming/FarmerProfile.jsx', 'pages/farmer/ProfilePage.jsx'],
  ['pages/Farming/FarmerOnboardingSurvey.jsx', 'pages/farmer/OnboardingSurveyPage.jsx'],
  ['pages/Farming/GovernmentSchemes.jsx', 'pages/farmer/GovernmentSchemesPage.jsx'],
  ['pages/Farming/OrchardPlanning.jsx', 'pages/farmer/OrchardPlanningPage.jsx'],
  ['pages/Farming/PlanEstateForm.jsx', 'pages/farmer/PlanEstateFormPage.jsx'],
  ['pages/Farming/WhetherInsights.jsx', 'pages/farmer/WeatherInsightsPage.jsx'],
  ['pages/Farming/CropSelection.jsx', 'pages/farmer/CropSelectionPage.jsx'],
  ['pages/Information/About.jsx', 'pages/farmer/AboutPage.jsx'],
  ['pages/Information/Blogs.jsx', 'pages/farmer/BlogsPage.jsx'],
  ['pages/Information/BlogDetail.jsx', 'pages/farmer/BlogDetailPage.jsx'],
  ['pages/Information/ContactUs.jsx', 'pages/farmer/ContactPage.jsx'],
  ['pages/Information/CustomerCare.jsx', 'pages/farmer/CustomerCarePage.jsx'],
  ['pages/Information/Packages.jsx', 'pages/farmer/PackagesPage.jsx'],
  ['pages/Information/SuccessStories.jsx', 'pages/farmer/SuccessStoriesPage.jsx'],
  // Admin pages
  ['pages/Admin/Dashboard.jsx', 'pages/admin/DashboardPage.jsx'],
  ['pages/Admin/UserManagement.jsx', 'pages/admin/UserManagementPage.jsx'],
  ['pages/Admin/FarmerManagement.jsx', 'pages/admin/FarmerManagementPage.jsx'],
  ['pages/Admin/MarketPriceManagement.jsx', 'pages/admin/MarketPriceManagementPage.jsx'],
  ['pages/Admin/BookingManagement.jsx', 'pages/admin/BookingManagementPage.jsx'],
  ['pages/Admin/NotificationManagement.jsx', 'pages/admin/NotificationManagementPage.jsx'],
  ['pages/Admin/Analytics.jsx', 'pages/admin/AnalyticsPage.jsx'],
  ['pages/Admin/SuccessStoriesManagement.jsx', 'pages/admin/SuccessStoriesManagementPage.jsx'],
  ['pages/Admin/BlogsManagement.jsx', 'pages/admin/BlogsManagementPage.jsx'],
  ['pages/Admin/FertilizerManagement.jsx', 'pages/admin/FertilizerManagementPage.jsx'],
  ['pages/Admin/EquipmentManagement.jsx', 'pages/admin/EquipmentManagementPage.jsx'],
  ['pages/Admin/SoilTestManagement.jsx', 'pages/admin/SoilTestManagementPage.jsx'],
  ['pages/Admin/AdminSoilEntry.jsx', 'pages/admin/AdminSoilEntryPage.jsx'],
  ['pages/Admin/AdminInventory.jsx', 'pages/admin/AdminInventoryPage.jsx'],
  ['pages/SuperAdmin/TechDashboard.jsx', 'pages/admin/TechDashboardPage.jsx'],
  // Admin support pages
  ['pages/Admin/support/SupportDashboard.jsx', 'pages/admin/support/SupportDashboard.jsx'],
  ['pages/Admin/support/TicketList.jsx', 'pages/admin/support/TicketList.jsx'],
  ['pages/Admin/support/TicketDetail.jsx', 'pages/admin/support/TicketDetail.jsx'],
  ['pages/Admin/support/FarmerList.jsx', 'pages/admin/support/FarmerList.jsx'],
  ['pages/Admin/support/FarmerProfile.jsx', 'pages/admin/support/FarmerProfile.jsx'],
  ['pages/Admin/support/BookingManagement.jsx', 'pages/admin/support/BookingManagement.jsx'],
  ['pages/Admin/support/Templates.jsx', 'pages/admin/support/Templates.jsx'],
  ['pages/Admin/support/Notifications.jsx', 'pages/admin/support/Notifications.jsx'],
  ['pages/Admin/support/Reports.jsx', 'pages/admin/support/Reports.jsx'],
  ['pages/Admin/support/AgentManagement.jsx', 'pages/admin/support/AgentManagement.jsx'],
  ['pages/Admin/support/SLASettings.jsx', 'pages/admin/support/SLASettings.jsx'],
];

let count = 0;
for (const [from, to] of copies) {
  const src = path.join(SRC, from);
  const dest = path.join(SRC, to);
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    count++;
  } else {
    console.error(`MISSING: ${src}`);
  }
}

console.log(`Successfully copied ${count}/${copies.length} files`);
