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
import HomePage from '@/modules/farmer/pages/HomePage';
import NotFoundPage from '@/modules/farmer/pages/NotFoundPage';
import LoginPage from '@/modules/farmer/pages/LoginPage';
import EmailVerifyPage from '@/modules/farmer/pages/EmailVerifyPage';
import ResetPasswordPage from '@/modules/farmer/pages/ResetPasswordPage';
import DiseaseDetectionPage from '@/modules/farmer/pages/DiseaseDetectionPage';
import SoilTestingPage from '@/modules/farmer/pages/SoilTestingPage';
import SoilHistoryPage from '@/modules/farmer/pages/SoilHistoryPage';
import MarketPage from '@/modules/farmer/pages/MarketPage';
import ShopPage from '@/modules/farmer/pages/ShopPage';
import ProductDetailPage from '@/modules/farmer/pages/ProductDetailPage';
import CartPage from '@/modules/farmer/pages/CartPage';
import CheckoutPage from '@/modules/farmer/pages/CheckoutPage';
import FertilizersPage from '@/modules/farmer/pages/FertilizersPage';
import EquipmentsPage from '@/modules/farmer/pages/EquipmentsPage';
import OrdersPage from '@/modules/farmer/pages/OrdersPage';
import ExpertConsultationPage from '@/modules/farmer/pages/ExpertConsultationPage';
import BookFarmVisitPage from '@/modules/farmer/pages/BookFarmVisitPage';
import DashboardPage from '@/modules/farmer/pages/DashboardPage';
import ProfilePage from '@/modules/farmer/pages/ProfilePage';
import OnboardingSurveyPage from '@/modules/farmer/pages/OnboardingSurveyPage';
import GovernmentSchemesPage from '@/modules/farmer/pages/GovernmentSchemesPage';
import OrchardPlanningPage from '@/modules/farmer/pages/OrchardPlanningPage';
import PlanEstateFormPage from '@/modules/farmer/pages/PlanEstateFormPage';
import WeatherInsightsPage from '@/modules/farmer/pages/WeatherInsightsPage';
import CropSelectionPage from '@/modules/farmer/pages/CropSelectionPage';
import AboutPage from '@/modules/farmer/pages/AboutPage';
import BlogsPage from '@/modules/farmer/pages/BlogsPage';
import BlogDetailPage from '@/modules/farmer/pages/BlogDetailPage';
import ContactPage from '@/modules/farmer/pages/ContactPage';
import CustomerCarePage from '@/modules/farmer/pages/CustomerCarePage';
import PackagesPage from '@/modules/farmer/pages/PackagesPage';
import SuccessStoriesPage from '@/modules/farmer/pages/SuccessStoriesPage';

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
      <Route element={<FarmerLayout />}>
        <Route path="/farmer/dashboard" element={<DashboardPage />} />
        <Route path="/market-prices" element={<MarketPage />} />
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
