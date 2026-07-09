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
import ProtectedRoute from '@/modules/auth/guards/ProtectedRoute';

// ─── Admin Pages ───────────────────────
import AdminDashboardPage from '@/modules/admin/pages/AdminDashboardPage';
import TechAdminDashboard from '@/modules/admin/pages/TechAdminDashboard';
import AgriExpertDashboard from '@/modules/admin/pages/AgriExpertDashboard';
import EcommerceDashboard from '@/modules/admin/pages/EcommerceDashboard';
import OrderManagerDashboard from '@/modules/admin/pages/OrderManagerDashboard';
import ContentDashboard from '@/modules/admin/pages/ContentDashboard';
import FinanceDashboard from '@/modules/admin/pages/FinanceDashboard';
import FieldDashboard from '@/modules/admin/pages/FieldDashboard';

// ─── Admin Support Pages ────────────────
import SupportDashboardPage from '@/features/admin/support/pages/SupportDashboardPage';
import TicketListPage from '@/features/admin/support/pages/TicketListPage';
import TicketDetailPage from '@/features/admin/support/pages/TicketDetailPage';
import FarmerListPage from '@/features/admin/support/pages/FarmerListPage';
import BookingListPage from '@/features/admin/support/pages/BookingListPage';
import TemplateListPage from '@/features/admin/support/pages/TemplateListPage';
import NotificationPage from '@/features/admin/support/pages/NotificationPage';
import ReportsPage from '@/features/admin/support/pages/ReportsPage';
import AgentListPage from '@/features/admin/support/pages/AgentListPage';
import SLASettingsPage from '@/features/admin/support/pages/SLASettingsPage';

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
        {/* ─── Public Routes & Exceptions ──────────────── */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/email-verify" element={<EmailVerifyPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/packages" element={<PackagesPage />} />
        
        {/* Exception Pages without Sidebar */}
        <Route path="/customer-care" element={<CustomerCarePage />} />
        <Route path="/whether-insights" element={<WeatherInsightsPage />} />
        <Route path="/my-orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
        <Route path="/government-schemes" element={<GovernmentSchemesPage />} />

        {/* ─── Pages with Sidebar (FarmerLayout) ───── */}
        <Route element={<FarmerLayout />}>
          {/* Main Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/success-stories" element={<SuccessStoriesPage />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/crop-doctor" element={<DiseaseDetectionPage />} />
          <Route path="/marketplace" element={<ShopPage />} />
          <Route path="/market-prices" element={<MarketPage />} />
          
          {/* Dashboard & Profile */}
          <Route path="/farmer/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/farmer/support" element={<ProtectedRoute><ExpertSupportPage /></ProtectedRoute>} />
          
          {/* Tools & Services */}
          <Route path="/soil-crop-analysis" element={<SoilTestingPage />} />
          <Route path="/soil-history" element={<SoilHistoryPage />} />
          <Route path="/equipments" element={<EquipmentsPage />} />
          <Route path="/fertilizers" element={<FertilizersPage />} />
          <Route path="/orchard-planning" element={<OrchardPlanningPage />} />
          <Route path="/orchard-planning/plan" element={<PlanEstateFormPage />} />
          <Route path="/book-farm-visit" element={<BookFarmVisitPage />} />
          <Route path="/onboarding-survey" element={<ProtectedRoute><OnboardingSurveyPage /></ProtectedRoute>} />
        </Route>

        {/* ─── Additional Marketplace Routes ─────────── */}
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />

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
          <Route index element={<SupportDashboardPage />} />
          <Route path="tickets" element={<TicketListPage />} />
          <Route path="tickets/:id" element={<TicketDetailPage />} />
          <Route path="farmers" element={<FarmerListPage />} />
          <Route path="bookings" element={<BookingListPage />} />
          <Route path="templates" element={<TemplateListPage />} />
          <Route path="notifications" element={<NotificationPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="agents" element={<AgentListPage />} />
          <Route path="settings/sla" element={<SLASettingsPage />} />
        </Route>

        {/* ─── Super Admin Routes ─────────── */}
        <Route path="/super-admin" element={<SuperAdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="system" element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminDashboardPage />} />
          <Route path="monitoring" element={<AdminDashboardPage />} />
          <Route path="developer" element={<AdminDashboardPage />} />
        </Route>

        {/* ─── 404 Catch-all ──────────────── */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};
