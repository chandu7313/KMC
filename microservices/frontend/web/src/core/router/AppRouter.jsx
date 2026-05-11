/**
 * Application Router
 * Centralized route definitions importing pages from their new locations.
 * 
 * NOTE: This file uses the NEW page paths (pages/farmer/*, pages/admin/*).
 * Before this works, you must run: node move-files.js
 * to copy all page components to their new locations.
 */
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// ─── Layouts ───────────────────────────
import AdminLayout from '../../layouts/AdminLayout';
import FarmerLayout from '../../layouts/FarmerLayout';
import SupportLayout from '../../layouts/SupportLayout';
import SuperAdminLayout from '../../layouts/SuperAdminLayout';

// ─── Farmer Pages ──────────────────────
import HomePage from '../../pages/farmer/HomePage';
import NotFoundPage from '../../pages/farmer/NotFoundPage';
import LoginPage from '../../pages/farmer/LoginPage';
import EmailVerifyPage from '../../pages/farmer/EmailVerifyPage';
import ResetPasswordPage from '../../pages/farmer/ResetPasswordPage';
import DiseaseDetectionPage from '../../pages/farmer/DiseaseDetectionPage';
import SoilTestingPage from '../../pages/farmer/SoilTestingPage';
import SoilHistoryPage from '../../pages/farmer/SoilHistoryPage';
import MarketPage from '../../pages/farmer/MarketPage';
import ShopPage from '../../pages/farmer/ShopPage';
import ProductDetailPage from '../../pages/farmer/ProductDetailPage';
import CartPage from '../../pages/farmer/CartPage';
import CheckoutPage from '../../pages/farmer/CheckoutPage';
import FertilizersPage from '../../pages/farmer/FertilizersPage';
import EquipmentsPage from '../../pages/farmer/EquipmentsPage';
import OrdersPage from '../../pages/farmer/OrdersPage';
import ExpertConsultationPage from '../../pages/farmer/ExpertConsultationPage';
import BookFarmVisitPage from '../../pages/farmer/BookFarmVisitPage';
import DashboardPage from '../../pages/farmer/DashboardPage';
import ProfilePage from '../../pages/farmer/ProfilePage';
import OnboardingSurveyPage from '../../pages/farmer/OnboardingSurveyPage';
import GovernmentSchemesPage from '../../pages/farmer/GovernmentSchemesPage';
import OrchardPlanningPage from '../../pages/farmer/OrchardPlanningPage';
import PlanEstateFormPage from '../../pages/farmer/PlanEstateFormPage';
import WeatherInsightsPage from '../../pages/farmer/WeatherInsightsPage';
import CropSelectionPage from '../../pages/farmer/CropSelectionPage';
import AboutPage from '../../pages/farmer/AboutPage';
import BlogsPage from '../../pages/farmer/BlogsPage';
import BlogDetailPage from '../../pages/farmer/BlogDetailPage';
import ContactPage from '../../pages/farmer/ContactPage';
import CustomerCarePage from '../../pages/farmer/CustomerCarePage';
import PackagesPage from '../../pages/farmer/PackagesPage';
import SuccessStoriesPage from '../../pages/farmer/SuccessStoriesPage';

// ─── Admin Pages ───────────────────────
// import AdminDashboardPage from '../../pages/admin/DashboardPage';
// import UserManagementPage from '../../pages/admin/UserManagementPage';
// import FarmerManagementPage from '../../pages/admin/FarmerManagementPage';
// import MarketPriceManagementPage from '../../pages/admin/MarketPriceManagementPage';
// import BookingManagementPage from '../../pages/admin/BookingManagementPage';
// import NotificationManagementPage from '../../pages/admin/NotificationManagementPage';
// import AnalyticsPage from '../../pages/admin/AnalyticsPage';
// import SuccessStoriesManagementPage from '../../pages/admin/SuccessStoriesManagementPage';
// import BlogsManagementPage from '../../pages/admin/BlogsManagementPage';
// import FertilizerManagementPage from '../../pages/admin/FertilizerManagementPage';
// import EquipmentManagementPage from '../../pages/admin/EquipmentManagementPage';
// import SoilTestManagementPage from '../../pages/admin/SoilTestManagementPage';
// import AdminSoilEntryPage from '../../pages/admin/AdminSoilEntryPage';
// import AdminInventoryPage from '../../pages/admin/AdminInventoryPage';
// import TechDashboardPage from '../../pages/admin/TechDashboardPage';

