import { useEffect, useState } from 'react';
import { apiFetch } from '../../api/api';
import { ShoppingBag, AlertCircle } from 'lucide-react';

const STATUS_COLORS = {
    pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    paid: 'text-green-400 bg-green-400/10 border-green-400/20',
    shipped: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    cancelled: 'text-red-400 bg-red-400/10 border-red-400/20',
    refunded: 'text-stone-400 bg-stone-400/10 border-stone-400/20',
};

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        apiFetch('/orders/org-all')
            .then(setOrders)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    const statuses = ['all', 'pending', 'paid', 'shipped', 'cancelled', 'refunded'];
    const filtered = filter === 'all' ? orders : orders.filter(o => o.order_status === filter);
    const totalRevenue = orders.filter(o => o.order_status === 'paid').reduce((s, o) => s + Number(o.total_amount), 0);

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <ShoppingBag size={22} className="text-amber-400" />
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-white">Orders</h1>
                        <p className="text-sm text-stone-500">
                            {orders.length} total · ₹{totalRevenue.toLocaleString()} revenue (paid)
                        </p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            {/* Status filter tabs */}
            <div className="flex gap-1 flex-wrap">
                {statuses.map(s => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition-all ${filter === s
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'text-stone-500 hover:bg-white/5 hover:text-stone-300'
                            }`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/5 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="border-b border-white/5">
                        <tr className="text-left text-xs uppercase tracking-widest text-stone-500">
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">User ID</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Total</th>
                            <th className="px-6 py-4">Payment ID</th>
                            <th className="px-6 py-4">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading
                            ? [...Array(8)].map((_, i) => (
                                <tr key={i} className="border-b border-white/5 last:border-0">
                                    {[...Array(6)].map((_, j) => (
                                        <td key={j} className="px-6 py-4">
                                            <div className="h-4 rounded bg-white/5 animate-pulse" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                            : filtered.map(o => (
                                <tr key={o.order_id} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-stone-300">#{o.order_id}</td>
                                    <td className="px-6 py-4 text-stone-400">{o.user_id}</td>
                                    <td className="px-6 py-4">
                                        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_COLORS[o.order_status] || 'text-stone-400 bg-stone-400/10'}`}>
                                            {o.order_status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-white">₹{Number(o.total_amount).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-stone-500 font-mono text-xs">{o.payment_id || '—'}</td>
                                    <td className="px-6 py-4 text-stone-500 text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                {!loading && filtered.length === 0 && (
                    <p className="px-6 py-8 text-center text-stone-500">No orders for this filter.</p>
                )}
            </div>
        </div>
    );
}
