import { useState, useEffect, useContext } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import Navbar from "../../layouts/components/Navbar";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BookFarmVisit = () => {
    const { backendUrl, userData, loading: authLoading } = useContext(AppContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        village: "",
        district: "",
        visitDate: "",
        purpose: ""
    });

    const [loading, setLoading] = useState(false);
    const [bookings, setBookings] = useState([]);

    const fetchUserBookings = async () => {
        if (!userData) return;
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.post(backendUrl + "/api/booking/user-bookings", {
                userId: userData.id
            });
            if (data.success) {
                setBookings(data.bookings);
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
        }
    };

    useEffect(() => {
        if (!authLoading) {
            if (userData) {
                setFormData(prev => ({
                    ...prev,
                    fullName: userData.name || "",
                    phone: userData.phone || "",
                    district: userData.district || ""
                }));
                fetchUserBookings();
            } else {
                toast.error("Please login to book a visit");
                navigate("/login");
            }
        }
    }, [userData, authLoading, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.visit_date || !formData.purpose || !formData.village) {
            return toast.error("Please fill all required fields");
        }

        try {
            setLoading(true);
            axios.defaults.withCredentials = true;
            const { data } = await axios.post(backendUrl + "/api/booking/create", {
                farmerId: userData.id,
                ...formData
            });

            if (data.success) {
                toast.success(data.message);
                // Reset non-profile fields
                setFormData(prev => ({
                    ...prev,
                    visitDate: "",
                    purpose: "",
                    village: ""
                }));
                fetchUserBookings();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return null;

    return (
        <>
            <Navbar />
            <section className="bg-gradient-to-b from-[#f6f3e8] to-white min-h-screen py-10 md:py-16 px-4 sm:px-6">
                {/* Header */}
                <div className="max-w-6xl mx-auto mb-8 md:mb-12 text-center md:text-left">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#1f2d1f] mb-3 md:mb-4 mt-10">
                        Book a Farm Visit
                    </h2>
                    <p className="text-sm md:text-lg text-slate-600 max-w-2xl mx-auto md:mx-0">
                        Schedule a visit from our agricultural experts. We'll come to your farm,
                        assess your needs, and provide personalized recommendations.
                    </p>
                </div>

                {/* Content Grid */}
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 md:gap-12">
                    {/* Left - Form */}
                    <div className="bg-white rounded-xl md:rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-8">
                        <h3 className="text-xl md:text-2xl font-serif font-semibold text-[#1f2d1f] mb-5 md:mb-6">
                            Schedule Your Visit
                        </h3>

                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            {/* Row 1 */}
                            <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <label className="block text-sm font-semibold mb-1.5 md:mb-2 text-slate-700">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        placeholder="Your name"
                                        required
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 md:px-4 md:py-3 text-sm md:text-base focus:ring-2 focus:ring-green-700 outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1.5 md:mb-2 text-slate-700">
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+91 XXXXX XXXXX"
                                        required
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 md:px-4 md:py-3 text-sm md:text-base focus:ring-2 focus:ring-green-700 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Row 2 */}
                            <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <label className="block text-sm font-semibold mb-1.5 md:mb-2 text-slate-700">
                                        Village
                                    </label>
                                    <input
                                        type="text"
                                        name="village"
                                        value={formData.village}
                                        onChange={handleChange}
                                        placeholder="Your village"
                                        required
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 md:px-4 md:py-3 text-sm md:text-base focus:ring-2 focus:ring-green-700 outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1.5 md:mb-2 text-slate-700">
                                        District
                                    </label>
                                    <input
                                        type="text"
                                        name="district"
                                        value={formData.district}
                                        onChange={handleChange}
                                        placeholder="Your district"
                                        required
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 md:px-4 md:py-3 text-sm md:text-base focus:ring-2 focus:ring-green-700 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-sm font-semibold mb-1.5 md:mb-2 text-slate-700">
                                    Preferred Date
                                </label>
                                <div className="flex items-center border border-slate-200 rounded-lg px-3 py-2.5 md:px-4 md:py-3 focus-within:ring-2 focus-within:ring-green-700 transition-all bg-white">
                                    <Calendar className="text-green-700 mr-2 md:mr-3" size={18} />
                                    <input
                                        type="date"
                                        name="visitDate"
                                        value={formData.visit_date}
                                        onChange={handleChange}
                                        required
                                        className="w-full outline-none bg-transparent text-sm md:text-base"
                                    />
                                </div>
                            </div>

                            {/* Purpose */}
                            <div>
                                <label className="block text-sm font-semibold mb-1.5 md:mb-2 text-slate-700">
                                    Purpose of Visit
                                </label>
                                <textarea
                                    name="purpose"
                                    value={formData.purpose}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Describe what you need help with..."
                                    required
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 md:px-4 md:py-3 text-sm md:text-base focus:ring-2 focus:ring-green-700 outline-none transition-all resize-none"
                                ></textarea>
                            </div>

                            {/* Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-yellow-500 text-black py-3 md:py-3.5 rounded-lg font-semibold hover:bg-yellow-600 transition flex items-center justify-center gap-2 text-sm md:text-base ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                                ) : (
                                    "Book Visit"
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Right Side */}
                    <div className="space-y-4 md:space-y-6">
                        {/* What to Expect */}
                        <div className="bg-green-100 rounded-xl md:rounded-2xl p-6 md:p-8">
                            <h3 className="text-lg md:text-xl font-serif font-semibold text-[#1f2d1f] mb-4 md:mb-5">
                                What to Expect
                            </h3>

                            <div className="space-y-4 text-sm md:text-base text-slate-700">
                                <div className="flex items-start gap-3">
                                    <Clock className="text-green-700 mt-0.5" size={18} />
                                    <p>Our team will visit within 3-5 days of booking</p>
                                </div>

                                <div className="flex items-start gap-3">
                                    <MapPin className="text-green-700 mt-0.5" size={18} />
                                    <p>We cover all districts in Punjab, Haryana, UP, and Maharashtra</p>
                                </div>
                            </div>
                        </div>

                        {/* Free Visit */}
                        <div className="bg-green-50 rounded-xl md:rounded-2xl p-6 md:p-8">
                            <h3 className="text-lg md:text-xl font-serif font-semibold text-[#1f2d1f] mb-2 md:mb-3">
                                First Visit is Free!
                            </h3>
                            <p className="text-sm md:text-base text-slate-700">
                                Your first consultation visit is completely free. No hidden
                                charges or commitments.
                            </p>
                        </div>
                    </div>

                </div>

                {/* My Bookings Section */}
                <div className="max-w-6xl mx-auto mt-12 md:mt-20">
                    <h3 className="text-2xl md:text-3xl font-serif font-semibold text-[#1f2d1f] mb-6 md:mb-8 text-center md:text-left">
                        My Recent Bookings
                    </h3>
                    
                    {bookings.length === 0 ? (
                        <div className="bg-white rounded-xl md:rounded-2xl border border-dashed border-slate-300 p-8 md:p-12 text-center text-sm md:text-base text-slate-400 font-medium">
                            No bookings found yet. Schedule your first visit above!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {bookings.map((booking) => (
                                <div key={booking.id} className="bg-white rounded-xl md:rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start mb-3 md:mb-4">
                                        <div className="bg-green-50 text-green-700 px-2.5 py-1 md:px-3 rounded-full text-[10px] md:text-xs font-bold flex items-center gap-1.5">
                                            <Calendar size={12} /> {new Date(booking.visit_date).toLocaleDateString()}
                                        </div>
                                        <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest px-2 py-1 md:px-2.5 rounded-lg border ${
                                            booking.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                            booking.status === 'Completed' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                            booking.status === 'Cancelled' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                            'bg-orange-50 text-orange-600 border-orange-100'
                                        }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-slate-900 text-sm md:text-base mb-1">{booking.village}, {booking.district}</h4>
                                    <p className="text-xs md:text-sm text-slate-500 line-clamp-2 mb-3 md:mb-4">"{booking.purpose}"</p>
                                    
                                    <div className="pt-3 md:pt-4 border-t border-slate-50 flex items-center justify-between text-[10px] md:text-[11px] font-black uppercase tracking-wider">
                                        <span className="text-slate-400">Booking ID</span>
                                        <span className="text-slate-900">#{booking.id.slice(-6).toUpperCase()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default BookFarmVisit;
