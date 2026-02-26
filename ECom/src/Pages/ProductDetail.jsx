import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import ProductCard from '../Components/ProductCard';
import { ShoppingBag, ChevronLeft, Star, ShieldCheck, Truck } from 'lucide-react';

export default function ProductDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();

    const product = products.find(p => p.id === parseInt(id));

    if (!product) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                <h2 className="text-2xl font-serif font-black text-stone-900">Piece not found</h2>
                <Link to="/products" className="mt-4 text-stone-500 underline underline-offset-4">Return to collection</Link>
            </div>
        );
    }

    const relatedProducts = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    return (
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <Link to="/products" className="mb-12 inline-flex items-center space-x-2 text-sm font-bold uppercase tracking-widest text-stone-400 transition-colors hover:text-stone-900">
                <ChevronLeft size={16} />
                <span>Back to collection</span>
            </Link>

            <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
                {/* Product Image */}
                <div className="overflow-hidden rounded-3xl bg-stone-100">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                </div>

                {/* Product Info */}
                <div className="flex flex-col">
                    <div className="mb-8">
                        <div className="mb-2 flex items-center space-x-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-stone-400">{product.category}</span>
                            <span className="text-stone-300">|</span>
                            <div className="flex items-center text-amber-400">
                                <Star size={14} fill="currentColor" />
                                <Star size={14} fill="currentColor" />
                                <Star size={14} fill="currentColor" />
                                <Star size={14} fill="currentColor" />
                                <Star size={14} fill="currentColor" className="text-stone-200" />
                                <span className="ml-2 text-xs font-bold tracking-tight text-stone-400">(4.8 / 5)</span>
                            </div>
                        </div>
                        <h1 className="text-4xl font-serif font-black tracking-tighter text-stone-900 sm:text-5xl">{product.name}</h1>
                        <p className="mt-6 text-2xl font-medium text-stone-900">${product.price}</p>
                    </div>

                    <div className="mb-10 space-y-4 text-lg leading-relaxed text-stone-600">
                        <p>{product.description}</p>
                    </div>

                    <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="flex items-center space-x-4 rounded-2xl bg-stone-50 p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-stone-900 shadow-sm">
                                <Truck size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-stone-900">Fast Delivery</p>
                                <p className="text-xs text-stone-500">Free on orders over $500</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 rounded-2xl bg-stone-50 p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-stone-900 shadow-sm">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-stone-900">Warranty</p>
                                <p className="text-xs text-stone-500">2-Year Structural Warranty</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => addToCart(product)}
                        className="flex w-full items-center justify-center space-x-3 rounded-2xl bg-stone-900 py-6 text-lg font-bold text-white transition-all hover:bg-stone-800 active:scale-95"
                    >
                        <ShoppingBag size={20} />
                        <span>Securely Add to Cart</span>
                    </button>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section className="mt-32">
                    <h2 className="mb-12 font-serif text-3xl font-black tracking-tighter text-stone-900">You May Also Like</h2>
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {relatedProducts.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
