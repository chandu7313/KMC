import re

file_path = './Frontend/src/pages/Marketplace/ProductDetail.jsx'
with open(file_path, 'r') as f:
    content = f.read()

# 1. Imports
content = content.replace(
    "} from 'lucide-react';\nimport { useNavigate } from 'react-router-dom';",
    "} from 'lucide-react';\nimport { useNavigate, useParams } from 'react-router-dom';\nimport axios from 'axios';\nimport { AppContext } from '../../context/AppContext';\nimport { toast } from 'react-toastify';"
)

# 2. Logic Setup
old_logic = '''const ProductDetail = () => {
    const [qty, setQty] = useState(1);
    const navigate = useNavigate();

    return ('''
new_logic = '''const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [qty, setQty] = useState(1);
    const { backendUrl, getCartCount, setCartItems } = React.useContext(AppContext);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState('');

    const fetchProductData = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post(`${backendUrl}/api/product/single`, { productId: id });
            if (data.success) {
                setProduct(data.product);
                if (data.product.images && data.product.images.length > 0) {
                    setImage(data.product.images[0]);
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (id) {
            fetchProductData();
        }
    }, [id]);

    if (loading) {
        return <div className="flex flex-col items-center justify-center h-screen w-full bg-[#f8fafc]"><div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div><p className="font-bold text-slate-500 uppercase tracking-widest text-xs">Loading Product...</p></div>;
    }

    if (!product) {
        return <div className="flex items-center justify-center h-screen w-full font-black text-2xl text-slate-800">Product not found.</div>;
    }

    return ('''
content = content.replace(old_logic, new_logic)

# 3. Breadcrumb Desktop
content = content.replace(
    '<span className="hover:text-[#1a1a1a] cursor-pointer transition-colors">Soil Nutrition</span>',
    '<span className="hover:text-[#1a1a1a] cursor-pointer transition-colors">{product.category}</span>'
)
content = content.replace(
    '<span className="text-[#1a1a1a]">Bio-Active Fertilizer NPK 10-10-10</span>',
    '<span className="text-[#1a1a1a]">{product.name}</span>'
)

# 4. Images Desktop
old_images = '''                            <div className="flex flex-col gap-4">
                                <div className="bg-[#f5f5f5] aspect-square rounded-[8px] flex items-center justify-center relative overflow-hidden group">
                                    <img src="https://placehold.co/800x800/e8f5e9/2e6b2e?font=Montserrat&text=BIO-ACTIVE\\nNPK+10-10-10" className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-[1.03]" alt="Fertilizer Bag" />
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="aspect-square bg-gray-50 rounded-[6px] border-[2px] border-[#4caf50] shadow-[0_0_0_1px_rgba(76,175,80,0.2)] overflow-hidden cursor-pointer">
                                        <img src="https://placehold.co/200x200/e8f5e9/2e6b2e?text=1" className="w-full h-full object-cover mix-blend-multiply" alt="Thumb" />
                                    </div>
                                    <div className="aspect-square bg-gray-50 rounded-[6px] border border-gray-200 overflow-hidden cursor-pointer hover:border-[#4caf50] transition-colors">
                                        <img src="https://placehold.co/200x200/f5f5f5/999?text=2" className="w-full h-full object-cover mix-blend-multiply opacity-70 hover:opacity-100 transition-opacity" alt="Thumb" />
                                    </div>
                                    <div className="aspect-square bg-gray-50 rounded-[6px] border border-gray-200 overflow-hidden cursor-pointer hover:border-[#4caf50] transition-colors">
                                        <img src="https://placehold.co/200x200/f5f5f5/999?text=3" className="w-full h-full object-cover mix-blend-multiply opacity-70 hover:opacity-100 transition-opacity" alt="Thumb" />
                                    </div>
                                    <div className="aspect-square bg-gray-50 rounded-[6px] border border-gray-200 relative flex items-center justify-center overflow-hidden cursor-pointer">
                                        <img src="https://placehold.co/200x200/f5f5f5/999?text=4" className="w-full h-full object-cover mix-blend-multiply opacity-40" alt="Thumb" />
                                        <span className="absolute inset-0 bg-[#1a1a1a]/70 flex items-center justify-center text-white font-black text-lg hover:bg-[#1a1a1a]/80 transition-colors">
                                            +2
                                        </span>
                                    </div>
                                </div>
                            </div>'''

