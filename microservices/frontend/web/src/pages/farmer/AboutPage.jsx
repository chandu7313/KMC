import Navbar from "../../layouts/components/Navbar";

const About= () => {
  return (
    <>
    <Navbar/>
    <section className="bg-gradient-to-b from-[#f6f3e8] to-white py-20 px-6">

      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="text-5xl font-serif font-bold text-[#1f2d1f] mb-6">
          Empowering Farmers with Smart Agriculture
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed">
          Kissan Mithar is built to bridge the gap between traditional farming
          practices and modern agricultural intelligence. We help farmers make
          data-driven decisions that improve productivity, profitability, and sustainability.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 mb-20">
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-2xl font-semibold text-green-800 mb-4">
            Our Mission
          </h3>
          <p className="text-slate-600 leading-relaxed">
            To provide accessible, reliable, and affordable agricultural
            advisory services that enable farmers to maximize yield,
            reduce input costs, and adapt to changing environmental conditions.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-2xl font-semibold text-green-800 mb-4">
            Our Vision
          </h3>
          <p className="text-slate-600 leading-relaxed">
            To become the most trusted digital agriculture partner in India,
            empowering every farmer with knowledge, technology, and market access.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="max-w-6xl mx-auto">
        <h3 className="text-3xl font-serif font-bold text-center text-[#1f2d1f] mb-12">
          Our Core Values
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
            <h4 className="font-semibold text-green-800 mb-2">Trust</h4>
            <p className="text-sm text-slate-600">
              Transparent advisory and reliable data-driven insights.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
            <h4 className="font-semibold text-green-800 mb-2">Innovation</h4>
            <p className="text-sm text-slate-600">
              Leveraging modern tools to simplify farming decisions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
            <h4 className="font-semibold text-green-800 mb-2">Sustainability</h4>
            <p className="text-sm text-slate-600">
              Promoting eco-friendly and long-term farming practices.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
            <h4 className="font-semibold text-green-800 mb-2">Farmer First</h4>
            <p className="text-sm text-slate-600">
              Every solution is designed with farmers at the center.
            </p>
          </div>

        </div>
      </div>

    </section>
    </>
  );
};

export default About;
