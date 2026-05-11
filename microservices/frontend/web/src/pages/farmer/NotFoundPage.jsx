import React from 'react'
import Navbar from '../../layouts/components/Navbar'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar/>
      <main className="mx-auto w-[90%] px-4 sm:px-6 lg:px-8 pt-28 pb-12 flex flex-col items-center text-center">
        <img src={assets.not_found} alt="Not found" className="w-full max-w-md rounded-2xl ring-1 ring-black/10 shadow-sm"/>
        <h1 className="mt-6 text-2xl sm:text-3xl font-extrabold text-slate-900">Page not found</h1>
        <p className="mt-2 text-sm text-slate-600 max-w-lg">The page you’re looking for doesn’t exist or has moved. Try going back to the homepage.</p>
        <div className="mt-6">
          <button onClick={()=>navigate('/')} className="rounded-full bg-green-700 px-6 py-2.5 text-white font-medium hover:bg-green-800">Go Home</button>
        </div>
      </main>
    </div>
  )
}

export default NotFoundPage

