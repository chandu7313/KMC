import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const farmerStories = [
  {
    id: 1,
    name: "Ramesh Kumar",
    location: "Maharashtra",
    crop: "Pomegranate",
    before: "Low yield due to poor soil nutrition planning.",
    after: "Yield increased by 40% after soil-based advisory.",
    image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
  },
  {
    id: 2,
    name: "Lakshmi Devi",
    location: "Telangana",
    crop: "Mango",
    before: "Pest damage affecting fruit quality.",
    after: "Reduced crop loss by 35% using IPM techniques.",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
  },
  {
    id: 3,
    name: "Suresh Patel",
    location: "Gujarat",
    crop: "Guava",
    before: "Unstable market pricing decisions.",
    after: "Improved profits by 28% with market intelligence alerts.",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
  },
];

const SuccessStories = () => {
  return (
    <>
        <Navbar/>
    <section className="bg-gradient-to-b from-[#f6f3e8] to-white py-20 px-6">

      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-5xl font-serif font-bold text-[#1f2d1f] mb-4">
          Real Impact. Real Results.
        </h2>
        <p className="text-lg text-slate-600">
          Transforming farms. Empowering futures.
        </p>
      </div>

      {/* Farmer Stories */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-20">
        {farmerStories.map((farmer) => (
          <div
            key={farmer.id}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={farmer.image}
              alt={farmer.name}
              className="h-56 w-full object-cover"
            />

            <div className="p-6">
              <h3 className="text-xl font-semibold text-[#1f2d1f] mb-1">
                {farmer.name}
              </h3>
              <p className="text-sm text-slate-500 mb-3">
                {farmer.location} • {farmer.crop}
              </p>

              <div className="text-sm text-slate-700 space-y-2">
                <p>
                  <span className="font-semibold text-red-600">Before:</span>{" "}
                  {farmer.before}
                </p>
                <p>
                  <span className="font-semibold text-green-700">After:</span>{" "}
                  {farmer.after}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Company Impact Section */}
      <div className="max-w-6xl mx-auto bg-green-700 text-white rounded-2xl p-12 grid md:grid-cols-4 gap-8 text-center shadow-lg">

        <div>
          <h3 className="text-4xl font-bold mb-2">10,000+</h3>
          <p className="text-sm opacity-90">Farmers Supported</p>
        </div>

        <div>
          <h3 className="text-4xl font-bold mb-2">40%</h3>
          <p className="text-sm opacity-90">Average Yield Increase</p>
        </div>

        <div>
          <h3 className="text-4xl font-bold mb-2">15+</h3>
          <p className="text-sm opacity-90">States Served</p>
        </div>

        <div>
          <h3 className="text-4xl font-bold mb-2">95%</h3>
          <p className="text-sm opacity-90">Farmer Satisfaction</p>
        </div>

      </div>
    </section>
    <Footer/>
    </>
  );
};

export default SuccessStories;
