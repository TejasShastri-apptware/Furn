import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Search, Menu } from 'lucide-react';

export default function Navbar() {
    const { cartCount } = useCart();

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white/90 backdrop-blur-md">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link to="/" className="text-2xl font-serif font-black tracking-tighter text-stone-900">
                    FURN
                </Link>

                <div className="hidden md:flex space-x-10 text-sm font-semibold uppercase tracking-widest text-stone-500">
                    <Link to="/" className="hover:text-stone-900 transition-colors">Home</Link>
                    <Link to="/products" className="hover:text-stone-900 transition-colors">Collection</Link>
                    <Link to="/about" className="hover:text-stone-900 transition-colors">About</Link>
                </div>

                <div className="flex items-center space-x-6">
                    <button className="text-stone-500 hover:text-stone-900 transition-transform active:scale-95">
                        <Search size={22} />
                    </button>

                    <Link to="/cart" className="group relative text-stone-500 hover:text-stone-900 transition-transform active:scale-95">
                        <ShoppingCart size={22} />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-stone-900 text-[10px] font-bold text-white shadow-lg">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    <button className="md:hidden text-stone-500">
                        <Menu size={22} />
                    </button>
                </div>
            </div>
        </nav>
    );
}
