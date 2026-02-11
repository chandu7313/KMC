import { Calendar, Clock, MapPin } from "lucide-react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

const BookFarmVisit = () => {
  return (
    <>
    <Navbar/>
    <section className="bg-gradient-to-b from-[#f6f3e8] to-white min-h-screen py-20 px-6">

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-16">
        <h2 className="text-6xl font-serif font-bold text-[#1f2d1f] mb-4">
          Book a Farm Visit
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl">
          Schedule a visit from our agricultural experts. We'll come to your farm,
          assess your needs, and provide personalized recommendations.
        </p>
      </div>

      {/* Content Grid */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">

        {/* Left - Form */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10">

          <h3 className="text-3xl font-serif font-semibold text-[#1f2d1f] mb-8">
            Schedule Your Visit
          </h3>

          <form className="space-y-6">

            {/* Row 1 */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-700 outline-none"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Village
                </label>
                <input
                  type="text"
                  placeholder="Your village"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  District
                </label>
                <input
                  type="text"
                  placeholder="Your district"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-700 outline-none"
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Preferred Date
              </label>
              <div className="flex items-center border-2 border-green-700 rounded-xl px-4 py-3">
                <Calendar className="text-green-700 mr-3" size={20} />
                <input
                  type="date"
                  className="w-full outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Purpose of Visit
              </label>
              <textarea
                rows="4"
                placeholder="Describe what you need help with..."
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-700 outline-none"
              ></textarea>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-yellow-500 text-black py-4 rounded-xl font-semibold hover:bg-yellow-600 transition"
            >
              Book Visit
            </button>

          </form>
        </div>

        {/* Right Side */}
        <div className="space-y-8">

          {/* What to Expect */}
          <div className="bg-green-100 rounded-2xl p-8">
            <h3 className="text-2xl font-serif font-semibold text-[#1f2d1f] mb-6">
              What to Expect
            </h3>

            <div className="space-y-4 text-slate-700">
              <div className="flex items-start gap-3">
                <Clock className="text-green-700 mt-1" size={20} />
                <p>Our team will visit within 3-5 days of booking</p>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="text-green-700 mt-1" size={20} />
                <p>We cover all districts in Punjab, Haryana, UP, and Maharashtra</p>
              </div>
            </div>
          </div>

          {/* Free Visit */}
          <div className="bg-green-50 rounded-2xl p-8">
            <h3 className="text-2xl font-serif font-semibold text-[#1f2d1f] mb-4">
              First Visit is Free!
            </h3>
            <p className="text-slate-700">
              Your first consultation visit is completely free. No hidden
              charges or commitments.
            </p>
          </div>

        </div>

      </div>
    </section>
    <Footer/>
    </>
  );
};

export default BookFarmVisit;
