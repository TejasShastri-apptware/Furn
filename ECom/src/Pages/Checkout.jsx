import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Lock, ArrowRight, CheckCircle } from 'lucide-react';

export default function Checkout() {
    const { cartTotal, cartCount, clearCart } = useCart();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            clearCart();
        }, 2000);
    };

    if (isSuccess) {
        return (
            <div className="flex min-h-[80vh] flex-col items-center justify-center space-y-8 px-4 text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <CheckCircle size={64} />
                </div>
                <div>
                    <h2 className="text-4xl font-serif font-black tracking-tighter text-stone-900">Order Confirmed</h2>
                    <p className="mt-4 text-stone-500">Thank you for choosing Furni. Your artisanal pieces are being prepared.</p>
                </div>
                <Link
                    to="/store"
                    className="inline-flex items-center space-x-2 rounded-full bg-stone-900 px-10 py-4 text-sm font-bold text-white transition-all hover:bg-stone-800 active:scale-95"
                >
                    <span>Return Home</span>
                    <ArrowRight size={18} />
                </Link>
            </div>
        );
    }

    if (cartCount === 0) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                <h2 className="text-2xl font-serif text-stone-900">Your bag is empty</h2>
                <Link to="/store/products" className="mt-4 text-stone-500 underline underline-offset-4">Return to collection</Link>
            </div>
        );
    }

    const shipping = cartTotal > 500 ? 0 : 45;
    const tax = cartTotal * 0.08;
    const total = cartTotal + shipping + tax;

    return (
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <Link to="/cart" className="mb-12 inline-flex items-center space-x-2 text-sm font-bold uppercase tracking-widest text-stone-400 transition-colors hover:text-stone-900">
                <ChevronLeft size={16} />
                <span>Back to bag</span>
            </Link>

            <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
                {/* Checkout Form */}
                <div>
                    <h1 className="mb-12 text-4xl font-serif font-black tracking-tighter text-stone-900">Shipping Details</h1>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">First Name</label>
                                <input required type="text" className="w-full border-b border-stone-200 bg-transparent py-3 text-stone-900 focus:border-stone-900 focus:outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Last Name</label>
                                <input required type="text" className="w-full border-b border-stone-200 bg-transparent py-3 text-stone-900 focus:border-stone-900 focus:outline-none" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Email Address</label>
                            <input required type="email" className="w-full border-b border-stone-200 bg-transparent py-3 text-stone-900 focus:border-stone-900 focus:outline-none" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Shipping Address</label>
                            <input required type="text" className="w-full border-b border-stone-200 bg-transparent py-3 text-stone-900 focus:border-stone-900 focus:outline-none" />
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">City</label>
                                <input required type="text" className="w-full border-b border-stone-200 bg-transparent py-3 text-stone-900 focus:border-stone-900 focus:outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">State</label>
                                <input required type="text" className="w-full border-b border-stone-200 bg-transparent py-3 text-stone-900 focus:border-stone-900 focus:outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Zip Code</label>
                                <input required type="text" className="w-full border-b border-stone-200 bg-transparent py-3 text-stone-900 focus:border-stone-900 focus:outline-none" />
                            </div>
                        </div>

                        <div className="pt-8">
                            <h2 className="mb-8 text-2xl font-serif font-black tracking-tighter text-stone-900">Payment</h2>
                            <div className="rounded-2xl bg-stone-50 p-6">
                                <div className="flex items-center space-x-3 text-stone-500">
                                    <Lock size={16} />
                                    <p className="text-xs font-bold uppercase tracking-widest">Secure encrypted transaction</p>
                                </div>
                                <div className="mt-6 flex flex-col space-y-4">
                                    <input placeholder="Card Number" className="w-full rounded-lg border border-stone-200 bg-white p-4 text-sm focus:border-stone-900 focus:outline-none" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input placeholder="MM/YY" className="w-full rounded-lg border border-stone-200 bg-white p-4 text-sm focus:border-stone-900 focus:outline-none" />
                                        <input placeholder="CVC" className="w-full rounded-lg border border-stone-200 bg-white p-4 text-sm focus:border-stone-900 focus:outline-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            disabled={isSubmitting}
                            type="submit"
                            className="flex w-full items-center justify-center space-x-3 rounded-2xl bg-stone-900 py-6 text-lg font-bold text-white transition-all hover:bg-stone-800 active:scale-95 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            ) : (
                                <>
                                    <span>Complete Purchase</span>
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Totals Summary */}
                <div>
                    <div className="rounded-3xl bg-stone-50 p-10 lg:sticky lg:top-32">
                        <h2 className="mb-8 text-xl font-serif font-bold text-stone-900">Summary</h2>
                        <div className="space-y-6 text-sm text-stone-500">
                            <div className="flex justify-between">
                                <span>Subtotal ({cartCount} items)</span>
                                <span className="font-bold text-stone-900">${cartTotal}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span className="font-bold text-stone-900">${shipping}</span>
                            </div>
                            <div className="flex justify-between border-b border-stone-200 pb-6">
                                <span>Tax</span>
                                <span className="font-bold text-stone-900">${tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between pt-2">
                                <span className="text-lg font-bold text-stone-900">Total</span>
                                <span className="text-3xl font-black text-stone-900">${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
