import { useEffect, useState } from 'react';
import { apiFetch } from '../../api/api';
import { Package, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        apiFetch('/products')
            .then(setProducts)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    const stockStatus = (qty) => {
        if (qty === 0) return { label: 'Out of Stock', cls: 'text-red-400' };
        if (qty < 10) return { label: `Low (${qty})`, cls: 'text-yellow-400' };
        return { label: qty, cls: 'text-green-400' };
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center gap-3">
                <Package size={22} className="text-amber-400" />
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-white">Products</h1>
                    <p className="text-sm text-stone-500">{products.length} products in catalog</p>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            <div className="rounded-2xl border border-white/5 bg-white/5 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="border-b border-white/5">
                        <tr className="text-left text-xs uppercase tracking-widest text-stone-500">
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Discount</th>
                            <th className="px-6 py-4">Stock</th>
                            <th className="px-6 py-4">Active</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading
                            ? [...Array(8)].map((_, i) => (
                                <tr key={i} className="border-b border-white/5 last:border-0">
                                    {[...Array(7)].map((_, j) => (
                                        <td key={j} className="px-6 py-4">
                                            <div className="h-4 rounded bg-white/5 animate-pulse" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                            : products.map(p => {
                                const stock = stockStatus(p.stock_quantity);
                                return (
                                    <tr key={p.product_id} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-stone-500">{p.product_id}</td>
                                        <td className="px-6 py-4 font-semibold text-stone-200 max-w-[200px] truncate">{p.name}</td>
                                        <td className="px-6 py-4 text-stone-400">{p.category_name}</td>
                                        <td className="px-6 py-4 font-semibold text-white">₹{Number(p.price).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-stone-400">
                                            {p.discount_price ? `₹${Number(p.discount_price).toLocaleString()}` : '—'}
                                        </td>
                                        <td className={`px-6 py-4 font-semibold ${stock.cls}`}>{stock.label}</td>
                                        <td className="px-6 py-4">
                                            {p.is_active
                                                ? <CheckCircle size={16} className="text-green-400" />
                                                : <XCircle size={16} className="text-stone-600" />
                                            }
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
                {!loading && products.length === 0 && (
                    <p className="px-6 py-8 text-center text-stone-500">No products found.</p>
                )}
            </div>
        </div>
    );
}
