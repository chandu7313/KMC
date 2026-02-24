import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import { Package, Plus, Trash2, Edit, Search, Tag, Image as ImageIcon, CheckCircle } from 'lucide-react';
// Assuming a layout component wrapper exists or simple nav can be used
// import AdminLayout from '../components/AdminLayout'; 

const AdminInventory = () => {
    const { backendUrl, aToken } = useContext(AppContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Form State (Simplified for basic crud)
    const [formData, setFormData] = useState({
        name: '', description: '', shortDescription: '', category: 'Fertilizers', 
        price: '', stock: '', images: '', isFeatured: false
    });

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/product/list`);
            if (data.success) {
                setProducts(data.products);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (aToken) fetchProducts();
    }, [aToken]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const submitData = new FormData();
            Object.keys(formData).forEach(key => {
                if(key !== 'images') submitData.append(key, formData[key]);
            });
            
            // In a real app with Multer, append files. Here assuming single URL or mock for now as per controller logic. 
            // If backend expects files, this needs a file input. Let's assume the controller handles basic fields for now or we mock it.
            // For robust implementation, we'd add file upload handling here.

            const { data } = await axios.post(`${backendUrl}/api/product/add`, formData, { headers: { aToken } });
            if (data.success) {
                toast.success("Product Added Successfully");
                setIsAddModalOpen(false);
                fetchProducts();
                // reset form
                setFormData({name: '', description: '', shortDescription: '', category: 'Fertilizers', price: '', stock: '', images: '', isFeatured: false});
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDeleteProduct = async (id) => {
        if(!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            const { data } = await axios.post(`${backendUrl}/api/product/remove`, { id }, { headers: { aToken } });
            if (data.success) {
                toast.success("Product Deleted");
                fetchProducts();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!aToken) {
        return <div className="p-10 text-center font-bold text-red-500">Admin Access Required</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-10">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                            <Package size={32} className="text-emerald-600"/> Inventory Management
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">Manage marketplace products, stock levels, and pricing.</p>
                    </div>
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-200 flex items-center gap-2"
                    >
                        <Plus size={20} /> Add New Product
                    </button>
                </div>

                {/* Toolbar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search products by name..." 
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-medium text-slate-700 transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
                        <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg">Total Products: {products.length}</span>
                        <span className="bg-rose-50 text-rose-700 px-3 py-1 rounded-lg">Out of Stock: {products.filter(p=>p.stock === 0).length}</span>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                                    <th className="p-4">Product Infomation</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Price / Stock</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr><td colSpan="5" className="p-10 text-center text-slate-400 font-medium">Loading inventory data...</td></tr>
                                ) : filteredProducts.length === 0 ? (
                                    <tr><td colSpan="5" className="p-10 text-center text-slate-400 font-medium">No products found matching "{searchTerm}"</td></tr>
                                ) : (
                                    filteredProducts.map(product => (
                                        <tr key={product._id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 p-1 flex-shrink-0">
                                                        {product.images?.[0] ? <img src={product.images[0]} className="w-full h-full object-contain mix-blend-multiply" alt=""/> : <ImageIcon className="w-full h-full text-slate-300 p-2"/>}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{product.name}</h3>
                                                        <p className="text-xs text-slate-500 font-medium line-clamp-1 truncate w-48">{product.shortDescription}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                                    <Tag size={12}/> {product.category}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-black text-slate-900 text-sm">₹{product.price}</div>
                                                <div className={`text-xs font-bold mt-1 ${product.stock > 10 ? 'text-emerald-600' : product.stock > 0 ? 'text-amber-500' : 'text-rose-500'}`}>
                                                    {product.stock} in stock
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {product.isFeatured ? (
                                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md">
                                                        <CheckCircle size={14}/> Featured
                                                    </span>
                                                ) : <span className="text-xs font-medium text-slate-400">Standard</span>}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                        <Edit size={18}/>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteProduct(product._id)}
                                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={18}/>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Add Product Modal (Simplified) */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-slate-900">Add New Product</h2>
                            <button onClick={()=>setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-900"><Trash2 size={24}/></button>
                        </div>
                        <form onSubmit={handleAddProduct} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Product Name</label>
                                    <input name="name" value={formData.name} onChange={handleInputChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 font-medium" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                                    <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 font-medium text-slate-700">
                                        <option value="Fertilizers">Fertilizers</option>
                                        <option value="Equipments">Equipments</option>
                                        <option value="Seeds">Seeds</option>
                                        <option value="Pesticides">Pesticides</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Price (₹)</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 font-medium" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Initial Stock</label>
                                    <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 font-medium" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Short Description</label>
                                <input name="shortDescription" value={formData.shortDescription} onChange={handleInputChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 font-medium" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Full Description</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="3" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 font-medium resize-none" />
                            </div>
                             <div className="flex items-center gap-2 mt-4">
                                <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleInputChange} id="feat" className="w-4 h-4 text-emerald-600 rounded border-slate-300"/>
                                <label htmlFor="feat" className="text-sm font-bold text-slate-700 cursor-pointer">Mark as Featured Product</label>
                            </div>
                            <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                                <button type="button" onClick={()=>setIsAddModalOpen(false)} className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-3 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg transition-colors">Save Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminInventory;
