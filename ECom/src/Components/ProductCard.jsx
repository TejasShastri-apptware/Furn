import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Plus } from 'lucide-react';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-xl bg-white transition-all hover:shadow-2xl hover:-translate-y-1">
            <Link to={`/products/${product.id}`} className="aspect-[4/5] overflow-hidden bg-stone-100">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />
            </Link>

            <div className="flex flex-1 flex-col p-5">
                <div className="mb-1 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                        {product.category}
                    </span>
                    <span className="text-sm font-medium text-stone-900">${product.price}</span>
                </div>

                <Link to={`/products/${product.id}`} className="mb-4 block">
                    <h3 className="text-lg font-serif font-bold text-stone-800 transition-colors hover:text-stone-600">
                        {product.name}
                    </h3>
                </Link>

                <button
                    onClick={() => addToCart(product)}
                    className="mt-auto flex w-full items-center justify-center space-x-2 rounded-lg bg-stone-900 py-3 text-sm font-bold text-white transition-all hover:bg-stone-800 active:scale-95"
                >
                    <Plus size={16} />
                    <span>Add to Cart</span>
                </button>
            </div>
        </div>
    );
}