import React, { useState, useEffect, useContext, useRef } from 'react';
import Navbar from '../../components/Navbar';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Download, FileText, Upload, Clock, CheckCircle, Beaker, TrendingUp, Calendar, AlertCircle, Info, ChevronRight, Sprout } from 'lucide-react';

const SoilTestAndCropAdvice = () => {
  const { backendUrl, userData, navigate } = useContext(AppContext);
  
  const [history, setHistory] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const [inputs, setInputs] = useState({
    ph: '',
    n: '',
    p: '',
    k: '',
    om: ''
  });

  const [uploadFile, setUploadFile] = useState(null);

  const fetchHistory = async () => {
    if (!userData) return;
    setFetchLoading(true);
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(`${backendUrl}/api/soil/history`);
      if (data.success) {
        setHistory(data.data);
        if (data.data.length > 0 && !selectedTest) {
           setSelectedTest(data.data[0]);
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchHistory();
    }
  }, [userData]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setUploadFile(e.target.files[0]);
  };

  const submitData = async (e) => {
    e.preventDefault();
    if (!userData) {
      toast.error('Please login to analyze soil');
      navigate('/login');
      return;
    }

    if (!uploadFile && (!inputs.ph || !inputs.n || !inputs.p || !inputs.k || !inputs.om)) {
      toast.error('Please upload a report OR fill all manual data fields.');
      return;
    }

    setLoading(true);
    try {
      axios.defaults.withCredentials = true;
      const formData = new FormData();
      if (uploadFile) formData.append('reportFile', uploadFile);
      if (inputs.ph) {
          formData.append('ph', inputs.ph);
          formData.append('nitrogen', inputs.n);
          formData.append('phosphorus', inputs.p);
          formData.append('potassium', inputs.k);
          formData.append('organicMatter', inputs.om);
      }

      const { data } = await axios.post(`${backendUrl}/api/soil/upload`, formData);

      if (data.success) {
        toast.success('Soil data submitted successfully!');
        setInputs({ ph: '', n: '', p: '', k: '', om: '' });
        setUploadFile(null);
        fetchHistory();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (id) => {
    setDownloading(true);
    try {
        axios.defaults.withCredentials = true;
        const response = await axios.get(`${backendUrl}/api/soil/download/${id}`, {
            responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Soil_Health_Card_${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        toast.error("Failed to download PDF");
    } finally {
        setDownloading(false);
    }
  };

  const nutriBars = (test) => {
    if (!test || test.status === "Pending") return [];
    const targets = { n: 50, p: 30, k: 200, om: 3 };
    const getPct = (val, target) => Math.min(100, (val / target) * 100);
    const getLevel = (pct) => pct < 60 ? 'Low' : (pct < 90 ? 'Medium' : 'High');
    
    return [
        { label: 'Nitrogen (N)', val: test.nitrogen, pct: getPct(test.nitrogen, targets.n), level: getLevel(getPct(test.nitrogen, targets.n)) },
        { label: 'Phosphorus (P)', val: test.phosphorus, pct: getPct(test.phosphorus, targets.p), level: getLevel(getPct(test.phosphorus, targets.p)) },
        { label: 'Potassium (K)', val: test.potassium, pct: getPct(test.potassium, targets.k), level: getLevel(getPct(test.potassium, targets.k)) },
        { label: 'Organic Matter (OM)', val: test.organic_matter, pct: getPct(test.organic_matter, targets.om), level: getLevel(getPct(test.organic_matter, targets.om)) },
    ];
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-[1440px] px-4 sm:px-8 pt-24 pb-12">
        
        {/* Page Header */}
        <section className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="animate-in slide-in-from-left duration-700">
                <div className="flex items-center gap-3 mb-2">
                    <span className="bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Farmer Dashboard</span>
                    <span className="h-1 shadow-sm w-8 bg-slate-200 rounded-full"></span>
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Soil Intelligence Management</h1>
                <p className="mt-2 text-slate-500 font-medium">Science-backed soil analysis for maximum crop yield.</p>
            </div>
            <div className="flex gap-3 animate-in slide-in-from-right duration-700">
                <button onClick={() => navigate('/soil-test-upload')} className="bg-white border-2 border-slate-200 text-slate-700 px-6 py-3 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
                    <Upload size={18} /> Upload Report
                </button>
                <button onClick={() => navigate('/soil-history')} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all flex items-center gap-2">
                    <TrendingUp size={18} /> View Trends
                </button>
            </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: INPUT FORM & HISTORY */}
          <div className="xl:col-span-4 space-y-8 animate-in fade-in duration-1000">
              
              {/* Submission Form Card */}
              <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 p-8 sm:p-10 relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                      <Beaker className="text-green-600" size={24} />
                      Analyze New Sample
                  </h2>

                  <form onSubmit={submitData} className="space-y-6">
                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Soil pH Level</label>
                          <input name="ph" type="number" step="0.1" value={inputs.ph} onChange={onChange} placeholder="e.g. 6.8" className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-green-500 transition-all"/>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nitrogen (ppm)</label>
                              <input name="n" type="number" value={inputs.n} onChange={onChange} placeholder="N" className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-green-500 transition-all"/>
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phosphorous (ppm)</label>
                              <input name="p" type="number" value={inputs.p} onChange={onChange} placeholder="P" className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-green-500 transition-all"/>
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Potassium (ppm)</label>
                              <input name="k" type="number" value={inputs.k} onChange={onChange} placeholder="K" className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-green-500 transition-all"/>
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Org. Matter (%)</label>
                              <input name="om" type="number" step="0.1" value={inputs.om} onChange={onChange} placeholder="OM" className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-green-500 transition-all"/>
                          </div>
                      </div>

                      <button disabled={loading} type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-5 rounded-[24px] shadow-xl shadow-green-100 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50">
                          {loading ? 'Processing Analysis...' : 'Generate Soil Health Card'}
                      </button>
                  </form>
              </div>

              {/* History List */}
              <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 p-8 flex flex-col max-h-[500px]">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center justify-between">
                      Activity Logs
                      <Calendar size={14} />
                  </h3>
                  
                  <div className="overflow-y-auto pr-2 space-y-4 no-scrollbar">
                      {fetchLoading ? (
                          <div className="text-center py-10"><Clock className="mx-auto text-slate-200 animate-spin mb-2" size={32} /></div>
                      ) : history.length === 0 ? (
                          <div className="text-center py-10 opacity-40 font-bold text-sm">No records found.</div>
                      ) : history.map(test => (
                          <button key={test.id} onClick={() => setSelectedTest(test)} className={`w-full text-left p-5 rounded-3xl border-2 transition-all ${selectedTest?.id === test.id ? 'border-green-600 bg-green-50/30' : 'border-slate-50 hover:border-slate-200'}`}>
                              <div className="flex justify-between items-start">
                                  <div>
                                      <p className="font-black text-slate-900 text-sm">{new Date(test.created_at).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}</p>
                                      <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">Ref: {test.id.slice(-8)}</p>
                                  </div>
                                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${test.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                      {test.status}
                                  </span>
                              </div>
                          </button>
                      ))}
                  </div>
              </div>
          </div>

          {/* RIGHT COLUMN: VISUALIZATIONS & INSIGHTS */}
          <div className="xl:col-span-8 animate-in fade-in duration-1000 delay-300">
              {!selectedTest ? (
                  <div className="h-full min-h-[600px] bg-white rounded-[48px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-center">
                       <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                           <Info className="text-slate-200" size={48} />
                       </div>
                       <h3 className="text-2xl font-black text-slate-900">Intelligence Ready</h3>
                       <p className="max-w-md text-slate-500 font-medium mt-2">Select a past soil sample or enters values to get instant scientific analysis and fertilizer recommendations.</p>
                  </div>
              ) : (
                  <div className="space-y-8">
                      {/* Main Insight Hero */}
                      <div className="bg-white rounded-[48px] shadow-sm border border-slate-100 p-8 sm:p-12">
                          
                          <div className="flex flex-col lg:flex-row gap-12">
                              {/* PH Gauge & Score */}
                              <div className="lg:w-1/3 flex flex-col items-center">
                                  <div className="relative w-48 h-48 mb-8">
                                      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                                          <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                                          <circle cx="50" cy="50" r="45" fill="none" stroke="#16a34a" strokeWidth="8" strokeDasharray={`${(selectedTest.ph / 14) * 283} 283`} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                                      </svg>
                                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                                          <span className="text-5xl font-black text-slate-900">{selectedTest.ph?.toFixed(1)}</span>
                                          <span className="text-[10px] font-black text-green-600 uppercase tracking-widest mt-1">pH Level</span>
                                      </div>
                                  </div>
                                  <div className="text-center">
                                      <h4 className={`text-xl font-black ${selectedTest.soil_status === 'Acidic' ? 'text-rose-600' : (selectedTest.soil_status === 'Alkaline' ? 'text-amber-600' : 'text-green-600')}`}>
                                          {selectedTest.soil_status} Soil
                                      </h4>
                                      <p className="text-sm font-medium text-slate-500 mt-2 px-4 italic">"Ideal for most Kharif and Rabi crops."</p>
                                  </div>
                              </div>

                              {/* Nutrient Progress Bars */}
                              <div className="flex-1 space-y-6">
                                  <div className="flex items-center justify-between mb-4">
                                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Nutritional Profile</h4>
                                      <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md border">IDEAL: 90%+</span>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                                      {nutriBars(selectedTest).map((bar, idx) => (
                                          <div key={idx} className="space-y-3">
                                              <div className="flex justify-between items-end">
                                                  <span className="text-sm font-black text-slate-800">{bar.label}</span>
                                                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${bar.level === 'Low' ? 'bg-rose-100 text-rose-600' : 'bg-green-100 text-green-600'}`}>
                                                      {bar.level}
                                                  </span>
                                              </div>
                                              <div className="h-4 bg-slate-50 rounded-full p-1 border border-slate-100">
                                                  <div className={`h-full rounded-full transition-all duration-1000 ${bar.level === 'Low' ? 'bg-rose-500' : 'bg-green-600'}`} style={{ width: `${bar.pct}%` }}></div>
                                              </div>
                                          </div>
                                      ))}
                                  </div>

                                  <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between">
                                      <div className="flex items-center gap-4">
                                          <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-100">
                                              <TrendingUp size={28} />
                                          </div>
                                          <div>
                                              <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Suitability Index</p>
                                              <p className="text-2xl font-black text-slate-900">{selectedTest.suitability_pct || 92}%</p>
                                          </div>
                                      </div>
                                      <button 
                                          onClick={() => handleDownloadPDF(selectedTest.id)}
                                          disabled={downloading}
                                          className="bg-slate-50 text-slate-700 hover:bg-slate-100 px-6 py-4 rounded-3xl font-black text-sm transition-all flex items-center gap-3 border border-slate-200"
                                      >
                                          {downloading ? <Clock className="animate-spin" size={18} /> : <Download size={18} />}
                                          Download Full Advisory
                                      </button>
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* Summary Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Fertilizer Card */}
                          <div className="bg-[#0f172a] rounded-[40px] p-10 text-white relative overflow-hidden group">
                               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform"><Beaker size={120} /></div>
                               <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Treatment Protocol</h4>
                               <div className="space-y-4">
                                   <div className="flex items-start gap-4">
                                       <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                                           <AlertCircle className="text-green-400" size={16} />
                                       </div>
                                       <p className="text-lg font-bold leading-snug">{selectedTest.recommended_fertilizer || 'NPK levels are balanced. Maintain organic inputs.'}</p>
                                   </div>
                               </div>
                               <div className="mt-8 pt-6 border-t border-slate-800">
                                   <button className="text-green-400 text-xs font-black flex items-center gap-2 group-hover:gap-3 transition-all">
                                       ORDER REQUIRED FERTILIZERS <ChevronRight size={14} />
                                   </button>
                               </div>
                          </div>

                          {/* Crops Card */}
                          <div className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden">
                               <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Optimal Crop Rotation</h4>
                               <div className="flex flex-wrap gap-3 mb-auto">
                                   {selectedTest.suitable_crops?.map(crop => (
                                       <span key={crop} className="bg-slate-50 text-slate-800 font-black text-sm px-6 py-3 rounded-2xl border border-slate-100 hover:bg-green-600 hover:text-white transition-all cursor-default">
                                           {crop}
                                       </span>
                                   ))}
                               </div>
                               <div className="mt-8 flex items-center gap-3 text-slate-400">
                                   <Sprout size={16} />
                                   <p className="text-[10px] font-bold uppercase tracking-widest">Recommended for current pH and Nitrogen levels</p>
                               </div>
                          </div>
                      </div>

                      {/* Next Test Roadmap */}
                      <div className="bg-green-600 rounded-[32px] p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl shadow-green-100">
                          <div className="flex items-center gap-5">
                              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                                  <Clock size={28} />
                              </div>
                              <div>
                                  <p className="text-xs font-black text-green-100 uppercase tracking-widest">Next Health Checkpoint</p>
                                  <p className="text-xl font-black">{new Date(selectedTest.next_test_date).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })}</p>
                              </div>
                          </div>
                          <button className="bg-white text-green-700 px-8 py-4 rounded-2xl font-black text-sm hover:bg-green-50 transition-all">
                              Set Calendar Alert
                          </button>
                      </div>
                  </div>
              )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SoilTestAndCropAdvice;
