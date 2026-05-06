import {Routes,Route, useLocation } from 'react-router-dom'
import Home from './pages/General/Home'
import Login from './pages/Auth/Login'
import EmailVerify from './pages/Auth/EmailVerify'
import ResetPassword from './pages/Auth/ResetPassword'
import SoilTestAndCropAdvice from './pages/Farming/SoilTestAndCropAdvice'
import Advisor from './pages/Farming/Advisor'
import NotFoundPage from './pages/General/NotFoundPage'
import CustomerCare from './pages/Information/CustomerCare'
import FloatingSupport from './components/FloatingSupport'
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"; 
import Packages from './pages/Information/Packages'
import Blogs from './pages/Information/Blogs'
import BlogDetail from './pages/Information/BlogDetail'
import About from './pages/Information/About'
import OrchardPlanning from './pages/Farming/OrchardPlanning'
import PlanEstateForm from './pages/Farming/PlanEstateForm'
import SuccessStories from './pages/Information/SuccessStories'
import Contact from './pages/Information/ContactUs'
import BookFarmVisit from './pages/Farming/BookFarmVisit'
import MarketPrices from './pages/Farming/MarketPrices'
import WhetherInsights from './pages/Farming/WhetherInsights'
import CropSelection from './pages/Farming/CropSelection'
import AdminLayout from './components/Admin/AdminLayout'
import Dashboard from './pages/Admin/Dashboard'
import UserManagement from './pages/Admin/UserManagement'
import FarmerManagement from './pages/Admin/FarmerManagement'
import MarketPriceManagement from './pages/Admin/MarketPriceManagement'
import BookingManagement from './pages/Admin/BookingManagement'
import NotificationManagement from './pages/Admin/NotificationManagement'
import Analytics from './pages/Admin/Analytics'
import SuccessStoriesManagement from './pages/Admin/SuccessStoriesManagement'
import BlogsManagement from './pages/Admin/BlogsManagement'
import FertilizerManagement from './pages/Admin/FertilizerManagement'
import EquipmentManagement from './pages/Admin/EquipmentManagement'
import SoilTestManagement from './pages/Admin/SoilTestManagement'
import AdminSoilEntry from './pages/Admin/AdminSoilEntry'
import Fertilizers from './pages/Farming/Fertilizers'
import Equipments from './pages/Farming/Equipments'
import MyOrders from './pages/Farming/MyOrders'
import SoilHistory from './pages/Farming/SoilHistory'
// New Marketplace Imports
import Marketplace from './pages/Marketplace/Marketplace'
import ProductDetail from './pages/Marketplace/ProductDetail'
import CartPage from './pages/Marketplace/CartPage'
import Checkout from './pages/Marketplace/Checkout'
import AdminInventory from './pages/Admin/AdminInventory'
import GovernmentSchemes from './pages/Farming/GovernmentSchemes'
import FarmerProfile from './pages/Farming/FarmerProfile'
import FarmerOnboardingSurvey from './pages/Farming/FarmerOnboardingSurvey'
import CropDoctor from './pages/Farming/CropDoctor'
import SupportLayout from './components/Admin/SupportLayout'
import SupportDashboard from './pages/Admin/Support/SupportDashboard'
import SupportTicketList from './pages/Admin/Support/TicketList'
import SupportTicketDetail from './pages/Admin/Support/TicketDetail'
import SupportFarmerList from './pages/Admin/Support/FarmerList'
import SupportFarmerProfile from './pages/Admin/Support/FarmerProfile'
import SupportBookingManagement from './pages/Admin/Support/BookingManagement'
import SupportTemplates from './pages/Admin/Support/Templates'
import SupportNotifications from './pages/Admin/Support/Notifications'
import SupportReports from './pages/Admin/Support/Reports'
import SupportAgentManagement from './pages/Admin/Support/AgentManagement'
import SupportSLASettings from './pages/Admin/Support/SLASettings'
import FarmerLayout from './components/Farming/FarmerLayout'
import FarmerDashboard from './pages/Farming/FarmerDashboard'
import SuperAdminLayout from './components/Admin/SuperAdminLayout'
import TechDashboard from './pages/SuperAdmin/TechDashboard'

