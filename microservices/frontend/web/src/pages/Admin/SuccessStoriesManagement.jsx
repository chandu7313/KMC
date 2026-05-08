import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, Search, Upload, User, MapPin, Sprout, TrendingUp } from 'lucide-react';

const SuccessStoriesManagement = () => {
    const { backendUrl } = useContext(AppContext);
    const [stories, setStories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(false);
    
    const [formData, setFormData] = useState({
        farmerName: '',
        district: '',
        crop: '',
        beforeYield: '',
        afterYield: '',
        description: '',
        status: 'draft'
    });

    const fetchStories = async () => {
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.get(backendUrl + '/api/success/list');
            if (data.success) {
                setStories(data.stories);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchStories();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const fd = new FormData();
            Object.keys(formData).forEach(key => fd.append(key, formData[key]));
            if (image) fd.append('image', image);

            axios.defaults.withCredentials = true;
            let res;
            if (editMode) {
                res = await axios.put(`${backendUrl}/api/success/update/${selectedId}`, fd);
            } else {
                res = await axios.post(`${backendUrl}/api/success/add`, fd);
            }

            if (res.data.success) {
                toast.success(res.data.message);
                setShowModal(false);
                fetchStories();
                resetForm();
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this story?")) return;
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.delete(`${backendUrl}/api/success/delete/${id}`);
            if (data.success) {
                toast.success(data.message);
                fetchStories();
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const resetForm = () => {
        setFormData({ farmerName: '', district: '', crop: '', beforeYield: '', afterYield: '', description: '', status: 'draft' });
        setImage(false);
        setEditMode(false);
        setSelectedId(null);
    };

    const openEdit = (story) => {
        setEditMode(true);
        setSelectedId(story.id);
        setFormData({
            farmerName: story.farmer_name,
            district: story.district,
            crop: story.crop,
            beforeYield: story.before_yield,
            afterYield: story.after_yield,
            description: story.description,
            status: story.status
        });
        setShowModal(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Success Stories</h1>
                    <p className="text-slate-500 text-sm italic">Showcase farmer transformations and yield improvements</p>
                </div>
                <button 
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-200 transition-all active:scale-95"
                >
                    <Plus size={18} /> Add New Story
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.map(story => (
                    <div key={story.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
                        <div className="relative h-48 bg-slate-100">
                            {story.image ? (
                                <img src={story.image} alt={story.farmer_name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">No Image</div>
                            )}
                            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${story.status === 'published' ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'}`}>
                                {story.status}
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg">{story.farmer_name}</h3>
                                    <p className="text-slate-500 text-xs flex items-center gap-1"><MapPin size={12}/>{story.district}</p>
                                </div>
                                <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold border border-emerald-100">
                                    {story.crop}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-50">
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Before</p>
                                    <p className="font-bold text-slate-700">{story.before_yield} Q/acre</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase text-right">After</p>
                                    <p className="font-bold text-emerald-600 text-right">+{story.after_yield} Q/acre</p>
                                </div>
                            </div>

                            <p className="text-slate-600 text-xs line-clamp-3 leading-relaxed h-12">
                                {story.description}
                            </p>

                            <div className="flex gap-2 pt-2">
                                <button onClick={() => openEdit(story)} className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold transition-colors">
                                    <Edit2 size={14} /> Edit
                                </button>
                                <button onClick={() => handleDelete(story.id)} className="w-10 flex items-center justify-center bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-xl transition-colors">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-300">
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-xl font-bold text-slate-900">{editMode ? 'Edit Success Story' : 'Add Success Story'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white rounded-full transition-colors"><XCircle className="text-slate-400" /></button>
                        </div>
                        
                        <form onSubmit={handleSave} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Farmer Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-3 text-slate-400" size={16} />
                                        <input required className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-900" 
                                            value={formData.farmer_name} onChange={e => setFormData({...formData, farmerName: e.target.value})} placeholder="e.g. Ramesh Patel" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">District</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-3 text-slate-400" size={16} />
                                        <input required className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-900" 
                                            value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} placeholder="e.g. Nashik" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Crop Type</label>
                                    <div className="relative">
                                        <Sprout className="absolute left-4 top-3 text-slate-400" size={16} />
                                        <input required className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-900" 
                                            value={formData.crop} onChange={e => setFormData({...formData, crop: e.target.value})} placeholder="e.g. Grapes" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Old Yield (Q/ac)</label>
                                    <div className="relative">
                                        <TrendingUp className="absolute left-4 top-3 text-slate-400" size={16} />
                                        <input required type="number" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-900" 
                                            value={formData.before_yield} onChange={e => setFormData({...formData, beforeYield: e.target.value})} placeholder="Old" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">New Yield (Q/ac)</label>
                                    <div className="relative">
                                        <TrendingUp className="absolute left-4 top-3 text-emerald-500" size={16} />
                                        <input required type="number" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-900" 
                                            value={formData.after_yield} onChange={e => setFormData({...formData, afterYield: e.target.value})} placeholder="New" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Farmer's Journey / Description</label>
                                <textarea required rows="4" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-900" 
                                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe the challenges and results..." />
                            </div>

                            <div className="grid grid-cols-2 gap-6 items-end">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Farmer/Result Image</label>
                                    <div className="flex items-center gap-4">
                                        <label className="flex-1 cursor-pointer group">
                                            <div className="flex items-center gap-3 bg-slate-50 border-2 border-dashed border-slate-200 group-hover:border-emerald-500 group-hover:bg-emerald-50/50 rounded-2xl p-3 transition-all">
                                                <Upload size={18} className="text-slate-400 group-hover:text-emerald-500" />
                                                <span className="text-xs font-bold text-slate-500 group-hover:text-emerald-700 truncate">{image ? image.name : 'Choose Image'}</span>
                                            </div>
                                            <input type="file" hidden onChange={e => setImage(e.target.files[0])} accept="image/*" />
                                        </label>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Status</label>
                                    <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-slate-700"
                                        value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                                        <option value="draft">Draft (Private)</option>
                                        <option value="published">Published (Public)</option>
                                    </select>
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-4 rounded-2xl shadow-xl shadow-emerald-200 active:scale-95 transition-all flex items-center justify-center gap-2">
                                {loading ? 'Saving...' : (editMode ? 'Update Story' : 'Publish Story')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuccessStoriesManagement;
