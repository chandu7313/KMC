import {Routes,Route } from 'react-router-dom'
import Home from './pages/General/Home'
import Login from './pages/Auth/Login'
import EmailVerify from './pages/Auth/EmailVerify'
import ResetPassword from './pages/Auth/ResetPassword'
import SoilTestAndCropAdvice from './pages/Farming/SoilTestAndCropAdvice'
import Equipments from './pages/Farming/Equipments'
import Advisor from './pages/Farming/Advisor'
import NotFoundPage from './pages/General/NotFoundPage'
import CustomerCare from './pages/Information/CustomerCare'
import FloatingSupport from './components/FloatingSupport'
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"; 
import Packages from './pages/Information/Packages'
import Blogs from './pages/Information/Blogs'
import About from './pages/Information/About'
import Fertilizers from './pages/Farming/Fertilizers'
import OrchardPlanning from './pages/Farming/OrchardPlanning'
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

const App = () => {
  return (
    <div className="">
      <ToastContainer/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/email-verify" element={<EmailVerify/>}/>
        <Route path="/reset-password" element={<ResetPassword/>}/>
        <Route path="/soil-crop-analysis" element={<SoilTestAndCropAdvice/>}/>
        <Route path="/equipments" element={<Equipments/>}/>
        <Route path="/packages" element={<Packages/>}/>
        <Route path="/blogs" element={<Blogs/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/fertilizers" element={<Fertilizers/>}/>
        <Route path="/orchard-planning" element={<OrchardPlanning/>}/>
        <Route path="/success-stories" element={<SuccessStories/>}/>
        <Route path="/book-farm-visit" element={<BookFarmVisit/>}/>
        <Route path="/market-prices" element={<MarketPrices/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/whether-insights" element={<WhetherInsights/>}/>
        <Route path="/crop-selection" element={<CropSelection/>}/>
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
           <Route index element={<Dashboard />} />
           <Route path="dashboard" element={<Dashboard />} />
           <Route path="users" element={<UserManagement />} />
           <Route path="farmers" element={<FarmerManagement />} />
           <Route path="market" element={<MarketPriceManagement />} />
           <Route path="bookings" element={<BookingManagement />} />
           <Route path="notifications" element={<NotificationManagement />} />
           <Route path="analytics" element={<Analytics />} />
        </Route>

        <Route path="*" element={<NotFoundPage/>}/>
      </Routes>
      <FloatingSupport/>
    </div>
  )
}

export default App
