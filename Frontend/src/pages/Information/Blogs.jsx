import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const blogs = [
  {
    id: 1,
    title: "How Soil Testing Improves Crop Yield",
    excerpt:
      "Understand why soil testing is critical before every planting season and how it boosts productivity.",
    image:
      "https://images.unsplash.com/photo-1598514983318-2f64f8f4796c",
    category: "Soil",
    date: "Jan 20, 2026",
  },
  {
    id: 2,
    title: "Best Crops for Summer Season",
    excerpt:
      "A practical guide to selecting high-yield crops for the upcoming summer season.",
    image:
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854",
    category: "Crop Selection",
    date: "Jan 15, 2026",
  },
  {
    id: 3,
    title: "Integrated Pest Management Basics",
    excerpt:
      "Reduce crop damage using sustainable and cost-effective pest control techniques.",
    image:
      "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8",
    category: "Pest Control",
    date: "Jan 10, 2026",
  },
];

const Blogs = () => {
  const navigate = useNavigate();

  return (
    <>
        <Navbar/>
    <section className="bg-gradient-to-b from-[#f6f3e8] to-white py-20 px-6">
      
      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-5xl font-serif font-bold text-[#1f2d1f] mb-4 mt-10">
          Latest Insights & Farming Tips
        </h2>
        <p className="text-lg text-slate-600">
          Practical knowledge to help farmers make smarter decisions.
        </p>
      </div>

      {/* Blog Grid */}
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100 hover:shadow-lg transition cursor-pointer"
            onClick={() => navigate(`/blog/${blog.id}`)}
          >
            {/* Image */}
            <img
              src={blog.image}
              alt={blog.title}
              className="h-52 w-full object-cover"
            />

            {/* Content */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {blog.category}
                </span>
                <span className="text-xs text-slate-500">
                  {blog.date}
                </span>
              </div>

              <h3 className="text-xl font-semibold text-[#1f2d1f] mb-2">
                {blog.title}
              </h3>

              <p className="text-slate-600 text-sm mb-4">
                {blog.excerpt}
              </p>

              <button className="text-green-700 font-semibold hover:underline">
                Read More →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center mt-12">
        <button
          onClick={() => navigate("/blog")}
          className="px-6 py-3 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 transition"
        >
          View All Articles
        </button>
      </div>
    </section>
    <Footer/>
    </>

  );
};

export default Blogs;
