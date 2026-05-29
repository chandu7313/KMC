/**
 * Application Router
 * Centralized route definitions importing pages from their new locations.
 */
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// ─── Layouts ───────────────────────────
import AdminLayout from '@/app/layouts/AdminLayout';
import FarmerLayout from '@/app/layouts/FarmerLayout';
import SupportLayout from '@/app/layouts/SupportLayout';
import SuperAdminLayout from '@/app/layouts/SuperAdminLayout';

// ─── Admin Pages ───────────────────────
import AdminDashboardPage from '@/modules/admin/pages/AdminDashboardPage';
import AdminSupportDashboardPage from '@/modules/admin/pages/AdminSupportDashboardPage';
import TechAdminDashboard from '@/modules/admin/pages/TechAdminDashboard';
import AgriExpertDashboard from '@/modules/admin/pages/AgriExpertDashboard';
import EcommerceDashboard from '@/modules/admin/pages/EcommerceDashboard';
import OrderManagerDashboard from '@/modules/admin/pages/OrderManagerDashboard';
import ContentDashboard from '@/modules/admin/pages/ContentDashboard';
import FinanceDashboard from '@/modules/admin/pages/FinanceDashboard';
import FieldDashboard from '@/modules/admin/pages/FieldDashboard';

// ─── Farmer Pages ──────────────────────
import HomePage from '@/modules/farmer/pages/HomePage';
import NotFoundPage from '@/modules/info/pages/NotFoundPage';
import LoginPage from '@/modules/auth/pages/LoginPage';
import EmailVerifyPage from '@/modules/auth/pages/EmailVerifyPage';
import ResetPasswordPage from '@/modules/auth/pages/ResetPasswordPage';
import DiseaseDetectionPage from '@/modules/disease/pages/DiseaseDetectionPage';
import SoilTestingPage from '@/modules/soil/pages/SoilTestingPage';
import SoilHistoryPage from '@/modules/soil/pages/SoilHistoryPage';
import MarketPage from '@/modules/market/pages/MarketPage';
import ShopPage from '@/modules/ecommerce/pages/ShopPage';
import ProductDetailPage from '@/modules/ecommerce/pages/ProductDetailPage';
import CartPage from '@/modules/ecommerce/pages/CartPage';
import CheckoutPage from '@/modules/ecommerce/pages/CheckoutPage';
import FertilizersPage from '@/modules/ecommerce/pages/FertilizersPage';
import EquipmentsPage from '@/modules/ecommerce/pages/EquipmentsPage';
import OrdersPage from '@/modules/farmer/pages/OrdersPage';
import ExpertConsultationPage from '@/modules/fieldVisit/pages/ExpertConsultationPage';
import BookFarmVisitPage from '@/modules/fieldVisit/pages/BookFarmVisitPage';
import DashboardPage from '@/modules/farmer/pages/DashboardPage';
import ProfilePage from '@/modules/farmer/pages/ProfilePage';
import OnboardingSurveyPage from '@/modules/onboarding/pages/OnboardingSurveyPage';
import GovernmentSchemesPage from '@/modules/content/pages/GovernmentSchemesPage';
import ExpertSupportPage from '@/modules/farmer/pages/ExpertSupportPage';
import OrchardPlanningPage from '@/modules/orchard/pages/OrchardPlanningPage';
import PlanEstateFormPage from '@/modules/orchard/pages/PlanEstateFormPage';
import WeatherInsightsPage from '@/modules/content/pages/WeatherInsightsPage';
import CropSelectionPage from '@/modules/orchard/pages/CropSelectionPage';
import AboutPage from '@/modules/info/pages/AboutPage';
import BlogsPage from '@/modules/content/pages/BlogsPage';
import BlogDetailPage from '@/modules/content/pages/BlogDetailPage';
import ContactPage from '@/modules/info/pages/ContactPage';
import CustomerCarePage from '@/modules/info/pages/CustomerCarePage';
import PackagesPage from '@/modules/ecommerce/pages/PackagesPage';
import SuccessStoriesPage from '@/modules/content/pages/SuccessStoriesPage';

const GlobalLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
  </div>
);

export const AppRouter = () => {
  return (
    <Suspense fallback={<GlobalLoader />}>
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
          <Route path="/farmer/support" element={<ExpertSupportPage />} />
        </Route>

        {/* ─── Admin Dashboard Routes ────── */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          
          {/* New Role-Specific Dashboards */}
          <Route path="tech" element={<TechAdminDashboard />} />
          <Route path="agri" element={<AgriExpertDashboard />} />
          <Route path="ecommerce" element={<EcommerceDashboard />} />
          <Route path="orders" element={<OrderManagerDashboard />} />
          <Route path="content" element={<ContentDashboard />} />
          <Route path="finance" element={<FinanceDashboard />} />
          <Route path="field" element={<FieldDashboard />} />

          {/* Legacy Generic Routes */}
          <Route path="farmers" element={<AdminDashboardPage />} />
          <Route path="soil-tests" element={<AdminDashboardPage />} />
          <Route path="market" element={<AdminDashboardPage />} />
          <Route path="inventory" element={<AdminDashboardPage />} />
          <Route path="bookings" element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminDashboardPage />} />
          <Route path="analytics" element={<AdminDashboardPage />} />
          <Route path="blogs" element={<AdminDashboardPage />} />
          <Route path="soil-entry" element={<AdminDashboardPage />} />
        </Route>

        {/* ─── Admin Support Routes ────────── */}
        <Route path="/admin/support" element={<SupportLayout />}>
          <Route index element={<AdminSupportDashboardPage />} />
          <Route path="tickets" element={<AdminSupportDashboardPage />} />
          <Route path="farmers" element={<AdminSupportDashboardPage />} />
          <Route path="bookings" element={<AdminSupportDashboardPage />} />
          <Route path="templates" element={<AdminSupportDashboardPage />} />
          <Route path="notifications" element={<AdminSupportDashboardPage />} />
          <Route path="reports" element={<AdminSupportDashboardPage />} />
          <Route path="agents" element={<AdminSupportDashboardPage />} />
          <Route path="settings/sla" element={<AdminSupportDashboardPage />} />
        </Route>

        {/* ─── 404 Catch-all ──────────────── */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};
