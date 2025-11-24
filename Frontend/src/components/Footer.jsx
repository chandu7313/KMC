import React from 'react'
import { assets } from "../assets/assets"

const Footer = () => {
  return (
    <footer className="mt-12 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 ring-1 ring-black/5">
      <div className="mx-auto w-[90%] px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <img src={assets.agridust_logo} alt="AgriDust" className="w-9 h-9"/>
              <span className="text-xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-lime-500 bg-clip-text text-transparent">AgriDust</span>
            </div>
            <p className="mt-3 text-sm text-slate-600 max-w-xs">
              Empowering farmers with soil insights, market analytics, and expert advisory for sustainable growth.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><a href="#about" className="hover:text-green-700">About Us</a></li>
              <li><a href="#careers" className="hover:text-green-700">Careers</a></li>
              <li><a href="#blog" className="hover:text-green-700">Blog</a></li>
              <li><a href="#contact" className="hover:text-green-700">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Services</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><a href="#soil" className="hover:text-green-700">Soil Testing</a></li>
              <li><a href="#advisory" className="hover:text-green-700">Crop Advisory</a></li>
              <li><a href="#market" className="hover:text-green-700">Market Insights</a></li>
              <li><a href="#weather" className="hover:text-green-700">Weather Alerts</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Contact</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><span className="font-medium text-slate-800">Email:</span> support@agridust.com</li>
              <li><span className="font-medium text-slate-800">Phone:</span> +91 90000 00000</li>
              <li><span className="font-medium text-slate-800">Address:</span> Pune, MH, India</li>
            </ul>

            {/* Socials */}
            <div className="mt-4 flex items-center gap-3 text-slate-600">
              <a href="https://twitter.com" className="hover:text-green-700" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M19.633 7.997c.013.18.013.36.013.54 0 5.49-4.18 11.81-11.81 11.81-2.35 0-4.53-.69-6.36-1.87.33.04.65.05.99.05 1.95 0 3.75-.66 5.18-1.77a4.167 4.167 0 0 1-3.89-2.88c.26.04.52.07.79.07.38 0 .76-.05 1.11-.15a4.16 4.16 0 0 1-3.34-4.08v-.05c.56.31 1.2.5 1.88.53a4.15 4.15 0 0 1-1.85-3.45c0-.76.2-1.46.56-2.07a11.82 11.82 0 0 0 8.58 4.35c-.06-.31-.09-.64-.09-.97a4.15 4.15 0 0 1 7.18-2.84 8.23 8.23 0 0 0 2.63-1 4.16 4.16 0 0 1-1.83 2.29 8.34 8.34 0 0 0 2.39-.65 8.92 8.92 0 0 1-2.08 2.15z"/></svg>
              </a>
              <a href="https://facebook.com" className="hover:text-green-700" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M13 3h4a1 1 0 0 1 1 1v4h-3a1 1 0 0 0-1 1v3h4l-1 4h-3v6h-4v-6H7v-4h3V9a4 4 0 0 1 4-4z"/></svg>
              </a>
              <a href="https://instagram.com" className="hover:text-green-700" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6-1.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 pt-5">
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} AgriDust. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <a href="#privacy" className="hover:text-green-700">Privacy Policy</a>
            <span className="text-slate-300">|</span>
            <a href="#terms" className="hover:text-green-700">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

