import { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import { UserPlus, Edit2, Trash2, Key, MapPin, Shield, CheckCircle, X } from "lucide-react";

const UserManagement = () => {
    const { backendUrl } = useContext(AppContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [selectedUser, setSelectedUser] = useState(null);

    const districtsList = ["Rajkot", "Nagpur", "Junagadh", "Davangere", "Alwar", "Latur", "Guntur", "Karnal", "Dewas", "Muzaffarnagar", "Indore"];

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user',
        district: ''
    });

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            axios.defaults.withCredentials = true;
            const { data } = await axios.get(`${backendUrl}/api/admin/users`);
            if (data.success) {
                setUsers(data.users);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }, [backendUrl]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleOpenAdd = () => {
        setModalMode('add');
        setFormData({ name: '', email: '', password: '', role: 'user', district: '' });
        setShowModal(true);
    };

    const handleOpenEdit = (user) => {
        setModalMode('edit');
        setSelectedUser(user);
        setFormData({ 
            name: user.name, 
            email: user.email, 
            password: '', 
            role: user.role, 
            district: user.district || '' 
        });
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            axios.defaults.withCredentials = true;
            let response;
            if (modalMode === 'add') {
                response = await axios.post(`${backendUrl}/api/admin/users`, formData);
            } else {
                response = await axios.put(`${backendUrl}/api/admin/users/${selectedUser._id}`, formData);
            }

            if (response.data.success) {
                toast.success(response.data.message);
                setShowModal(false);
                fetchUsers();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.delete(`${backendUrl}/api/admin/users/${id}`);
            if (data.success) {
                toast.success(data.message);
                fetchUsers();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
                    <p className="text-sm text-slate-500">Manage admins, field officers and farmers.</p>
                </div>
                <button 
                    onClick={handleOpenAdd}
                    className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-green-700 transition font-semibold shadow-sm"
                >
                    <UserPlus size={18} />
                    Add User
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4">User Details</th>
                                <th className="px-6 py-4">Role & District</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr><td colSpan="4" className="text-center py-20 text-slate-400">Loading users...</td></tr>
                            ) : users.length === 0 ? (
                                <tr><td colSpan="4" className="text-center py-20 text-slate-400">No users found</td></tr>
                            ) : users.map((user) => (
                                <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-900">{user.name}</div>
                                        <div className="text-xs text-slate-500">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Shield size={14} className={user.role === 'admin' ? 'text-purple-500' : user.role === 'field-officer' ? 'text-blue-500' : 'text-slate-400'} />
                                            <span className="font-semibold text-slate-700 capitalize">{user.role.replace('-', ' ')}</span>
                                        </div>
                                        {user.district && (
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                <MapPin size={12} />
                                                {user.district}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold
                                            ${user.isAccountVerified ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                                            {user.isAccountVerified ? <CheckCircle size={12} /> : <div className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse"></div>}
                                            {user.isAccountVerified ? 'Verified' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handleOpenEdit(user)}
                                                className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                                                title="Edit User"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(user._id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                title="Delete User"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-800">
                                {modalMode === 'add' ? 'Add New User' : 'Edit User Info'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Full Name</label>
                                    <input 
                                        type="text" required
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Email Address</label>
                                    <input 
                                        type="email" required
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="block text-xs font-semibold text-slate-500 uppercase">Password</label>
                                        {modalMode === 'edit' && <span className="text-[10px] text-green-600 font-bold uppercase flex items-center gap-1"><Key size={10} /> Leave blank to keep same</span>}
                                    </div>
                                    <input 
                                        type="password" required={modalMode === 'add'}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Role</label>
                                        <select 
                                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                            value={formData.role}
                                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                                        >
                                            <option value="user">Farmer (User)</option>
                                            <option value="field-officer">Field Officer</option>
                                            <option value="admin">Administrator</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">District</label>
                                        <select 
                                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                            value={formData.district}
                                            onChange={(e) => setFormData({...formData, district: e.target.value})}
                                        >
                                            <option value="">None</option>
                                            {districtsList.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button 
                                    type="button" onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 bg-green-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-green-700 shadow-lg shadow-green-100 transition"
                                >
                                    {modalMode === 'add' ? 'Create User' : 'Update User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
