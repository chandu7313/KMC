import React, { useState } from 'react'
import Navbar from '../components/Navbar'

const Advisor = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    preferred: '',
    query: ''
  })

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const submit = (e) => {
    e.preventDefault()
    alert('Request submitted! Our advisor will contact you soon.')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar/>

      {/* Hero with background image */}
      <section className="relative pt-28">
        <div className="absolute inset-0 -z-10">
          <img src="/bg_img.png" alt="Fields" className="w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-black/40"/>
        </div>

        <div className="mx-auto w-[90%] px-4 sm:px-6 lg:px-8">
          <div className="py-12 sm:py-16 text-center text-white">
            <h1 className="text-3xl sm:text-5xl font-extrabold">Request a Call from Advisor</h1>
            <p className="mt-3 text-sm sm:text-base text-white/90 max-w-2xl mx-auto">
              Get personalized guidance for crop issues, soil advice, and market insights. Submit your details and we’ll call you back.
            </p>
          </div>

          {/* Form card */}
          <div className="mx-auto max-w-4xl rounded-2xl bg-white/90 backdrop-blur ring-1 ring-black/10 shadow-lg p-6 sm:p-8">
            <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="fullName" value={form.fullName} onChange={onChange} placeholder="Full Name" className="rounded-xl ring-1 ring-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600"/>
              <input name="email" value={form.email} onChange={onChange} placeholder="Email Address" type="email" className="rounded-xl ring-1 ring-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600"/>
              <input name="phone" value={form.phone} onChange={onChange} placeholder="Phone Number" className="rounded-xl ring-1 ring-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600"/>
              <input name="preferred" value={form.preferred} onChange={onChange} placeholder="Preferred Date/Time for Call" className="rounded-xl ring-1 ring-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600"/>
              <textarea name="query" value={form.query} onChange={onChange} placeholder="Describe your query (e.g., crop issue, soil advice, market prices)" className="sm:col-span-2 h-32 rounded-xl ring-1 ring-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600"/>

              <div className="sm:col-span-2 flex justify-center pt-2">
                <button type="submit" className="inline-flex items-center justify-center rounded-full bg-green-700 px-6 py-2.5 text-white shadow-sm hover:bg-green-800">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Advisor

