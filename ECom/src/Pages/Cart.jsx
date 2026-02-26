import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

export default function Cart() {
    const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

    if (cartCount === 0) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-8 px-4 text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-stone-100 text-stone-300">
                    <ShoppingBag size={48} />
                </div>
                <div>
                    <h2 className="text-3xl font-serif font-black tracking-tighter text-stone-900">Your cart is empty</h2>
                    <p className="mt-4 text-stone-500">Looks like you haven't added any yet.</p>
                </div>
                <Link
                    to="/products"
                    className="inline-flex items-center space-x-2 rounded-full bg-stone-900 px-10 py-4 text-sm font-bold text-white transition-all hover:bg-stone-800 active:scale-95"
                >
                    <span>Explore Collection</span>
                    <ArrowRight size={18} />
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <h1 className="mb-12 text-4xl font-serif font-black tracking-tighter text-stone-900">Your Shopping Bag</h1>

            <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
                {/* Cart Items List */}
                <div className="lg:col-span-2">
                    <div className="space-y-8">
                        {cart.map((item) => (
                            <div key={item.id} className="group flex flex-col space-y-6 border-b border-stone-200 pb-8 sm:flex-row sm:space-x-8 sm:space-y-0">
                                <div className="h-48 w-full flex-shrink-0 overflow-hidden rounded-2xl bg-stone-100 sm:w-48">
                                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                </div>

                                <div className="flex flex-1 flex-col justify-between">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-xl font-serif font-bold text-stone-900">{item.name}</h3>
                                            <p className="mt-1 text-sm text-stone-500 uppercase tracking-widest">{item.category}</p>
                                        </div>
                                        <p className="text-lg font-bold text-stone-900">${item.price}</p>
                                    </div>

                                    <div className="flex items-end justify-between pt-6">
                                        <div className="flex items-center space-x-4 rounded-full border border-stone-200 bg-white p-1">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-stone-50 hover:text-stone-900 disabled:opacity-30"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-8 text-center text-sm font-bold text-stone-900">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-stone-50 hover:text-stone-900"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="flex items-center space-x-2 text-sm font-bold uppercase tracking-widest text-stone-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                            <span>Remove</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="relative">
                    <div className="sticky top-32 rounded-3xl bg-stone-50 p-10">
                        <h2 className="mb-8 text-xl font-serif font-bold text-stone-900">Order Summary</h2>

                        <div className="space-y-6 border-b border-stone-200 pb-8 text-sm text-stone-500">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="font-bold text-stone-900">${cartTotal}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Estimated Shipping</span>
                                <span className="font-bold text-stone-900">{cartTotal > 500 ? 'FREE' : '$45'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Estimated Tax</span>
                                <span className="font-bold text-stone-900">${(cartTotal * 0.08).toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="flex justify-between pt-8">
                            <span className="text-lg font-bold text-stone-900">Total</span>
                            <div className="text-right">
                                <p className="text-2xl font-black text-stone-900">${(cartTotal + (cartTotal > 500 ? 0 : 45) + (cartTotal * 0.08)).toFixed(2)}</p>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Including VAT</p>
                            </div>
                        </div>

                        <Link
                            to="/checkout"
                            className="mt-10 flex w-full items-center justify-center space-x-3 rounded-2xl bg-stone-900 py-5 font-bold text-white transition-all hover:bg-stone-800 active:scale-95"
                        >
                            <span>Proceed to Checkout</span>
                            <ArrowRight size={18} />
                        </Link>

                        <div className="mt-8 flex items-center justify-center space-x-4">
                            <img src="https://img.icons8.com/color/48/000000/visa.png" className="h-6 opacity-50 contrast-0" alt="Visa" />
                            <img src="https://img.icons8.com/color/48/000000/mastercard.png" className="h-6 opacity-50 contrast-0" alt="Mastercard" />
                            <img src="https://img.icons8.com/color/48/000000/amex.png" className="h-6 opacity-50 contrast-0" alt="Amex" />
                            <img src="https://img.icons8.com/color/48/000000/paypal.png" className="h-6 opacity-50 contrast-0" alt="Paypal" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