new_images = '''                            <div className="flex flex-col gap-4">
                                <div className="bg-[#f5f5f5] aspect-square rounded-[8px] flex items-center justify-center relative overflow-hidden group">
                                    <img src={image} className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-[1.03]" alt={product.name} />
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                    {product.images?.map((img, idx) => (
                                        <div key={idx} onClick={() => setImage(img)} className={`aspect-square bg-gray-50 rounded-[6px] overflow-hidden cursor-pointer hover:border-[#4caf50] transition-colors ${img === image ? 'border-[2px] border-[#4caf50] shadow-[0_0_0_1px_rgba(76,175,80,0.2)]' : 'border border-gray-200'}`}>
                                            <img src={img} className="w-full h-full object-contain mix-blend-multiply opacity-70 hover:opacity-100 transition-opacity" alt={`Thumb ${idx}`} />
                                        </div>
                                    ))}
                                </div>
                            </div>'''
content = content.replace(old_images, new_images)

# 5. Right Details
content = content.replace('SOIL NUTRITION', '{product.category}')
content = content.replace(
    '''<h1 className="text-[36px] leading-[1.1] font-black text-[#1a1a1a] mb-4 tracking-tight">
                                    Bio-Active Nitrogen Complex NPK 10-10-10
                                </h1>''',
    '''<h1 className="text-[36px] leading-[1.1] font-black text-[#1a1a1a] mb-4 tracking-tight">
                                    {product.name}
                                </h1>'''
)
content = content.replace('EstatePure Pro', 'KMC')
content = content.replace('KMC-FERT-0092', '{product._id.slice(-8).toUpperCase()}')

content = content.replace(
    '''<div className="flex items-end gap-4 mb-4 mt-1">
                                    <span className="text-[44px] font-black text-[#1a1a1a] leading-none tracking-tight">₹12,450.00</span>
                                    <span className="text-[20px] text-[#999] line-through font-bold leading-none relative bottom-[6px]">₹14,999.00</span>
                                    <span className="bg-[#4caf50] text-[#ffffff] text-[12px] font-black px-2.5 py-1 flex items-center rounded-[4px] relative bottom-[6px] ml-1 uppercase tracking-wider">
                                        SAVE 17%
                                    </span>
                                </div>''',
    '''<div className="flex items-end gap-4 mb-4 mt-1">
                                    <span className="text-[44px] font-black text-[#1a1a1a] leading-none tracking-tight">₹{product.price}</span>
                                    {product.discountedPrice && product.discountedPrice !== product.price && (
                                        <>
                                            <span className="text-[20px] text-[#999] line-through font-bold leading-none relative bottom-[6px]">₹{product.price + 200}</span>
                                        </>
                                    )}
                                </div>'''
)

content = content.replace('In Stock <span className="text-[#666] font-bold ml-1 capitalize tracking-normal">(420 Units Available)</span>',
                         '{product.stock > 0 ? "In Stock" : "Out of Stock"} <span className="text-[#666] font-bold ml-1 capitalize tracking-normal">({product.stock} Units Available)</span>')

# Bulk order mock pricing (we leave the structure but change dynamic)
content = content.replace('₹12,450', '₹{product.price}')

# Description
old_desc = '''<div className="text-[#666] text-[15px] leading-[1.8] font-bold space-y-5">
                                        <p>
                                            Our Bio-Active Nitrogen Complex is engineered using advanced slow-release technology, ensuring that your crops receive a steady supply of essential nutrients throughout their critical growth phases. By utilizing a specialized bio-membrane coating, nitrogen loss through leaching and volatilization is reduced by up to 40%.
                                        </p>
                                        <p>
                                            Designed for a perfect 90-day cycle, this formula is highly recommended for staple crops such as wheat, paddy, and sugarcane. The balanced 10-10-10 NPK ratio provides an optimal foundation for root development, stalk strength, and yield maximization under diverse climatic conditions.
                                        </p>
                                    </div>'''
new_desc = '''<div className="text-[#666] text-[15px] leading-[1.8] font-bold space-y-5">
                                        <p>{product.description}</p>
                                    </div>'''
content = content.replace(old_desc, new_desc)

