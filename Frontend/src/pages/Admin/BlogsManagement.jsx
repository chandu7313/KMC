import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2, Search, Upload, FileText, Tag, Eye, ChevronRight, XCircle } from 'lucide-react';

const BlogsManagement = () => {
    const { backendUrl } = useContext(AppContext);
    const [blogs, setBlogs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        author: '',
        status: 'draft',
        tags: ''
    });

    const fetchBlogs = async () => {
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.get(backendUrl + '/api/blog/list');
            if (data.success) {
                setBlogs(data.blogs);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const fd = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'tags') {
                    const tagArray = formData.tags.split(',').map(t => t.trim()).filter(t => t);
                    fd.append('tags', JSON.stringify(tagArray));
                } else {
                    fd.append(key, formData[key]);
                }
            });
            if (image) fd.append('image', image);

            axios.defaults.withCredentials = true;
            let res;
            if (editMode) {
                res = await axios.put(`${backendUrl}/api/blog/update/${selectedId}`, fd);
            } else {
                res = await axios.post(`${backendUrl}/api/blog/add`, fd);
            }

            if (res.data.success) {
                toast.success(res.data.message);
                setShowModal(false);
                fetchBlogs();
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
        if (!window.confirm("Delete this article?")) return;
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.delete(`${backendUrl}/api/blog/delete/${id}`);
            if (data.success) {
                toast.success(data.message);
                fetchBlogs();
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const resetForm = () => {
        setFormData({ title: '', excerpt: '', content: '', author: '', status: 'draft', tags: '' });
        setImage(false);
        setEditMode(false);
        setSelectedId(null);
    };

    const openEdit = (blog) => {
        setEditMode(true);
        setSelectedId(blog._id);
        setFormData({
            title: blog.title,
            excerpt: blog.excerpt || '',
            content: blog.content || '',
            author: blog.author || '',
            status: blog.status,
            tags: blog.tags ? blog.tags.join(', ') : ''
        });
        setShowModal(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Blog Articles</h1>
                    <p className="text-slate-500 text-sm italic">Share knowledge and updates with the farming community</p>
                </div>
                <button 
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-200 transition-all active:scale-95"
                >
                    <Plus size={18} /> New Article
                </button>
            </div>

            <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Article</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Author</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stats</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {blogs.map(blog => (
                            <tr key={blog._id} className="hover:bg-slate-50/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                                            {blog.featuredImage ? (
                                                <img src={blog.featuredImage} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold text-xl">B</div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors uppercase text-xs tracking-tight">{blog.title}</div>
                                            <div className="text-[10px] text-slate-400 font-medium">/{blog.slug}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest ${blog.status === 'published' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                                        {blog.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-xs font-bold text-slate-600">{blog.author || 'Admin'}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5 text-slate-400">
                                        <Eye size={12} />
                                        <span className="text-xs font-bold">{blog.views || 0}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => openEdit(blog)} className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-lg transition-all">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(blog._id)} className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {blogs.length === 0 && (
                    <div className="p-20 text-center space-y-3">
                        <FileText className="mx-auto text-slate-200" size={48} />
                        <p className="text-slate-400 font-bold">No articles found. Start writing!</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[32px] w-full max-w-4xl shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-300">
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-xl font-bold text-slate-900">{editMode ? 'Edit Article' : 'Create Article'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white rounded-full transition-colors"><XCircle className="text-slate-400" /></button>
                        </div>
                        
                        <form onSubmit={handleSave} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Article Title</label>
                                <input required className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-xl text-slate-900" 
                                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. 5 Tips for Better Wheat Yield" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Author Name</label>
                                    <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium" 
                                        value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} placeholder="Admin" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Tags (comma separated)</label>
                                    <div className="relative">
                                        <Tag className="absolute left-4 top-3 text-slate-400" size={16} />
                                        <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium" 
                                            value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} placeholder="Wheat, Yield, Tips" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Excerpt (Short Summary)</label>
                                <textarea rows="2" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-900 text-sm" 
                                    value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} placeholder="Briefly describe what this article is about..." />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Main Content (Markdown/Text)</label>
                                <textarea required rows="10" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-900" 
                                    value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} placeholder="Write your article here..." />
                            </div>

                            <div className="grid grid-cols-2 gap-6 items-end">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Featured Image</label>
                                    <label className="cursor-pointer group block">
                                        <div className="flex items-center gap-3 bg-slate-50 border-2 border-dashed border-slate-200 group-hover:border-emerald-500 group-hover:bg-emerald-50/50 rounded-2xl p-3 transition-all">
                                            <Upload size={18} className="text-slate-400 group-hover:text-emerald-500 flex-shrink-0" />
                                            <span className="text-xs font-bold text-slate-500 group-hover:text-emerald-700 truncate">{image ? image.name : 'Upload Header Image'}</span>
                                        </div>
                                        <input type="file" hidden onChange={e => setImage(e.target.files[0])} accept="image/*" />
                                    </label>
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
                                {loading ? 'Saving Article...' : (editMode ? 'Update Article' : 'Publish Article')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogsManagement;
