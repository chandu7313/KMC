import { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import { Phone } from "lucide-react";

const FarmerManagement = () => {
    const { backendUrl } = useContext(AppContext);
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [districtFilter, setDistrictFilter] = useState("");
    const [cropFilter, setCropFilter] = useState("");
    const [fieldOfficers, setFieldOfficers] = useState([]);
    
    // Modal states
    const [selectedFarmer, setSelectedFarmer] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editData, setEditData] = useState({ name: '', email: '', phone: '', district: '', crops: '', fieldOfficer: '' });

    const fetchFarmers = useCallback(async () => {
        try {
            setLoading(true);
            axios.defaults.withCredentials = true;
            const params = {
                page,
                search: searchTerm,
                status: statusFilter,
                district: districtFilter,
                crop: cropFilter
            };
            const { data } = await axios.get(`${backendUrl}/api/admin/farmers`, { params });
            if (data.success) {
                setFarmers(data.farmers);
                setTotalPages(data.totalPages);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }, [backendUrl, page, searchTerm, statusFilter, districtFilter, cropFilter]);

    const fetchFieldOfficers = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/users`);
            if (data.success) {
                setFieldOfficers(data.users.filter(u => u.role === 'field-officer'));
            }
        } catch (error) {
            console.error("Error fetching field officers", error);
        }
    };

    useEffect(() => {
        fetchFarmers();
    }, [fetchFarmers]);

    useEffect(() => {
        fetchFieldOfficers();
    }, [backendUrl]);

    const handleStatusUpdate = async (id, status) => {
        try {
            const { data } = await axios.put(`${backendUrl}/api/admin/farmer/${id}/status`, { status });
            if (data.success) {
                toast.success(data.message);
                fetchFarmers();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleEditSave = async () => {
        try {
            const dataToUpdate = {
                ...editData,
                crops: editData.crops.split(',').map(c => c.trim()).filter(c => c)
            };
            const { data } = await axios.put(`${backendUrl}/api/admin/farmer/${selectedFarmer._id}`, dataToUpdate);
            if (data.success) {
                toast.success(data.message);
                setIsEditModalOpen(false);
                fetchFarmers();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const openEditModal = (farmer) => {
        setSelectedFarmer(farmer);
        setEditData({
            name: farmer.name,
            email: farmer.email,
            phone: farmer.phone || '',
            district: farmer.district,
            crops: farmer.crops.join(', '),
            fieldOfficer: farmer.fieldOfficer?._id || ''
        });
        setIsEditModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">Farmer Management</h2>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        placeholder="Search by name..." 
                        className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                    />
                    <select 
                        className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    >
                        <option value="">All Status</option>
                        <option value="Approved">Approved</option>
                        <option value="Pending">Pending</option>
                    </select>
                    <input 
                        type="text" 
                        placeholder="District..." 
                        className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-32"
                        value={districtFilter}
                        onChange={(e) => { setDistrictFilter(e.target.value); setPage(1); }}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Farmer Name</th>
                                <th className="px-6 py-4">District</th>
                                <th className="px-6 py-4">Crops</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Field Officer</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-10">Loading farmers...</td></tr>
                            ) : farmers.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-10">No farmers found</td></tr>
                            ) : farmers.map((farmer) => (
                                <tr key={farmer._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{farmer.name}</div>
                                        {farmer.phone && (
                                            <div className="flex items-center gap-1 text-[10px] text-green-600 mt-0.5">
                                                <Phone size={10} />
                                                {farmer.phone}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">{farmer.district}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {farmer.crops.map((crop, i) => (
                                                <span key={i} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] uppercase font-bold">{crop}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 ${farmer.isAccountVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${farmer.isAccountVerified ? 'bg-green-600' : 'bg-yellow-600'}`}></span>
                                            {farmer.isAccountVerified ? 'Approved' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {farmer.fieldOfficer ? (
                                            <span className="text-blue-600 font-medium">{farmer.fieldOfficer.name}</span>
                                        ) : (
                                            <span className="text-slate-400 italic">Unassigned</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button 
                                            onClick={() => { setSelectedFarmer(farmer); setIsDetailsModalOpen(true); }}
                                            className="text-indigo-600 hover:underline font-medium"
                                        >
                                            View
                                        </button>
                                        <button 
                                            onClick={() => openEditModal(farmer)}
                                            className="text-slate-600 hover:text-slate-900 font-medium"
                                        >
                                            Edit
                                        </button>
                                        {!farmer.isAccountVerified ? (
                                            <button 
                                                onClick={() => handleStatusUpdate(farmer._id, 'Approved')}
                                                className="text-green-600 hover:text-green-700 font-medium"
                                            >
                                                Approve
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => handleStatusUpdate(farmer._id, 'Pending')}
                                                className="text-red-600 hover:text-red-700 font-medium"
                                            >
                                                Reject
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-slate-500 text-xs">Page {page} of {totalPages}</span>
                    <div className="flex gap-2">
                        <button 
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="px-3 py-1 border border-slate-200 rounded disabled:opacity-50 text-sm"
                        >
                            Prev
                        </button>
                        <button 
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="px-3 py-1 border border-slate-200 rounded disabled:opacity-50 text-sm"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* View Details Modal */}
            {isDetailsModalOpen && selectedFarmer && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
                        <button onClick={() => setIsDetailsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">✕</button>
                        <h3 className="text-xl font-bold mb-4">Farmer Details</h3>
                        <div className="space-y-4 text-sm">
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-slate-500">Name:</span>
                                <span className="col-span-2 font-medium">{selectedFarmer.name}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-slate-500">Mobile:</span>
                                <span className="col-span-2 font-medium text-green-600">{selectedFarmer.phone || 'N/A'}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-slate-500">Email:</span>
                                <span className="col-span-2 font-medium">{selectedFarmer.email}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-slate-500">District:</span>
                                <span className="col-span-2 font-medium">{selectedFarmer.district}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-slate-500">Crops:</span>
                                <div className="col-span-2 flex flex-wrap gap-1">
                                    {selectedFarmer.crops.map((c, i) => <span key={i} className="bg-slate-100 px-2 py-0.5 rounded">{c}</span>)}
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-slate-500">Field Officer:</span>
                                <span className="col-span-2 font-medium">{selectedFarmer.fieldOfficer?.name || 'Not assigned'}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-slate-500">Joined:</span>
                                <span className="col-span-2 font-medium">{new Date(selectedFarmer.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsDetailsModalOpen(false)}
                            className="w-full mt-6 bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Edit / Assign Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
                        <button onClick={() => setIsEditModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">✕</button>
                        <h3 className="text-xl font-bold mb-4">Edit Farmer Info</h3>
                        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Name</label>
                                <input 
                                    type="text" 
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                                    value={editData.name}
                                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Email</label>
                                    <input 
                                        type="email" 
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                                        value={editData.email}
                                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Mobile</label>
                                    <input 
                                        type="tel" 
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                                        value={editData.phone}
                                        onChange={(e) => setEditData({...editData, phone: e.target.value})}
                                        placeholder="Mobile Number"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">District</label>
                                <input 
                                    type="text" 
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                                    value={editData.district}
                                    onChange={(e) => setEditData({...editData, district: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Crops (comma separated)</label>
                                <input 
                                    type="text" 
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                                    value={editData.crops}
                                    onChange={(e) => setEditData({...editData, crops: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Assign Field Officer</label>
                                <select 
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                                    value={editData.fieldOfficer}
                                    onChange={(e) => setEditData({...editData, fieldOfficer: e.target.value})}
                                >
                                    <option value="">Unassigned</option>
                                    {fieldOfficers.map(fo => <option key={fo._id} value={fo._id}>{fo.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-6">
                            <button 
                                onClick={() => setIsEditModalOpen(false)}
                                className="flex-1 border border-slate-200 py-2 rounded-lg hover:bg-slate-50 text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleEditSave}
                                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 text-sm font-medium"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FarmerManagement;
