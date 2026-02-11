import React, { useState } from 'react'
import Navbar from '../../components/Navbar'

const SoilTestAndCropAdvice = () => {
  const [inputs, setInputs] = useState({
    ph: '',
    n: '',
    p: '',
    k: '',
    om: ''
  })

  const onChange = (e) => {
    const { name, value } = e.target
    setInputs((prev) => ({ ...prev, [name]: value }))
  }

  const [result, setResult] = useState(null)

  const analyze = (e) => {
    e.preventDefault()
    const ph = parseFloat(inputs.ph)
    const n = parseFloat(inputs.n)
    const p = parseFloat(inputs.p)
    const k = parseFloat(inputs.k)
    const om = parseFloat(inputs.om)

    if ([ph, n, p, k, om].some((v) => Number.isNaN(v))) {
      setResult(null)
      return alert('Please fill all fields with numeric values.')
    }

    let phStatus = 'Neutral'
    if (ph < 6.0) phStatus = 'Acidic'
    else if (ph > 7.5) phStatus = 'Alkaline'

    // Simple reference targets (demo)
    const targets = { n: 50, p: 30, k: 200, om: 3 }
    const pct = (val, target) => Math.max(5, Math.min(100, Math.round((val / target) * 100)))
    const nPct = pct(n, targets.n)
    const pPct = pct(p, targets.p)
    const kPct = pct(k, targets.k)
    const omPct = pct(om, targets.om)

    const classify = (valuePct) => {
      if (valuePct < 60) return 'Low'
      if (valuePct < 90) return 'Medium'
      return 'High'
    }

    // Fertilizer suggestion (very simplified demo)
    const ferts = []
    if (nPct < 90) ferts.push('Urea (46-0-0)')
    if (pPct < 90) ferts.push('DAP (18-46-0)')
    if (kPct < 90) ferts.push('MOP (0-0-60)')
    const fertText = ferts.length ? `${ferts.join(' + ')} — apply based on deficit` : 'Balanced — maintenance dose only'

    // Crops suggestion based on pH
    let crops = ['Wheat', 'Maize', 'Pulses']
    if (phStatus === 'Acidic') crops = ['Rice', 'Potato', 'Tea']
    if (phStatus === 'Alkaline') crops = ['Barley', 'Cotton', 'Sorghum']

    setResult({
      ph,
      phStatus,
      bars: [
        { label: 'Nitrogen', pct: nPct, level: classify(nPct) },
        { label: 'Phosphorus', pct: pPct, level: classify(pPct) },
        { label: 'Potassium', pct: kPct, level: classify(kPct) },
        { label: 'Organic Matter', pct: omPct, level: classify(omPct) },
      ],
      recommendation: fertText,
      crops,
    })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar/>

      <main className="mx-auto w-[90%] px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Input card */}
          <section className="lg:col-span-1">
            <div className="rounded-2xl bg-white ring-1 ring-black/10 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-slate-900">Soil Test & Analysis</h2>
              <p className="mt-1 text-sm text-slate-600">Input your soil data</p>

              <form onSubmit={analyze} className="mt-4 space-y-3">
                <input name="ph" value={inputs.ph} onChange={onChange} placeholder="pH Level" className="w-full rounded-xl ring-1 ring-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"/>
                <input name="n" value={inputs.n} onChange={onChange} placeholder="Nitrogen (N) ppm" className="w-full rounded-xl ring-1 ring-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"/>
                <input name="p" value={inputs.p} onChange={onChange} placeholder="Phosphorus (P) ppm" className="w-full rounded-xl ring-1 ring-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"/>
                <input name="k" value={inputs.k} onChange={onChange} placeholder="Potassium (K) ppm" className="w-full rounded-xl ring-1 ring-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"/>
                <input name="om" value={inputs.om} onChange={onChange} placeholder="Organic Matter (%)" className="w-full rounded-xl ring-1 ring-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"/>

                <div className="pt-2">
                  <button type="submit" className="w-full rounded-xl bg-green-600 px-4 py-2.5 text-white font-medium hover:bg-green-700">Analyze Soil</button>
                </div>
              </form>
            </div>
          </section>

          {/* Right: Reports */}
          <section className="lg:col-span-2 space-y-6">
            {/* Health report gauge */}
            <div className="rounded-2xl bg-white ring-1 ring-black/10 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900">Your Soil Health Report</h3>
              <div className="mt-4 flex items-center gap-6">
                {/* Simple circular gauge */}
                <div className="relative h-28 w-28">
                  <svg viewBox="0 0 36 36" className="h-28 w-28">
                    <path d="M18 2a16 16 0 1 1 0 32 16 16 0 0 1 0-32" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                    <path d="M18 2a16 16 0 1 1 0 32 16 16 0 0 1 0-32" fill="none" stroke="#16a34a" strokeWidth="4" strokeDasharray={`${result ? Math.min(100, Math.max(0, Math.round(((result.ph - 3) / 6) * 100))) : 65} 100`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-sm text-slate-600">pH: {result ? result.ph.toFixed(1) : '6.8'}</span>
                    <span className="text-xs text-green-600">{result ? result.phStatus : 'Neutral'}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 max-w-md">Balanced pH supports nutrient availability. Keep monitoring seasonal variation.</p>
              </div>
            </div>

            {/* Nutrient levels */}
            <div className="rounded-2xl bg-white ring-1 ring-black/10 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900">Nutrient Levels</h3>
              <div className="mt-4 space-y-4">
                {(result ? result.bars : [
                  {label:'Nitrogen', pct:92, level:'High'},
                  {label:'Phosphorus', pct:55, level:'Medium'},
                  {label:'Potassium', pct:35, level:'Low'},
                  {label:'Organic Matter', pct:80, level:'Medium'},
                ]).map((b, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                      <span>{b.label}</span><span>{b.level}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div className="h-2 rounded-full bg-green-600" style={{ width: `${b.pct}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suitable crops / fertilizer */}
            <div className="rounded-2xl bg-white ring-1 ring-black/10 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900">Suitable Crops & Fertilizer</h3>
              <div className="mt-4 rounded-xl ring-1 ring-slate-200 p-4">
                <p className="text-sm text-slate-800"><span className="font-semibold">{result ? result.recommendation : 'Urea (45-0-0) + DAP (18-46-0) — 150 kg/acre'}</span></p>
              </div>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(result ? result.crops : ['Rice','Wheat','Lentils','Maize']).map((c) => (
                  <div key={c} className="rounded-xl ring-1 ring-slate-200 p-3 flex items-center justify-center text-sm text-slate-700">
                    {c}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default SoilTestAndCropAdvice

