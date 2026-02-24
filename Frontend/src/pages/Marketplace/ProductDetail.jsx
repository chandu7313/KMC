import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import { ArrowLeft, ShoppingCart, Star, Box, ShieldCheck, Truck, Clock, ChevronLeft, ChevronRight, Package, ArrowRight } from 'lucide-react';

const ProductDetail = () => {
    const { id } = useParams();
    const { backendUrl, isLoggedin, userData, getCartData } = useContext(AppContext);
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [currentImgIndex, setCurrentImgIndex] = useState(0);

    const fetchProduct = async () => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/product/single`, { productId: id });
            if (data.success) {
                setProduct(data.product);
                fetchRelatedProducts(data.product);
            } else {
                toast.error(data.message);
                navigate('/marketplace');
            }
        } catch (error) {
            toast.error(error.message);
            navigate('/marketplace');
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedProducts = async (currentProduct) => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/product/list`);
            if (data.success) {
                const filtered = data.products
                    .filter(p => p.category === currentProduct.category && p._id !== currentProduct._id)
                    .slice(0, 4);
                setRelatedProducts(filtered);
            }
        } catch (error) {
            console.error("Error fetching related products", error);
        }
    };

    useEffect(() => {
        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    const handleAddToCart = async () => {
        if (!isLoggedin) {
            toast.info("Please login to add items to cart");
            return;
        }
        
        if (quantity > product.stock) {
            toast.error("Requested quantity exceeds available stock");
            return;
        }

        setAddingToCart(true);
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.post(`${backendUrl}/api/cart/add`, {
                userId: userData._id,
                itemId: product._id
            });

            if (data.success) {
                toast.success("Added to cart successfully");
                getCartData();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8fafc]">
                <Navbar />
                <div className="flex flex-col items-center justify-center pt-40 space-y-4">
                    <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Loading Details...</p>
                </div>
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24">
            <Navbar />
            
            <main className="max-w-6xl mx-auto px-4 pt-24">
                <button 
                    onClick={() => navigate('/marketplace')}
                    className="group flex items-center gap-3 text-slate-400 hover:text-emerald-700 transition-colors font-black text-[10px] uppercase tracking-widest mb-6"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform"/> Back to Marketplace
                </button>

                <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden flex flex-col lg:flex-row">
                    
                    {/* Image Section */}
                    <div className="lg:w-1/2 bg-slate-50 p-4 sm:p-8 flex flex-col items-center justify-center relative">
                        {/* Categories Badge */}
                        <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                            <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] font-black text-slate-900 shadow-sm uppercase tracking-widest">
                                {product.category}
                            </span>
                        </div>

                        {/* Main Image with Navigation Arrows */}
                        <div className="relative w-full aspect-square flex items-center justify-center group/slider">
                            {product.images.length > 1 && (
                                <>
                                    <button 
                                        onClick={() => setCurrentImgIndex(prev => prev === 0 ? product.images.length - 1 : prev - 1)}
                                        className="absolute left-0 z-20 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg text-slate-800 hover:bg-white hover:scale-110 transition-all opacity-0 group-hover/slider:opacity-100"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button 
                                        onClick={() => setCurrentImgIndex(prev => prev === product.images.length - 1 ? 0 : prev + 1)}
                                        className="absolute right-0 z-20 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg text-slate-800 hover:bg-white hover:scale-110 transition-all opacity-0 group-hover/slider:opacity-100"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </>
                            )}
                            <img 
                                src={product.images[currentImgIndex]} 
                                alt={product.name} 
                                className="w-full max-w-xs h-auto object-contain drop-shadow-2xl mix-blend-multiply transition-all duration-500 transform scale-95 group-hover/slider:scale-100" 
                            />
                        </div>

                        {/* Thumbnails */}
                        {product.images.length > 1 && (
                            <div className="flex gap-2 mt-6 overflow-x-auto no-scrollbar pb-2">
                                {product.images.map((img, index) => (
                                    <button 
                                        key={index}
                                        onClick={() => setCurrentImgIndex(index)}
                                        className={`w-12 h-12 rounded-lg border-2 transition-all overflow-hidden bg-white shrink-0
                                            ${currentImgIndex === index ? 'border-emerald-600 scale-105 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={img} className="w-full h-full object-contain p-1.5" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="lg:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col">
                        <div className="space-y-3 mb-6">
                            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                                {product.name}
                            </h1>
                            
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-lg text-xs font-black">
                                    <Star size={14} className="fill-yellow-500 text-yellow-500" />
                                    {product.ratings > 0 ? product.ratings.toFixed(1) : 'New'} 
                                    <span className="text-yellow-700/50 font-medium ml-1">({product.numReviews})</span>
                                </div>
                                
                                {product.stock > 0 ? (
                                    <span className="flex items-center gap-2 text-emerald-600 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-lg">
                                        <Box size={14} /> In Stock ({product.stock})
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2 text-rose-600 font-bold text-xs bg-rose-50 px-2.5 py-1 rounded-lg">
                                        <Box size={14} /> Out of Stock
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-slate-100">
                            <span className="text-3xl font-black text-slate-900">
                                ₹{product.discountedPrice || product.price}
                            </span>
                            {product.discountedPrice && (
                                <span className="text-lg font-bold text-slate-300 line-through">
                                    ₹{product.price}
                                </span>
                            )}
                        </div>

                        <div className="space-y-4 mb-8 flex-1">
                            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">About this product</h3>
                            <p className="text-slate-500 font-medium leading-relaxed text-sm">
                                {product.description}
                            </p>
                        </div>

                        {/* Action Area */}
                        <div className="bg-slate-50 rounded-[24px] p-6 border border-slate-100 mt-auto">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1.5 w-full sm:w-28 shadow-sm">
                                    <button 
                                        className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center font-black text-slate-400 hover:text-slate-900 transition-colors"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                    >-</button>
                                    <span className="flex-1 text-center font-black text-slate-900 text-sm">{quantity}</span>
                                    <button 
                                        className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center font-black text-slate-400 hover:text-slate-900 transition-colors"
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        disabled={quantity >= product.stock}
                                    >+</button>
                                </div>
                                
                                <button 
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0 || addingToCart}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:shadow-none text-white font-black py-3 rounded-xl shadow-lg shadow-emerald-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-base"
                                >
                                    {addingToCart ? 'Adding...' : (
                                        <>
                                            <ShoppingCart size={18} />
                                            Add to Cart
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-2 gap-3 pt-6 mt-6 border-t border-slate-200">
                                <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-wider">
                                    <ShieldCheck size={16} className="text-emerald-600"/> Genuine
                                </div>
                                <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-wider">
                                    <Truck size={16} className="text-emerald-600"/> Shipping
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16">
                        <div className="flex items-center justify-between mb-8">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Related Products</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">More from {product.category}</p>
                            </div>
                            <button 
                                onClick={() => navigate('/marketplace')}
                                className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                            >
                                View All <ArrowRight size={12} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            {relatedProducts.map(p => (
                                <div 
                                    key={p._id} 
                                    onClick={() => navigate(`/product/${p._id}`)}
                                    className="bg-white rounded-[32px] p-2 shadow-sm border border-slate-100 hover:shadow-2xl hover:border-emerald-100 transition-all duration-500 group cursor-pointer flex flex-col h-full"
                                >
                                    <div className="relative aspect-square rounded-[24px] bg-slate-50 overflow-hidden mb-3">
                                        <img 
                                            src={p.images[0]} 
                                            alt={p.name} 
                                            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700 ease-out" 
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black text-slate-900 shadow-sm uppercase tracking-widest">
                                                {p.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="px-4 py-3 flex-1 flex flex-col justify-between">
                                        <h3 className="font-black text-slate-900 text-xs leading-snug line-clamp-2 mb-3">
                                            {p.name}
                                        </h3>
                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="text-base font-black text-slate-900">
                                                ₹{p.discountedPrice || p.price}
                                            </span>
                                            <div className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg text-[10px] font-black">
                                                ★ {p.ratings > 0 ? p.ratings.toFixed(1) : 'New'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ProductDetail;
