import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { CheckCircle, Clock, FileText, Settings, X } from 'lucide-react';

const SoilTestManagement = () => {
  const { backendUrl } = useContext(AppContext);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Modal state
  const [selectedTest, setSelectedTest] = useState(null);
  const [inputs, setInputs] = useState({ ph: '', n: '', p: '', k: '', om: '' });

  const fetchTests = async () => {
    setLoading(true);
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(`${backendUrl}/api/soil-tests`);
      if (data.success) {
        setTests(data.data);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, [backendUrl]);

  const openModal = (test) => {
    setSelectedTest(test);
    setInputs({
      ph: test.ph || '',
      n: test.nitrogen || '',
      p: test.phosphorus || '',
      k: test.potassium || '',
      om: test.organic_matter || ''
    });
  };

  const closeModal = () => {
    setSelectedTest(null);
    setInputs({ ph: '', n: '', p: '', k: '', om: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const submitAnalysis = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.put(`${backendUrl}/api/soil-tests/${selectedTest.id}/analyze`, {
        ph: inputs.ph,
        nitrogen: inputs.n,
        phosphorus: inputs.p,
        potassium: inputs.k,
        organicMatter: inputs.om
      });

      if (data.success) {
        toast.success(data.message);
        closeModal();
        fetchTests();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
       toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Soil Tests Management</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading tests...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-500 uppercase">
                  <th className="p-4 font-semibold">Farmer</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Report</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {tests.map((test) => (
                  <tr key={test.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-slate-800">{test.farmerId?.name}</div>
                      <div className="text-slate-500 text-xs">{test.farmerId?.email}</div>
                    </td>
                    <td className="p-4 text-slate-600">
                      {new Date(test.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${test.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {test.status === 'Completed' ? <CheckCircle size={14}/> : <Clock size={14}/>}
                        {test.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {test.reportFile ? (
                         <a href={test.reportFile} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 font-medium text-xs">
                             <FileText size={14}/> View PDF/Image
                         </a>
                      ) : (
                         <span className="text-slate-400 text-xs">No file</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                       <button onClick={() => openModal(test)} className="inline-flex items-center gap-1.5 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors">
                          <Settings size={14} /> Handle
                       </button>
                    </td>
                  </tr>
                ))}
                {tests.length === 0 && (
                   <tr><td colSpan="5" className="p-8 text-center text-slate-500">No soil tests found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Analysis Entry Modal */}
      {selectedTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-800 text-lg">Process Soil Test - {selectedTest.farmerId?.name}</h3>
                <button onClick={closeModal} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
             </div>
             
             <form onSubmit={submitAnalysis} className="p-6 space-y-4">
                
                {selectedTest.reportFile && (
                  <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-100 text-sm">
                      <p className="font-bold text-amber-800 mb-1">Uploaded Lab Report Available</p>
                      <p className="text-amber-700 mb-3 text-xs">Please extract N, P, K, pH and OM from the provided document.</p>
                      <a href={selectedTest.reportFile} target="_blank" rel="noreferrer" className="inline-block bg-white text-amber-700 font-bold px-3 py-1.5 rounded shadow-sm border border-amber-200">Open Report in New Tab</a>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm font-medium">
                   <div className="col-span-2">
                       <label className="block text-slate-600 mb-1">pH Level</label>
                       <input required name="ph" type="number" step="0.1" value={inputs.ph} onChange={handleInputChange} className="w-full bg-slate-50 border rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
                   </div>
                   <div>
                       <label className="block text-slate-600 mb-1">Nitrogen (N) ppm</label>
                       <input required name="n" type="number" step="0.1" value={inputs.n} onChange={handleInputChange} className="w-full bg-slate-50 border rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
                   </div>
                   <div>
                       <label className="block text-slate-600 mb-1">Phosphorus (P) ppm</label>
                       <input required name="p" type="number" step="0.1" value={inputs.p} onChange={handleInputChange} className="w-full bg-slate-50 border rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
                   </div>
                   <div>
                       <label className="block text-slate-600 mb-1">Potassium (K) ppm</label>
                       <input required name="k" type="number" step="0.1" value={inputs.k} onChange={handleInputChange} className="w-full bg-slate-50 border rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
                   </div>
                   <div>
                       <label className="block text-slate-600 mb-1">Org Matter (OM) %</label>
                       <input required name="om" type="number" step="0.1" value={inputs.om} onChange={handleInputChange} className="w-full bg-slate-50 border rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
                   </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                   <button type="button" onClick={closeModal} className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                   <button type="submit" className="px-5 py-2 font-bold bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-lg shadow-green-200">Save & Generate Intel</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoilTestManagement;