// ─── Support Pages ─────────────────────
// import SupportDashboard from '../../pages/admin/support/SupportDashboard';
// import SupportTicketList from '../../pages/admin/support/TicketList';
// import SupportTicketDetail from '../../pages/admin/support/TicketDetail';
// import SupportFarmerList from '../../pages/admin/support/FarmerList';
// import SupportFarmerProfile from '../../pages/admin/support/FarmerProfile';
// import SupportBookingManagement from '../../pages/admin/support/BookingManagement';
// import SupportTemplates from '../../pages/admin/support/Templates';
// import SupportNotifications from '../../pages/admin/support/Notifications';
// import SupportReports from '../../pages/admin/support/Reports';
// import SupportAgentManagement from '../../pages/admin/support/AgentManagement';
// import SupportSLASettings from '../../pages/admin/support/SLASettings';

const AppRouter = () => {
  return (
    <Routes>
      {/* ─── Public Routes ──────────────── */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/email-verify" element={<EmailVerifyPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/blogs" element={<BlogsPage />} />
      <Route path="/blog/:slug" element={<BlogDetailPage />} />
      <Route path="/packages" element={<PackagesPage />} />
      <Route path="/success-stories" element={<SuccessStoriesPage />} />
      <Route path="/customer-care" element={<CustomerCarePage />} />

      {/* ─── Farmer Routes ──────────────── */}
      <Route path="/soil-crop-analysis" element={<SoilTestingPage />} />
      <Route path="/soil-history" element={<SoilHistoryPage />} />
      <Route path="/equipments" element={<EquipmentsPage />} />
      <Route path="/fertilizers" element={<FertilizersPage />} />
      <Route path="/my-orders" element={<OrdersPage />} />
      <Route path="/orchard-planning" element={<OrchardPlanningPage />} />
      <Route path="/orchard-planning/plan" element={<PlanEstateFormPage />} />
      <Route path="/book-farm-visit" element={<BookFarmVisitPage />} />
      <Route path="/market-prices" element={<MarketPage />} />
      <Route path="/whether-insights" element={<WeatherInsightsPage />} />
      <Route path="/crop-selection" element={<CropSelectionPage />} />
      <Route path="/government-schemes" element={<GovernmentSchemesPage />} />
      <Route path="/expert-consultations" element={<ExpertConsultationPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/onboarding-survey" element={<OnboardingSurveyPage />} />
      <Route path="/crop-doctor" element={<DiseaseDetectionPage />} />

      {/* ─── Marketplace Routes ─────────── */}
      <Route path="/marketplace" element={<ShopPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />

      {/* ─── Farmer Dashboard Routes ───── */}
      <Route path="/farmer" element={<FarmerLayout />}>
        <Route path="dashboard" element={<DashboardPage />} />
      </Route>

      {/* ─── Support Portal Routes ──────── */}
      {/* <Route path="/admin/support" element={<SupportLayout />}>
        <Route index element={<SupportDashboard />} />
        <Route path="tickets" element={<SupportTicketList />} />
        <Route path="tickets/:id" element={<SupportTicketDetail />} />
        <Route path="farmers" element={<SupportFarmerList />} />
        <Route path="farmers/:id" element={<SupportFarmerProfile />} />
        <Route path="bookings" element={<SupportBookingManagement />} />
        <Route path="templates" element={<SupportTemplates />} />
        <Route path="notifications" element={<SupportNotifications />} />
        <Route path="reports" element={<SupportReports />} />
        <Route path="agents" element={<SupportAgentManagement />} />
        <Route path="settings" element={<SupportSLASettings />} />
      </Route> */}

      {/* ─── Admin Routes ───────────────── */}
      {/* <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="farmers" element={<FarmerManagementPage />} />
        <Route path="market" element={<MarketPriceManagementPage />} />
        <Route path="bookings" element={<BookingManagementPage />} />
        <Route path="success-stories" element={<SuccessStoriesManagementPage />} />
        <Route path="blogs" element={<BlogsManagementPage />} />
        <Route path="fertilizers" element={<FertilizerManagementPage />} />
        <Route path="equipments" element={<EquipmentManagementPage />} />
        <Route path="notifications" element={<NotificationManagementPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="soil-tests" element={<SoilTestManagementPage />} />
        <Route path="soil-entry" element={<AdminSoilEntryPage />} />
        <Route path="inventory" element={<AdminInventoryPage />} />
      </Route> */}

      {/* ─── Super Admin Routes ─────────── */}
      {/* <Route path="/super-admin" element={<SuperAdminLayout />}>
        <Route index element={<TechDashboardPage />} />
        <Route path="dashboard" element={<TechDashboardPage />} />
      </Route> */}

      {/* ─── 404 Catch-all ──────────────── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;
