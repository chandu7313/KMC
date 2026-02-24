import React, { useState, useContext } from 'react';
import Navbar from '../../components/Navbar';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Upload, X, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';

const SoilTestUpload = () => {
  const { backendUrl, userData, navigate } = useContext(AppContext);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate File Type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error('Only PDF and Image files (JPG, PNG) are allowed.');
      return;
    }

    // Validate File Size (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB.');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData) {
      toast.error('Please login to upload soil tests.');
      navigate('/login');
      return;
    }

    if (!file) {
      toast.error('Please select a file to upload.');
      return;
    }

    setLoading(true);
    try {
      axios.defaults.withCredentials = true;
      const formData = new FormData();
      formData.append('reportFile', file);

      const { data } = await axios.post(`${backendUrl}/api/soil/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data.success) {
        toast.success('Soil report uploaded successfully! Admin will analyze it soon.');
        clearFile();
        navigate('/soil-crop-analysis'); // Redirect to history
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error uploading file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto w-[95%] max-w-3xl px-4 pt-32 pb-12">
        <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 p-8 sm:p-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-slate-900">Upload Soil Report</h1>
            <p className="text-slate-500 mt-2 font-medium">Please upload your laboratory soil test report (PDF or Image).</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="relative group">
              {!file ? (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-200 rounded-[32px] bg-slate-50 hover:bg-slate-100 hover:border-green-500 transition-all cursor-pointer">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="p-4 bg-green-100 rounded-2xl mb-4 text-green-600 group-hover:scale-110 transition-transform">
                      <Upload size={32} />
                    </div>
                    <p className="mb-2 text-sm text-slate-700 font-bold">
                      Click to upload <span className="font-medium text-slate-500">or drag and drop</span>
                    </p>
                    <p className="text-xs text-slate-500">PDF, PNG or JPG (MAX. 5MB)</p>
                  </div>
                  <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,image/*" />
                </label>
              ) : (
                <div className="relative w-full h-64 rounded-[32px] overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center p-4">
                  <button
                    type="button"
                    onClick={clearFile}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-600 hover:text-red-500 shadow-sm transition-colors"
                  >
                    <X size={20} />
                  </button>
                  
                  {preview === 'pdf' ? (
                    <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
                      <div className="p-6 bg-red-50 rounded-3xl text-red-500">
                         <FileText size={64} />
                      </div>
                      <div className="text-center">
                          <p className="font-bold text-slate-800 text-sm">{file.name}</p>
                          <p className="text-xs text-slate-500 mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB • PDF Document</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center animate-in fade-in zoom-in duration-300">
                        <img src={preview} alt="Upload preview" className="max-w-full max-h-full object-contain rounded-xl shadow-lg" />
                        <div className="absolute bottom-4 left-4 right-4 bg-white/60 backdrop-blur-sm p-3 rounded-2xl border border-white/40 flex items-center gap-3">
                            <ImageIcon size={20} className="text-slate-600" />
                            <div className="truncate">
                                <p className="text-xs font-bold text-slate-800 truncate">{file.name}</p>
                                <p className="text-[10px] text-slate-600 font-medium uppercase tracking-wider">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                            </div>
                        </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <button
                disabled={!file || loading}
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-green-200 transition-all disabled:opacity-50 disabled:shadow-none active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Uploading Report...
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    Submit for Analysis
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/soil-crop-analysis')}
                className="text-slate-500 font-bold text-sm hover:text-slate-800 transition-colors"
              >
                Cancel and Go Back
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SoilTestUpload;
