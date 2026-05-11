import { Phone, Mail, MapPin, Clock } from "lucide-react";
import Navbar from "../../layouts/components/Navbar";

const Contact = () => {
  return (
    <>
    <Navbar/>
    <section className="bg-gradient-to-b from-[#f6f3e8] to-white min-h-screen py-20 px-6">

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-16">
        <h2 className="text-6xl font-serif font-bold text-[#1f2d1f] mb-4">
          Contact Us
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl">
          Have questions? We're here to help. Reach out to us through any of the channels below.
        </p>
      </div>

      {/* Content Grid */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">

        {/* Left - Form */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10">

          <h3 className="text-3xl font-serif font-semibold text-[#1f2d1f] mb-8">
            Send us a Message
          </h3>

          <form className="space-y-6">

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+91 XXXX XXXXX"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Subject
              </label>
              <input
                type="text"
                placeholder="How can we help?"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Message
              </label>
              <textarea
                rows="5"
                placeholder="Tell us more about your query..."
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-yellow-500 text-black px-8 py-3 rounded-xl font-semibold hover:bg-yellow-600 transition"
            >
              Send Message
            </button>

          </form>
        </div>

        {/* Right - Contact Info */}
        <div>
          <h3 className="text-3xl font-serif font-semibold text-[#1f2d1f] mb-10">
            Get in Touch
          </h3>

          <div className="space-y-10">

            {/* Phone */}
            <div className="flex gap-4 items-start">
              <div className="bg-green-100 p-4 rounded-xl">
                <Phone className="text-green-700" size={22} />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-1">Phone</h4>
                <p className="text-slate-600">+91 123 456 7890</p>
                <p className="text-slate-600">+91 987 654 3210</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-4 items-start">
              <div className="bg-green-100 p-4 rounded-xl">
                <Mail className="text-green-700" size={22} />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-1">Email</h4>
                <p className="text-slate-600">info@kissanmithar.com</p>
                <p className="text-slate-600">support@kissanmithar.com</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex gap-4 items-start">
              <div className="bg-green-100 p-4 rounded-xl">
                <MapPin className="text-green-700" size={22} />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-1">Office Address</h4>
                <p className="text-slate-600">
                  123 Agriculture Complex, Sector 5,
                </p>
                <p className="text-slate-600">
                  New Delhi, India - 110001
                </p>
              </div>
            </div>

            {/* Working Hours */}
            <div className="flex gap-4 items-start">
              <div className="bg-green-100 p-4 rounded-xl">
                <Clock className="text-green-700" size={22} />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-1">Working Hours</h4>
                <p className="text-slate-600">
                  Monday - Saturday: 9:00 AM - 6:00 PM
                </p>
                <p className="text-slate-600">
                  Sunday: Closed
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
    </>
  );
};

export default Contact;
