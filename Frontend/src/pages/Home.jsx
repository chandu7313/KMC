import Header from "../components/Header"
import Navbar from "../components/Navbar"
import WhyChooseUs from "../components/WhyChooseUs"
import AboutCompany from "../components/AboutCompany"
import Footer from "../components/Footer"


const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/bg_img.png')] bg-cover bg-center bg-fixed">
      <Navbar/>
      <Header/>
      <WhyChooseUs/>
      <AboutCompany/>
      <Footer/>
    </div>
  )
}

export default Home
