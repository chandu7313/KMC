import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const fertilizers = [
  {
    id: 1,
    name: "Urea 46% N",
    price: 299,
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449",
    description: "High nitrogen fertilizer for rapid vegetative growth.",
    weight: "45 kg bag",
  },
  {
    id: 2,
    name: "DAP 18-46-0",
    price: 1350,
    image:
      "https://images.unsplash.com/photo-1606788075761-6f1b45d4d6f2",
    description: "Balanced nitrogen & phosphorus for strong root development.",
    weight: "50 kg bag",
  },
  {
    id: 3,
    name: "Potash (MOP)",
    price: 1100,
    image:
      "https://images.unsplash.com/photo-1598514983318-2f64f8f4796c",
    description: "Improves crop resistance and enhances quality.",
    weight: "50 kg bag",
  },
  {
    id: 4,
    name: "Organic Vermicompost",
    price: 450,
    image:
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854",
    description: "Eco-friendly organic fertilizer for sustainable farming.",
    weight: "25 kg bag",
  },
];

const Fertilizers = () => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
    alert(`${product.name} added to cart`);
  };

  return (
    <>
    <Navbar/>
    <section className="bg-gradient-to-b from-[#f6f3e8] to-white py-20 px-6">

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-5xl font-serif font-bold text-[#1f2d1f] mb-4">
          Fertilizers & Nutrients
        </h2>
        <p className="text-lg text-slate-600">
          High-quality fertilizers trusted by farmers for better yields.
        </p>
      </div>

      {/* Product Grid */}
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {fertilizers.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition overflow-hidden"
          >
            {/* Image */}
            <img
              src={item.image}
              alt={item.name}
              className="h-52 w-full object-cover"
            />

            {/* Content */}
            <div className="p-6 flex flex-col justify-between h-56">
              <div>
                <h3 className="text-lg font-semibold text-[#1f2d1f] mb-1">
                  {item.name}
                </h3>
                <p className="text-sm text-slate-500 mb-2">
                  {item.weight}
                </p>
                <p className="text-sm text-slate-600 mb-4">
                  {item.description}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-green-800">
                  ₹{item.price}
                </span>
                <button
                  onClick={() => addToCart(item)}
                  className="bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-800 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="max-w-4xl mx-auto mt-16 bg-white p-6 rounded-2xl shadow-md border border-slate-100">
          <h3 className="text-xl font-semibold mb-4">
            Cart ({cart.length} items)
          </h3>

          <div className="space-y-2 mb-4">
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{item.name}</span>
                <span>₹{item.price}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>
              ₹{cart.reduce((acc, item) => acc + item.price, 0)}
            </span>
          </div>

          <button className="mt-4 w-full bg-yellow-500 text-white py-3 rounded-xl font-semibold hover:bg-yellow-600 transition">
            Proceed to Checkout
          </button>
        </div>
      )}
    </section>
    <Footer/>
    </>
  );
};

export default Fertilizers;