# Specifications
old_spec = '''<div className="flex flex-col text-[14px]">
                                            <div className="flex justify-between border-b border-gray-100 py-3">
                                                <span className="text-[#666] font-bold">Physical State</span>
                                                <span className="font-black text-[#1a1a1a]">Granular</span>
                                            </div>
                                            <div className="flex justify-between border-b border-gray-100 py-3">
                                                <span className="text-[#666] font-bold">Nutrient Ratio</span>
                                                <span className="font-black text-[#1a1a1a]">10:10:10</span>
                                            </div>
                                            <div className="flex justify-between border-b border-gray-100 py-3">
                                                <span className="text-[#666] font-bold">Organic Matter</span>
                                                <span className="font-black text-[#1a1a1a]">15% Min</span>
                                            </div>
                                            <div className="flex justify-between border-b border-gray-100 py-3">
                                                <span className="text-[#666] font-bold">Release Time</span>
                                                <span className="font-black text-[#1a1a1a]">90 Days</span>
                                            </div>
                                            <div className="flex justify-between border-b border-gray-100 py-3">
                                                <span className="text-[#666] font-bold">Weight per Bag</span>
                                                <span className="font-black text-[#1a1a1a]">50kg (Net)</span>
                                            </div>
                                            <div className="flex justify-between border-b border-gray-100 py-3">
                                                <span className="text-[#666] font-bold">Toxicity Level</span>
                                                <span className="font-black text-[#4caf50]">Low / Eco-Safe</span>
                                            </div>
                                        </div>'''
new_spec = '''<div className="flex flex-col text-[14px]">
                                            {product.specifications ? Object.entries(product.specifications).map(([key, value]) => (
                                                <div key={key} className="flex justify-between border-b border-gray-100 py-3">
                                                  <span className="text-[#666] font-bold">{key}</span>
                                                  <span className="font-black text-[#1a1a1a]">{value}</span>
                                                </div>
                                            )) : (
                                                <div className="py-3 text-[#666] font-bold">No particular specifications provided.</div>
                                            )}
                                        </div>'''
content = content.replace(old_spec, new_spec)

# Mobile Changes
old_mob_img = '''<img src="https://placehold.co/800x1000/e8f5e9/2e6b2e?font=Montserrat&text=WAREHOUSE+SACK" alt="Hero" className="w-full h-full object-cover mix-blend-multiply" />'''
new_mob_img = '''<img src={image} alt={product.name} className="w-full h-full object-contain" />'''
content = content.replace(old_mob_img, new_mob_img)

content = content.replace('<span className="text-[11px] text-[#666] font-black uppercase tracking-[0.1em]">Fertilizers</span>', '<span className="text-[11px] text-[#666] font-black uppercase tracking-[0.1em]">{product.category}</span>')
content = content.replace(
    '<h1 className="text-[26px] font-black text-[#1a1a1a] mb-2 leading-[1.15] tracking-tight">\n                                KMC Nitro-Max Organic Soluble\n                            </h1>',
    '<h1 className="text-[26px] font-black text-[#1a1a1a] mb-2 leading-[1.15] tracking-tight">\n                                {product.name}\n                            </h1>'
)

content = content.replace(
    'Brand: <span className="text-[#1a1a1a]">KMC Agro</span> <span className="text-gray-300">•</span> SKU: <span className="text-[#1a1a1a]">KMC-FERT-2024-NM</span>',
    'Brand: <span className="text-[#1a1a1a]">KMC</span> <span className="text-gray-300">•</span> SKU: <span className="text-[#1a1a1a]">{product._id.slice(-8).toUpperCase()}</span>'
)

content = content.replace(
    '''<div className="flex items-end gap-3 mb-6">
                                <span className="text-[32px] font-black text-[#1a1a1a] leading-none tracking-tight">₹1,450.00</span>
                                <span className="text-[16px] text-[#999] line-through font-bold relative bottom-[2px]">₹1,800.00</span>
                                <span className="bg-[#e8f5e9] text-[#4caf50] text-[11px] font-black px-2 py-1 flex items-center rounded-[4px] relative bottom-[4px] shadow-sm tracking-wider">
                                    (-19%)
                                </span>
                            </div>''',
    '''<div className="flex items-end gap-3 mb-6">
                                <span className="text-[32px] font-black text-[#1a1a1a] leading-none tracking-tight">₹{product.price}</span>
                            </div>'''
)

content = content.replace(
    '<Check size={14} strokeWidth={3}/> 200 bags available in stock',
    '<Check size={14} strokeWidth={3}/> {product.stock} units available in stock'
)

old_mob_desc = '''<p className="text-[14px] text-[#666] font-bold leading-[1.7]">
                                    Specially formulated for the Indian climate by KMC soil scientists, Nitro-Max ensures instant nitrogen availability. This organic soluble compound is perfect for intensive agriculture cycles, exceptionally benefiting paddy, sugarcane, and cotton by accelerating vegetative growth without soil acidification.
                                </p>'''
new_mob_desc = '''<p className="text-[14px] text-[#666] font-bold leading-[1.7]">
                                    {product.description}
                                </p>'''
content = content.replace(old_mob_desc, new_mob_desc)

with open(file_path, 'w') as f:
    f.write(content)

print("Patch applied to", file_path)