const App = () => {
  const location = useLocation();
  const hideSupportPaths = ['/login', '/reset-password', '/email-verify'];

  return (
    <div className="">
      <ToastContainer position="top-right" autoClose={3000} style={{ marginTop: '70px' }} />
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/email-verify" element={<EmailVerify/>}/>
        <Route path="/reset-password" element={<ResetPassword/>}/>
        <Route path="/soil-crop-analysis" element={<SoilTestAndCropAdvice/>}/>
        <Route path="/soil-history" element={<SoilHistory/>}/>
        <Route path="/equipments" element={<Equipments/>}/>
        <Route path="/packages" element={<Packages/>}/>
        <Route path="/blogs" element={<Blogs/>}/>
        <Route path="/blog/:slug" element={<BlogDetail/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/fertilizers" element={<Fertilizers/>}/>
        <Route path="/my-orders" element={<MyOrders/>}/>
        <Route path="/orchard-planning" element={<OrchardPlanning/>}/>
        <Route path="/orchard-planning/plan" element={<PlanEstateForm/>}/>
        <Route path="/success-stories" element={<SuccessStories/>}/>
        <Route path="/book-farm-visit" element={<BookFarmVisit/>}/>
        <Route path="/market-prices" element={<MarketPrices/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/whether-insights" element={<WhetherInsights/>}/>
        <Route path="/crop-selection" element={<CropSelection/>}/>
        <Route path="/government-schemes" element={<GovernmentSchemes/>}/>
        <Route path="/expert-consultations" element={<Advisor/>}/>
        <Route path="/profile" element={<FarmerProfile/>}/>
        <Route path="/onboarding-survey" element={<FarmerOnboardingSurvey/>}/>
        <Route path="/crop-doctor" element={<CropDoctor/>}/>
        
        {/* Marketplace Routes */}
        <Route path="/marketplace" element={<Marketplace/>}/>
        <Route path="/product/:id" element={<ProductDetail/>}/>
        <Route path="/cart" element={<CartPage/>}/>
        <Route path="/checkout" element={<Checkout/>}/>

        {/* Farmer Dashboard Routes */}
        <Route path="/farmer" element={<FarmerLayout />}>
           <Route path="dashboard" element={<FarmerDashboard />} />
        </Route>

        {/* Support Portal Routes */}
        <Route path="/admin/support" element={<SupportLayout />}>
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
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
           <Route index element={<Dashboard />} />
           <Route path="dashboard" element={<Dashboard />} />
           <Route path="users" element={<UserManagement />} />
           <Route path="farmers" element={<FarmerManagement />} />
           <Route path="market" element={<MarketPriceManagement />} />
           <Route path="bookings" element={<BookingManagement />} />
           <Route path="success-stories" element={<SuccessStoriesManagement />} />
           <Route path="blogs" element={<BlogsManagement />} />
           <Route path="fertilizers" element={<FertilizerManagement />} />
           <Route path="equipments" element={<EquipmentManagement />} />
           <Route path="notifications" element={<NotificationManagement />} />
           <Route path="analytics" element={<Analytics />} />
           <Route path="soil-tests" element={<SoilTestManagement />} />
           <Route path="soil-entry" element={<AdminSoilEntry />} />
           <Route path="inventory" element={<AdminInventory />} />
        </Route>

        {/* Super Admin Routes */}
        <Route path="/super-admin" element={<SuperAdminLayout />}>
           <Route index element={<TechDashboard />} />
           <Route path="dashboard" element={<TechDashboard />} />
        </Route>

        <Route path="*" element={<NotFoundPage/>}/>
      </Routes>
      {!hideSupportPaths.includes(location.pathname) && <FloatingSupport/>}
    </div>
  )
}

export default App
