import React from 'react'

const cards = [
  {
    title: 'Data-Driven Insights',
    desc: 'AI powered analytics for smarter decisions.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path fillRule="evenodd" d="M11.25 2.25a9 9 0 1 0 5.32 16.29l3.6 3.6a.75.75 0 0 0 1.06-1.06l-3.6-3.6A9 9 0 0 0 11.25 2.25zm0 1.5a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15z" clipRule="evenodd" />
        <path d="M15 10.5a3.75 3.75 0 1 1-7.5 0 .75.75 0 0 1 1.5 0A2.25 2.25 0 1 0 11.25 8a.75.75 0 0 1 0-1.5A3.75 3.75 0 0 1 15 10.5z" />
      </svg>
    ),
  },
  {
    title: 'Expert Advisors',
    desc: 'Get personalized guidance from agronomists.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M8.25 9a3.75 3.75 0 1 0 7.5 0 3.75 3.75 0 0 0-7.5 0Z" />
        <path fillRule="evenodd" d="M2.25 18a5.25 5.25 0 0 1 5.25-5.25h9a5.25 5.25 0 0 1 5.25 5.25v.75a.75.75 0 0 1-.75.75H3a.75.75 0 0 1-.75-.75V18z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    title: 'Proven Results',
    desc: 'Join thousands of successful farmers.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v2.69a9.004 9.004 0 0 1 6.31 6.31H21a.75.75 0 0 1 0 1.5h-1.94a9.004 9.004 0 0 1-6.31 6.31V21a.75.75 0 0 1-1.5 0v-1.94a9.004 9.004 0 0 1-6.31-6.31H3a.75.75 0 0 1 0-1.5h1.94a9.004 9.004 0 0 1 6.31-6.31V3a.75.75 0 0 1 .75-.75zm-3.22 9.97a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.06 0l4.5-4.5a.75.75 0 1 0-1.06-1.06l-3.97 3.97-1.72-1.72z" clipRule="evenodd" />
      </svg>
    ),
  },
]

const WhyChooseUs = () => {
  return (
    <section className="mx-auto w-[90%] px-4 sm:px-6 lg:px-8 mt-30">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-green-800 mb-6 text-center">Why Choose Us</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map((card, idx) => (
          <div key={idx} className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm p-6 flex flex-col items-start">
            <div className="mb-4 inline-flex items-center justify-center h-14 w-14 rounded-full bg-green-50 ring-1 ring-green-100 text-green-700">
              {card.icon}
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{card.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-7 flex justify-center">
        <button className="inline-flex items-center justify-center rounded-full bg-green-700 px-6 py-2.5 text-white shadow-sm hover:bg-green-800">Learn More</button>
      </div>
    </section>
  )
}

export default WhyChooseUs