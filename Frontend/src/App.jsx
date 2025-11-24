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
        <Route path="/advisory" element={<Advisor/>}/>
        <Route path="/help" element={<CustomerCare/>}/>
        <Route path="*" element={<NotFoundPage/>}/>
      </Routes>
      <FloatingSupport/>
    </div>
  )
}

export default App
