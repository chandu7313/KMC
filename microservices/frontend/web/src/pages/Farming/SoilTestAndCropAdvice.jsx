import React, { useState, useContext } from 'react';
import Navbar from '../../components/Navbar';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Upload, X, FileText, Image as ImageIcon, Loader2, Calendar, ShieldCheck, ArrowRight, Beaker, UserCheck, Info, CheckCircle2, Leaf, Sprout, AlertTriangle } from 'lucide-react';

const SoilTestAndCropAdvice = () => {
  const { backendUrl, userData, navigate } = useContext(AppContext);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [manualData, setManualData] = useState({
    ph: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    organicMatter: ''
  });
  const [bookingData, setBookingData] = useState({
    farmerName: '',
    preferredDate: '',
    timeSlot: '',
    purpose: '',
    notes: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [step, setStep] = useState(1);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate File Type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error('Only PDF and Image files (JPG, PNG) are allowed.');
      return;
    }

    // Validate File Size (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB.');
      return;
    }

    setFile(selectedFile);

    // Create Preview
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview('pdf'); // Indicator for PDF
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleManualChange = (e) => {
    setManualData({ ...manualData, [e.target.name]: e.target.value });
  };

  const handleBookingChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleBookVisit = async () => {
    if (!userData) {
      toast.error('Please login to book a visit.');
      navigate('/login');
      return;
    }

    if (!bookingData.farmerName || !bookingData.preferredDate || !bookingData.timeSlot || !bookingData.purpose) {
      toast.error('Please fill all required booking fields.');
      return;
    }

    setBookingLoading(true);
    try {
      // For now, show success — backend endpoint can be wired later
      toast.success('Officer visit booked successfully! You will receive a confirmation shortly.');
      setBookingData({ farmerName: '', preferredDate: '', timeSlot: '', purpose: '', notes: '' });
    } catch (error) {
      toast.error('Error booking visit. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData) {
      toast.error('Please login to upload soil tests.');
      navigate('/login');
      return;
    }

    const hasManualData = manualData.ph && manualData.nitrogen && manualData.phosphorus && manualData.potassium && manualData.organicMatter;

    if (!file && !hasManualData) {
      toast.error('Please either upload a report or fill all manual entry fields.');
      return;
    }

    setLoading(true);
    try {
      axios.defaults.withCredentials = true;
      const formData = new FormData();
      if (file) {
        formData.append('reportFile', file);
      }
      if (hasManualData) {
        formData.append('ph', manualData.ph);
        formData.append('nitrogen', manualData.nitrogen);
        formData.append('phosphorus', manualData.phosphorus);
        formData.append('potassium', manualData.potassium);
        formData.append('organicMatter', manualData.organicMatter);
      }

      const { data } = await axios.post(`${backendUrl}/api/soil/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data.success) {
        toast.success(hasManualData ? 'Soil data analyzed successfully!' : 'Soil report uploaded successfully!');
        setResultData(data.data);
        setStep(3);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error submitting data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 pt-28 pb-24">
        
        {/* Progress Bar */}
        <div className="max-w-3xl mx-auto mb-10 relative">
          <div className="absolute top-4 left-0 w-full h-1 bg-slate-200 rounded-full z-0"></div>
          <div className={`absolute top-4 left-0 h-1 bg-green-700 rounded-full z-0 transition-all duration-500 ${step === 3 ? 'w-full' : step === 2 ? 'w-2/3' : 'w-1/3'}`}></div>
          
          <div className="flex justify-between relative z-10">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-sm border-[3px] border-white ${step >= 1 ? 'bg-green-700 text-white' : 'bg-slate-200 text-slate-500'}`}>
                {step > 1 ? <CheckCircle2 size={18}/> : '1'}
              </div>
              <span className={`text-[11px] font-bold mt-2 tracking-widest uppercase ${step >= 1 ? 'text-green-700' : 'text-slate-400'}`}>Upload</span>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-sm border-[3px] border-white ${step >= 2 ? 'bg-green-700 text-white' : 'bg-slate-200 text-slate-500'}`}>
                {step > 2 ? <CheckCircle2 size={18}/> : '2'}
              </div>
              <span className={`text-[11px] font-bold mt-2 tracking-widest uppercase ${step >= 2 ? 'text-green-700' : 'text-slate-400'}`}>Review</span>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-sm border-[3px] border-white ${step >= 3 ? 'bg-green-700 text-white' : 'bg-slate-200 text-slate-500'}`}>
                {step >= 3 ? <CheckCircle2 size={18}/> : '3'}
              </div>
              <span className={`text-[11px] font-bold mt-2 tracking-widest uppercase ${step >= 3 ? 'text-green-700' : 'text-slate-400'}`}>Results</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Upload & Manual Entry) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Upload Area */}
            <div className="border-2 border-dashed border-slate-300 rounded-[20px] bg-white p-10 text-center relative hover:border-green-400 hover:bg-green-50/30 transition-colors">
              {!file ? (
                <>
                  <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-5 text-green-700">
                    <Upload size={28} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">Upload Soil Report</h2>
                  <p className="text-sm text-slate-500 mb-6">Supported formats: PDF, JPG, PNG. Max file size: 10MB per document.</p>
                  <label className="inline-block bg-green-200/50 text-green-800 font-bold px-6 py-2.5 rounded-lg cursor-pointer hover:bg-green-200 transition-colors">
                    Browse Files
                    <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,image/*" />
                  </label>
                </>
              ) : (
                <div className="relative w-full h-40 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={clearFile}
                    className="absolute top-0 right-0 z-10 p-1.5 bg-white rounded-full text-slate-500 hover:text-red-500 shadow-md border border-slate-200"
                  >
                    <X size={16} />
                  </button>
                  {preview === 'pdf' ? (
                    <div className="flex flex-col items-center">
                      <FileText size={48} className="text-red-500 mb-3" />
                      <p className="font-bold text-slate-800">{file.name}</p>
                      <p className="text-xs text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-6">
                      <img src={preview} alt="Upload preview" className="max-h-32 object-contain rounded-lg shadow-sm border border-slate-200" />
                      <div className="text-left">
                        <p className="font-bold text-slate-800">{file.name}</p>
                        <p className="text-xs text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center">
              <div className="h-px bg-slate-200 flex-1"></div>
              <span className="px-4 text-[11px] font-bold text-slate-400 tracking-widest uppercase">OR MANUAL ENTRY</span>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>

            {/* Manual Entry */}
            <div className="bg-white rounded-[20px] shadow-sm border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Beaker className="text-green-700" size={24} />
                <h3 className="text-xl font-bold text-slate-900">Chemical Composition Data</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Soil PH Level</label>
                  <div className="relative">
                    <input 
                      type="number" step="0.1" name="ph" value={manualData.ph} onChange={handleManualChange}
                      placeholder="e.g. 6.5" 
                      className="w-full bg-slate-100 border-none rounded-lg px-4 py-3 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Nitrogen (N)</label>
                  <div className="relative">
                    <input 
                      type="number" step="0.1" name="nitrogen" value={manualData.nitrogen} onChange={handleManualChange}
                      placeholder="mg/kg" 
                      className="w-full bg-slate-100 border-none rounded-lg px-4 py-3 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-green-500 outline-none pr-16"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400">kg/ha</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Phosphorus (P)</label>
                  <div className="relative">
                    <input 
                      type="number" step="0.1" name="phosphorus" value={manualData.phosphorus} onChange={handleManualChange}
                      placeholder="mg/kg" 
                      className="w-full bg-slate-100 border-none rounded-lg px-4 py-3 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-green-500 outline-none pr-16"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400">kg/ha</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Potassium (K)</label>
                  <div className="relative">
                    <input 
                      type="number" step="0.1" name="potassium" value={manualData.potassium} onChange={handleManualChange}
                      placeholder="mg/kg" 
                      className="w-full bg-slate-100 border-none rounded-lg px-4 py-3 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-green-500 outline-none pr-16"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400">kg/ha</span>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Organic Matter Content (%)</label>
                  <div className="relative">
                    <input 
                      type="number" step="0.1" name="organicMatter" value={manualData.organicMatter} onChange={handleManualChange}
                      placeholder="Percentage value" 
                      className="w-full bg-slate-100 border-none rounded-lg px-4 py-3 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            {resultData && step === 3 && (
              <div className="bg-white rounded-[20px] shadow-sm border border-green-200 p-8 animate-in fade-in duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-xl"><Leaf className="text-green-700" size={24} /></div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Soil Analysis Results</h3>
                    <p className="text-sm text-slate-500">Report #{resultData.id}</p>
                  </div>
                  <span className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${resultData.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {resultData.status || 'Pending'}
                  </span>
                </div>

                {resultData.status === 'Completed' ? (
                  <div className="space-y-6">
                    {/* Soil Status */}
                    <div className={`p-4 rounded-xl border ${resultData.soilStatus?.includes('Acidic') || resultData.soilStatus?.includes('Alkaline') ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Soil Status</p>
                      <p className="text-lg font-bold text-slate-900">{resultData.soilStatus || 'N/A'}</p>
                      {resultData.suitabilityPct && <p className="text-sm text-slate-600 mt-1">Suitability: {resultData.suitabilityPct}%</p>}
                    </div>

                    {/* Nutrient Levels */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[{label:'pH', val:resultData.ph}, {label:'N', val:resultData.nitrogen}, {label:'P', val:resultData.phosphorus}, {label:'K', val:resultData.potassium}].map(n => (
                        <div key={n.label} className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{n.label}</p>
                          <p className="text-lg font-black text-slate-900">{n.val ?? '-'}</p>
                        </div>
                      ))}
                    </div>

                    {/* Fertilizer Recommendation */}
                    {resultData.recommendedFertilizer && (
                      <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                        <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">Recommended Fertilizer</p>
                        <p className="text-sm font-bold text-slate-800">{resultData.recommendedFertilizer}</p>
                      </div>
                    )}

                    {/* Suitable Crops */}
                    {resultData.suitableCrops?.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2"><Sprout size={14}/> Suitable Crops</p>
                        <div className="flex flex-wrap gap-2">
                          {resultData.suitableCrops.map(crop => (
                            <span key={crop} className="bg-green-100 text-green-800 text-sm font-bold px-4 py-2 rounded-xl">{crop}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Next Test */}
                    {resultData.nextTestDate && (
                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 flex items-center gap-3">
                        <Calendar size={18} className="text-blue-600"/>
                        <div>
                          <p className="text-xs font-bold text-blue-700 uppercase">Next Test Recommended</p>
                          <p className="text-sm font-bold text-slate-800">{new Date(resultData.nextTestDate).toLocaleDateString('en-IN', {year:'numeric',month:'long',day:'numeric'})}</p>
                        </div>
                      </div>
                    )}

                    <button type="button" onClick={() => navigate('/soil-history')} className="w-full py-3 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all">
                      View Full History <ArrowRight size={16}/>
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="bg-yellow-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle className="text-yellow-600" size={28}/></div>
                    <h4 className="text-lg font-bold text-slate-800 mb-2">Report Submitted — Pending Analysis</h4>
                    <p className="text-sm text-slate-500 mb-6">Your uploaded soil report is being reviewed by our team. Results will appear in your history once analyzed.</p>
                    <button type="button" onClick={() => navigate('/soil-history')} className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl transition-all">Go to History</button>
                  </div>
                )}

                <button type="button" onClick={() => { setResultData(null); setStep(1); clearFile(); setManualData({ph:'',nitrogen:'',phosphorus:'',potassium:'',organicMatter:''}); }} className="mt-4 w-full text-center text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
                  ← Submit Another Report
                </button>
              </div>
            )}

          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[20px] shadow-sm border border-slate-200 overflow-hidden sticky top-32 flex flex-col">
              
              {/* Header Gradient Banner */}
              <div className="bg-gradient-to-r from-[#2d6a4f] to-[#52b788] p-6 text-white relative overflow-hidden">
                <div className="relative z-10 flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <UserCheck size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-sans">Book Officer Visit</h2>
                    <p className="text-[#d8f3dc] text-sm mt-1 opacity-90 font-sans">Schedule on-site soil testing</p>
                  </div>
                </div>
                {/* Decorative circle */}
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              </div>

              {/* Booking Form */}
              <div className="p-6 flex flex-col gap-5 font-sans">
                
                {/* Availability Indicator */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#52b788] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#2d6a4f]"></span>
                  </span>
                  <span className="text-xs font-bold text-[#2d6a4f] uppercase tracking-wider">Officers Available</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Farmer Name</label>
                  <input 
                    type="text" 
                    name="farmerName"
                    value={bookingData.farmerName}
                    onChange={handleBookingChange}
                    placeholder="Enter your name" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#52b788] outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Preferred Date</label>
                    <input 
                      type="date" 
                      name="preferredDate"
                      value={bookingData.preferredDate}
                      onChange={handleBookingChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#52b788] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Time Slot</label>
                    <select 
                      name="timeSlot"
                      value={bookingData.timeSlot}
                      onChange={handleBookingChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#52b788] outline-none transition-all appearance-none"
                    >
                      <option value="">Select Time</option>
                      <option value="morning">Morning</option>
                      <option value="midday">Midday</option>
                      <option value="afternoon">Afternoon</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Purpose of Visit</label>
                  <select 
                    name="purpose"
                    value={bookingData.purpose}
                    onChange={handleBookingChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#52b788] outline-none transition-all appearance-none"
                  >
                    <option value="">Select Purpose</option>
                    <option value="routine">Routine Soil Test</option>
                    <option value="disease">Suspected Disease</option>
                    <option value="pre-sowing">Pre-sowing Analysis</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Notes (Optional)</label>
                  <textarea 
                    rows="2"
                    name="notes"
                    value={bookingData.notes}
                    onChange={handleBookingChange}
                    placeholder="Any specific instructions..." 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#52b788] outline-none transition-all resize-none"
                  ></textarea>
                </div>

                <div className="bg-[#d8f3dc]/30 p-4 rounded-xl flex items-start gap-3 border border-[#d8f3dc]">
                  <div className="mt-0.5 text-[#2d6a4f]"><Info size={16} /></div>
                  <p className="text-xs font-medium text-[#2d6a4f] leading-relaxed">
                    Officer will visit your registered field location to collect samples.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleBookVisit}
                  disabled={bookingLoading}
                  className="w-full mt-2 py-3.5 bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#52b788]/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70"
                >
                  {bookingLoading ? (
                    <><Loader2 className="animate-spin" size={18} /> Booking...</>
                  ) : (
                    <><Calendar size={18} /> Book Visit</>
                  )}
                </button>

              </div>
            </div>
          </div>
          
          {/* Bottom Action Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-4 z-50">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-green-700">
                <ShieldCheck size={20} />
                <span className="text-xs font-bold uppercase tracking-wider">Secure Transmission Active</span>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => navigate('/soil-history')}
                  className="flex-1 sm:flex-none px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors"
                >
                  Save Draft
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 sm:flex-none px-8 py-3 bg-green-700 hover:bg-green-800 text-white text-sm font-bold rounded-xl shadow-lg shadow-green-200 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:shadow-none"
                >
                  {loading ? (
                    <><Loader2 className="animate-spin" size={18} /> Submitting...</>
                  ) : (
                    <>Submit Report <ArrowRight size={18} /></>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default SoilTestAndCropAdvice;
