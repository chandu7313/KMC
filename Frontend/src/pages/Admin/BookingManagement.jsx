import { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import { Calendar, User, Clock, CheckCircle, XCircle } from "lucide-react";

const BookingManagement = () => {
    const { backendUrl } = useContext(AppContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fieldOfficers, setFieldOfficers] = useState([]);

    const fetchBookings = useCallback(async () => {
        try {
            setLoading(true);
            axios.defaults.withCredentials = true;
            const { data } = await axios.get(`${backendUrl}/api/admin/bookings`);
            if (data.success) {
                setBookings(data.bookings);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }, [backendUrl]);

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
        fetchBookings();
        fetchFieldOfficers();
    }, [fetchBookings, backendUrl]);

    const handleUpdateBooking = async (id, updateData) => {
        try {
            const { data } = await axios.put(`${backendUrl}/api/admin/bookings/${id}`, updateData);
            if (data.success) {
                toast.success(data.message);
                fetchBookings();
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
                <h2 className="text-2xl font-bold text-slate-800">Booking Management</h2>
                <span className="text-sm text-slate-500">{bookings.length} Bookings Total</span>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Farmer Name</th>
                                <th className="px-6 py-4">Package</th>
                                <th className="px-6 py-4">Visit Date</th>
                                <th className="px-6 py-4">Assigned Officer</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Payment</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="7" className="text-center py-10">Loading bookings...</td></tr>
                            ) : bookings.length === 0 ? (
                                <tr><td colSpan="7" className="text-center py-10">No bookings found</td></tr>
                            ) : bookings.map((booking) => (
                                <tr key={booking._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{booking.farmerId?.name}</div>
                                        <div className="text-xs text-slate-500">{booking.farmerId?.district}</div>
                                    </td>
                                    <td className="px-6 py-4 font-medium">{booking.package}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-slate-400" />
                                            {new Date(booking.visitDate).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select 
                                            value={booking.assignedOfficer?._id || ""}
                                            onChange={(e) => handleUpdateBooking(booking._id, { assignedOfficer: e.target.value })}
                                            className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs focus:ring-2 focus:ring-green-500 outline-none w-full"
                                        >
                                            <option value="">Unassigned</option>
                                            {fieldOfficers.map(fo => <option key={fo._id} value={fo._id}>{fo.name}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select 
                                            value={booking.status}
                                            onChange={(e) => handleUpdateBooking(booking._id, { status: e.target.value })}
                                            className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase border outline-none
                                                ${booking.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : 
                                                  booking.status === 'Confirmed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                  booking.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                                                  'bg-yellow-50 text-yellow-700 border-yellow-200'}`}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Confirmed">Confirmed</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 font-medium
                                            ${booking.paymentStatus === 'Completed' ? 'text-green-600' : 
                                              booking.paymentStatus === 'Failed' ? 'text-red-600' : 'text-slate-500'}`}>
                                            {booking.paymentStatus === 'Completed' ? <CheckCircle size={14} /> : 
                                             booking.paymentStatus === 'Failed' ? <XCircle size={14} /> : <Clock size={14} />}
                                            {booking.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {booking.status !== 'Completed' && (
                                            <button 
                                                onClick={() => handleUpdateBooking(booking._id, { status: 'Completed', paymentStatus: 'Completed' })}
                                                className="text-green-600 hover:text-green-700 text-xs font-bold uppercase tracking-wider"
                                            >
                                                Mark Completed
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BookingManagement;
