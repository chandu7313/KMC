import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { Users, Beaker, CheckCircle, Search, User, Loader2 } from 'lucide-react';

const AdminSoilEntry = () => {
    const { backendUrl } = useContext(AppContext);
    const [farmers, setFarmers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFarmer, setSelectedFarmer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    const [inputs, setInputs] = useState({
        ph: '',
        n: '',
        p: '',
        k: '',
        om: ''
    });

    const fetchFarmers = async () => {
        if (searchTerm.length < 2) return;
        setFetching(true);
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.get(`${backendUrl}/api/admin/farmers?search=${searchTerm}`);
            if (data.success) {
                setFarmers(data.farmers);
            }
        } catch (error) {
            console.error("Error fetching farmers", error);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchFarmers();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFarmer) {
            toast.error('Please select a farmer first.');
            return;
        }

        if (!inputs.ph || !inputs.n || !inputs.p || !inputs.k || !inputs.om) {
            toast.error('All soil parameters are required.');
            return;
        }

        setLoading(true);
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.post(`${backendUrl}/api/soil/admin/create`, {
                farmerId: selectedFarmer._id,
                ph: inputs.ph,
                nitrogen: inputs.n,
                phosphorus: inputs.p,
                potassium: inputs.k,
                organicMatter: inputs.om
            });

            if (data.success) {
                toast.success('Soil report created and analyzed successfully!');
                setInputs({ ph: '', n: '', p: '', k: '', om: '' });
                setSelectedFarmer(null);
                setSearchTerm('');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-800">Manual Soil Entry</h2>
                    <p className="text-slate-500 font-medium">Create a new soil report for a farmer by entering lab results manually.</p>
                </div>
                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-2xl border border-green-100">
                   <Beaker className="text-green-600" size={20} />
                   <span className="text-green-700 font-bold text-sm">Automated Analysis Enabled</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Farmer Selection */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                             <User size={16} className="text-slate-400" />
                             Select Farmer
                        </h3>
                        
                        <div className="relative mb-4">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text"
                                placeholder="Search by name or email..."
                                className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-green-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {fetching && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 animate-spin" size={18} />}
                        </div>

                        <div className="space-y-2 max-h-[400px] overflow-y-auto no-scrollbar">
                            {farmers.length === 0 && searchTerm.length >= 2 && !fetching && (
                                <p className="text-center py-8 text-slate-400 text-xs font-medium">No farmers found matching "{searchTerm}"</p>
                            )}
                            {farmers.map(farmer => (
                                <button
                                    key={farmer._id}
                                    onClick={() => setSelectedFarmer(farmer)}
                                    className={`w-full text-left p-4 rounded-2xl transition-all border ${selectedFarmer?._id === farmer._id ? 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-200' : 'bg-white border-slate-50 hover:bg-slate-50'}`}
                                >
                                    <p className="font-bold text-sm truncate">{farmer.name}</p>
                                    <p className={`text-[10px] mt-0.5 font-medium ${selectedFarmer?._id === farmer._id ? 'text-green-100' : 'text-slate-500'}`}>{farmer.email}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {selectedFarmer && (
                        <div className="bg-slate-900 rounded-[32px] p-6 text-white animate-in slide-in-from-bottom-4 duration-300">
                             <div className="flex items-center gap-3 mb-4">
                                 <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center font-black text-slate-900">
                                     {selectedFarmer.name[0]}
                                 </div>
                                 <div>
                                     <p className="font-bold text-sm">Selected Target</p>
                                     <p className="text-xs text-slate-400">{selectedFarmer.name}</p>
                                 </div>
                             </div>
                             <div className="pt-4 border-t border-slate-800 space-y-2">
                                 <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                     <span>District</span>
                                     <span className="text-slate-300">{selectedFarmer.district}</span>
                                 </div>
                                 <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                     <span>Verification</span>
                                     <span className="text-green-400">Verified</span>
                                 </div>
                             </div>
                        </div>
                    )}
                </div>

                {/* Entry Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 sm:p-10">
                        <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-3">
                             <Beaker size={24} className="text-green-600" />
                             Soil Parameter Input
                        </h3>
                        
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Soil pH Level</label>
                                    <input 
                                        type="number" step="0.1" name="ph" value={inputs.ph} onChange={handleInputChange}
                                        placeholder="e.g. 6.5"
                                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-green-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Nitrogen (N) - ppm</label>
                                    <input 
                                        type="number" name="n" value={inputs.n} onChange={handleInputChange}
                                        placeholder="e.g. 45"
                                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-green-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Phosphorus (P) - ppm</label>
                                    <input 
                                        type="number" name="p" value={inputs.p} onChange={handleInputChange}
                                        placeholder="e.g. 30"
                                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-green-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Potassium (K) - ppm</label>
                                    <input 
                                        type="number" name="k" value={inputs.k} onChange={handleInputChange}
                                        placeholder="e.g. 190"
                                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-green-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Organic Matter (%)</label>
                                    <input 
                                        type="number" step="0.1" name="om" value={inputs.om} onChange={handleInputChange}
                                        placeholder="e.g. 2.4"
                                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-green-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-4">
                                <button
                                    disabled={loading || !selectedFarmer}
                                    type="submit"
                                    className="w-full sm:w-auto flex-1 bg-slate-900 hover:bg-slate-800 text-white font-black py-5 rounded-[24px] shadow-xl shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            Processing Analysis...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle size={20} className="text-green-400" />
                                            Submit and Analyze
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setSelectedFarmer(null); setInputs({ph:'',n:'',p:'',k:'',om:''}); setSearchTerm(''); }}
                                    className="w-full sm:w-auto px-10 py-5 bg-slate-100 text-slate-600 font-bold rounded-[24px] hover:bg-slate-200 transition-colors"
                                >
                                    Reset
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSoilEntry;
