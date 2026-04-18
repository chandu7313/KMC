import { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import { Plus, Edit2, Trash2, Search, X, RefreshCw, MapPin } from "lucide-react";

const MarketPriceManagement = () => {
    const { backendUrl } = useContext(AppContext);
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [districtFilter, setDistrictFilter] = useState("");
    
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedPriceId, setSelectedPriceId] = useState(null);
    const [formData, setFormData] = useState({
        cropName: '',
        variety: '',
        district: '',
        mandi: 'Local Mandi',
        unit: 'Quintal',
        modalPrice: '',
        minPrice: '',
        maxPrice: '',
        change: ''
    });

    const fetchPrices = useCallback(async () => {
        try {
            setLoading(true);
            const params = {
                crop: searchTerm,
                district: districtFilter
            };
            const { data } = await axios.get(`${backendUrl}/api/market`, { params });
            if (data.success) {
                setPrices(data.prices);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }, [backendUrl, searchTerm, districtFilter]);

    useEffect(() => {
        fetchPrices();
    }, [fetchPrices]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleOpenModal = (price = null) => {
        if (price) {
            setIsEditMode(true);
            setSelectedPriceId(price.id);
            setFormData({
                cropName: price.crop_name,
                variety: price.variety,
                district: price.district,
                mandi: price.mandi || 'Local Mandi',
                unit: price.unit,
                modalPrice: price.modal_price,
                minPrice: price.min_price || '',
                maxPrice: price.max_price || '',
                change: price.change
            });
        } else {
            setIsEditMode(false);
            setSelectedPriceId(null);
            setFormData({
                cropName: '',
                variety: '',
                district: '',
                mandi: 'Local Mandi',
                unit: 'Quintal',
                modalPrice: '',
                minPrice: '',
                maxPrice: '',
                change: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            axios.defaults.withCredentials = true;
            let response;
            if (isEditMode) {
                response = await axios.put(`${backendUrl}/api/market/${selectedPriceId}`, formData);
            } else {
                response = await axios.post(`${backendUrl}/api/market`, formData);
            }

            if (response.data.success) {
                toast.success(response.data.message);
                setIsModalOpen(false);
                fetchPrices();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this price?")) return;
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.delete(`${backendUrl}/api/market/${id}`);
            if (data.success) {
                toast.success(data.message);
                fetchPrices();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };
    const handleSync = async () => {
        try {
            axios.defaults.withCredentials = true;
            setLoading(true);
            const { data } = await axios.post(`${backendUrl}/api/market/sync`);
            if (data.success) {
                toast.success(data.message);
                fetchPrices();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Sync failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-800">Market Price Management</h2>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleSync}
                        disabled={loading}
                        className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-200 transition disabled:opacity-50"
                    >
                        <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Sync Mandi Data
                    </button>
                    <button 
                        onClick={() => handleOpenModal()}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition"
                    >
                        <Plus size={18} /> Add New Price
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="flex-1 min-w-[200px] relative">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Filter by crop..." 
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="w-48">
                    <input 
                        type="text" 
                        placeholder="Filter by district..." 
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={districtFilter}
                        onChange={(e) => setDistrictFilter(e.target.value)}
                    />
                </div>
            </div>

            {/* Price Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Crop</th>
                                <th className="px-6 py-4">Variety</th>
                                <th className="px-6 py-4">District</th>
                                <th className="px-6 py-4">Price (₹)</th>
                                <th className="px-6 py-4">Change</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-10">Loading prices...</td></tr>
                            ) : prices.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-10">No market data found</td></tr>
                            ) : prices.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{item.crop_name}</td>
                                    <td className="px-6 py-4">{item.variety}</td>
                                    <td className="px-6 py-4">{item.district}</td>
                                    <td className="px-6 py-4 font-semibold">₹{(item.modal_price || 0).toLocaleString()}</td>
                                    <td className={`px-6 py-4 ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {item.change > 0 ? '+' : ''}{item.change}%
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <button 
                                            onClick={() => handleOpenModal(item)}
                                            className="text-slate-400 hover:text-blue-600 transition"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(item.id)}
                                            className="text-slate-400 hover:text-red-600 transition"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
                        <button 
                            onClick={() => setIsModalOpen(false)} 
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                        >
                            <X size={20} />
                        </button>
                        <h3 className="text-xl font-bold mb-6 text-slate-800">
                            {isEditMode ? 'Edit Crop Price' : 'Add New Crop Price'}
                        </h3>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Crop</label>
                                    <input 
                                        type="text" name="cropName" required
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                        value={formData.crop_name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Variety</label>
                                    <input 
                                        type="text" name="variety" required
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                        value={formData.variety}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">District</label>
                                <input 
                                    type="text" name="district" required
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                    value={formData.district}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Mandi Name</label>
                                <input 
                                    type="text" name="mandi" required
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                    value={formData.mandi}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Price (₹)</label>
                                    <input 
                                        type="number" name="modalPrice" required
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                        value={formData.modal_price}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Change (%)</label>
                                    <input 
                                        type="number" step="0.1" name="change" required
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                        value={formData.change}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Min Price</label>
                                    <input 
                                        type="number" name="minPrice"
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                        value={formData.min_price}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Max Price</label>
                                    <input 
                                        type="number" name="maxPrice"
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                        value={formData.max_price}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Unit</label>
                                <select 
                                    name="unit"
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                    value={formData.unit}
                                    onChange={handleInputChange}
                                >
                                    <option value="Quintal">Quintal</option>
                                    <option value="Kg">Kg</option>
                                    <option value="Ton">Ton</option>
                                </select>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 border border-slate-200 py-2 rounded-lg hover:bg-slate-50 text-sm font-medium transition"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 text-sm font-medium transition shadow-sm"
                                >
                                    {isEditMode ? 'Update Price' : 'Add Price'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarketPriceManagement;
