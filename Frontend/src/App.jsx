import {Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import SoilTestAndCropAdvice from './pages/SoilTestAndCropAdvice'
import Equipments from './pages/Equipments'
import Advisor from './pages/Advisor'
import NotFoundPage from './pages/NotFoundPage'
import CustomerCare from './pages/CustomerCare'
import FloatingSupport from './components/FloatingSupport'
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"; 
import Packages from './pages/Packages'
import Blogs from './pages/Blogs'
import About from './pages/About'
import Fertilizers from './pages/Fertilizers'
import OrchardPlanning from './pages/OrchardPlanning'
import SuccessStories from './pages/SuccessStories'
import Contact from './pages/ContactUs'
import BookFarmVisit from './pages/BookFarmVisit'
import MarketPrices from './pages/MarketPrices'
import WhetherInsights from './pages/WhetherInsights'
import CropSelection from './pages/CropSelection'

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
        <Route path="*" element={<NotFoundPage/>}/>
      </Routes>
      <FloatingSupport/>
    </div>
  )
}

export default App
