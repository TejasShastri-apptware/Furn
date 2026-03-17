import { useEffect, useState, useCallback } from 'react';
import { apiFetch } from '../../api/api';
import {
    ShoppingBag, Search, Hash, TrendingUp, Clock,
    CreditCard, Calendar, User, Package, MapPin,
    CheckCircle2, XCircle
} from 'lucide-react';
import {
    ErrorBanner, Drawer, PageHeader, StatCard, EmptyState,
    OrderStatusBadge, SectionLabel, Toast
} from './adminComponents';

// ─── Order Detail Drawer ──────────────────────────────────────
function OrderDetailDrawer({ order, onClose, onStatusChange }) {
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');
    const [actionError, setActionError] = useState('');

    // Track current status locally so UI updates immediately after action
    const [currentStatus, setCurrentStatus] = useState(order.order_status);

    useEffect(() => {
        apiFetch(`/orders/details/${order.order_id}`)
            .then(setDetail)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, [order.order_id]);

    const handleStatusUpdate = async (newStatus) => {
        setActionLoading(true);
        setActionError('');
        try {
            await apiFetch(`/orders/${order.order_id}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status: newStatus }),
            });
            setCurrentStatus(newStatus);
            onStatusChange(order.order_id, newStatus);
        } catch (e) {
            setActionError(e.message);
        } finally {
            setActionLoading(false);
        }
    };

    const date = new Date(order.created_at);
    const o = detail?.order || order;

    const isPending = currentStatus === 'pending';

    const footer = isPending ? (
        <div className="space-y-2">
            {actionError && <ErrorBanner error={actionError} />}
            <div className="flex gap-3">
                <button
                    disabled={actionLoading}
                    onClick={() => handleStatusUpdate('completed')}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-bold text-white hover:bg-green-500 active:scale-95 transition-all disabled:opacity-50"
                >
                    <CheckCircle2 size={16} />
                    Approve Order
                </button>
                <button
                    disabled={actionLoading}
                    onClick={() => handleStatusUpdate('cancelled')}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-bold text-white hover:bg-red-500 active:scale-95 transition-all disabled:opacity-50"
                >
                    <XCircle size={16} />
                    Cancel Order
                </button>
            </div>
        </div>
    ) : (
        <div className="text-center text-xs text-stone-600 py-1">
            This order is <span className="font-semibold capitalize text-stone-400">{currentStatus}</span> and cannot be modified.
        </div>
    );

    return (
        <Drawer
            title={`Order #${order.order_id}`}
            subtitle={`Placed on ${date.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}`}
            icon={ShoppingBag}
            iconColor="text-green-400"
            iconBg="bg-green-500/15"
            onClose={onClose}
            footer={footer}
        >
            <div className="space-y-6">
                {/* Status + amount hero */}
                <div className="rounded-2xl bg-white/3 p-5 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-stone-600 mb-1">Total Amount</p>
                        <p className="text-3xl font-black text-white">₹{Number(order.total_amount).toLocaleString('en-IN')}</p>
                    </div>
                    <div className="text-right space-y-2">
                        <OrderStatusBadge status={currentStatus} />
                        <p className="text-[10px] text-stone-600 flex items-center gap-1 justify-end">
                            <Calendar size={10} />{date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>

                {/* Meta grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-start gap-2 rounded-xl bg-white/3 p-3">
                        <User size={13} className="mt-0.5 shrink-0 text-stone-500" />
                        <div><p className="text-[9px] uppercase tracking-wider text-stone-600">Customer</p><p className="text-xs font-semibold text-stone-300">User #{order.user_id}</p></div>
                    </div>
                    <div className="flex items-start gap-2 rounded-xl bg-white/3 p-3">
                        <CreditCard size={13} className="mt-0.5 shrink-0 text-stone-500" />
                        <div className="min-w-0"><p className="text-[9px] uppercase tracking-wider text-stone-600">Payment ID</p><p className="text-xs font-semibold text-stone-300 font-mono truncate">{order.payment_id || 'Not paid'}</p></div>
                    </div>
                    {o?.address_line1 && (
                        <div className="col-span-2 flex items-start gap-2 rounded-xl bg-white/3 p-3">
                            <MapPin size={13} className="mt-0.5 shrink-0 text-stone-500" />
                            <div><p className="text-[9px] uppercase tracking-wider text-stone-600">Shipping Address</p>
                                <p className="text-xs font-semibold text-stone-300">{o.address_line1}, {o.city}, {o.postal_code}, {o.country}</p></div>
                        </div>
                    )}
                </div>

                {/* Order Items */}
                <div className="space-y-3">
                    <SectionLabel icon={Package} label={`Order Items ${detail?.items ? `(${detail.items.length})` : ''}`} />
                    {loading && <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />)}</div>}
                    <ErrorBanner error={error} />
                    {!loading && detail?.items?.length === 0 && <p className="text-sm text-stone-600 text-center py-4">No items found.</p>}
                    <div className="space-y-2">
                        {(detail?.items || []).map((item, i) => (
                            <div key={i} className="flex items-center justify-between rounded-xl bg-white/3 px-4 py-3">
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-stone-200 truncate">{item.name}</p>
                                    <p className="text-xs text-stone-500">Qty: {item.quantity} × ₹{Number(item.unit_price).toLocaleString('en-IN')}</p>
                                </div>
                                <p className="text-sm font-bold text-white ml-4 shrink-0">
                                    ₹{(Number(item.unit_price) * item.quantity).toLocaleString('en-IN')}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Subtotal breakdown */}
                    {detail?.items && (
                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 flex items-center justify-between mt-4">
                            <p className="text-sm font-semibold text-amber-400">Order Total</p>
                            <p className="text-lg font-black text-amber-400">₹{Number(order.total_amount).toLocaleString('en-IN')}</p>
                        </div>
                    )}
                </div>
            </div>
        </Drawer>
    );
}

// ─── Order Card ───────────────────────────────────────────────
function OrderCard({ o, onClick }) {
    const date = new Date(o.created_at);
    return (
        <div onClick={() => onClick(o)}
            className="group cursor-pointer flex flex-col rounded-2xl border border-white/8 bg-stone-900 p-5 hover:border-green-500/25 hover:shadow-lg hover:shadow-green-500/5 transition-all duration-300 gap-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-[10px] text-stone-600 font-mono uppercase tracking-wide">Order</p>
                    <p className="text-lg font-black text-white font-mono">#{o.order_id}</p>
                </div>
                <OrderStatusBadge status={o.order_status} />
            </div>
            <div className="h-px bg-white/5" />
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider mb-0.5">Total</p>
                    <p className="text-2xl font-black tracking-tight text-white">₹{Number(o.total_amount).toLocaleString('en-IN')}</p>
                </div>
                <div className="rounded-2xl bg-green-500/10 p-3"><ShoppingBag size={20} className="text-green-400" /></div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-stone-500"><User size={11} /><span>User #{o.user_id}</span></div>
                <div className="flex items-center gap-1.5 text-stone-500"><Calendar size={11} /><span>{date.toLocaleDateString('en-IN')}</span></div>
                <div className="col-span-2 flex items-center gap-1.5 text-stone-600 truncate"><CreditCard size={11} /><span className="font-mono truncate">{o.payment_id || 'Not paid'}</span></div>
            </div>
            <div className="text-[10px] text-stone-600 group-hover:text-stone-400 transition-colors">Click to view &amp; manage →</div>
        </div>
    );
}

// Only values from the schema ENUM
const STATUS_LIST = ['all', 'pending', 'completed', 'cancelled'];

// ─── Main Page ────────────────────────────────────────────────
export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        apiFetch('/orders/org-all')
            .then(setOrders)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    // Called by the drawer after a successful status change
    const handleStatusChange = useCallback((orderId, newStatus) => {
        setOrders(prev =>
            prev.map(o => o.order_id === orderId ? { ...o, order_status: newStatus } : o)
        );
        // Also patch the selectedOrder so the drawer header stays consistent
        setSelectedOrder(prev => prev ? { ...prev, order_status: newStatus } : prev);
        const label = newStatus === 'completed' ? 'approved' : 'cancelled';
        setToast({ msg: `Order #${orderId} ${label} successfully.`, type: newStatus === 'completed' ? 'success' : 'error' });
    }, []);

    // Revenue from completed orders only (the schema's "done" state)
    const totalRevenue = orders
        .filter(o => o.order_status === 'completed')
        .reduce((s, o) => s + Number(o.total_amount), 0);
    const pendingCount = orders.filter(o => o.order_status === 'pending').length;

    const filtered = orders
        .filter(o => filter === 'all' || o.order_status === filter)
        .filter(o => search === '' ||
            String(o.order_id).includes(search) ||
            String(o.user_id).includes(search) ||
            (o.payment_id || '').toLowerCase().includes(search.toLowerCase())
        );

    return (
        <div className="min-h-full bg-stone-950 p-8 space-y-7">
            <PageHeader
                icon={ShoppingBag} iconColor="text-green-400" iconBg="bg-green-500/15"
                title="Orders"
                subtitle={`${orders.length} total orders across this organization`}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard icon={Hash} label="Total Orders" value={orders.length} color="border-amber-500/20 text-amber-400" />
                <StatCard icon={TrendingUp} label="Revenue (Completed)" value={`₹${totalRevenue.toLocaleString('en-IN')}`} color="border-green-500/20 text-green-400" />
                <StatCard icon={Clock} label="Pending Approval" value={pendingCount} color="border-yellow-500/20 text-yellow-400" />
            </div>

            <ErrorBanner error={error} />

            <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-wrap gap-1">
                    {STATUS_LIST.map(s => {
                        const count = orders.filter(o => o.order_status === s).length;
                        return (
                            <button key={s} onClick={() => setFilter(s)}
                                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold capitalize transition-all ${filter === s
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                    : 'text-stone-500 hover:bg-white/5 hover:text-stone-300 border border-transparent'
                                    }`}>
                                {s}
                                {s !== 'all' && count > 0 && (
                                    <span className="ml-1.5 rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] font-bold">{count}</span>
                                )}
                            </button>
                        );
                    })}
                </div>
                <div className="relative ml-auto">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-600" />
                    <input className="w-56 rounded-xl border border-white/10 bg-white/5 pl-8 pr-4 py-2 text-sm text-white placeholder-stone-600 outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition"
                        placeholder="Order ID, user, payment…"
                        value={search} onChange={e => setSearch(e.target.value)} />
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="rounded-2xl bg-stone-900 p-5 space-y-4 animate-pulse border border-white/5">
                            <div className="flex justify-between"><div className="h-7 w-24 rounded-lg bg-white/5" /><div className="h-6 w-20 rounded-full bg-white/5" /></div>
                            <div className="h-px bg-white/5" />
                            <div className="h-8 w-32 rounded-lg bg-white/5" />
                            <div className="grid grid-cols-2 gap-2"><div className="h-5 rounded bg-white/5" /><div className="h-5 rounded bg-white/5" /></div>
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <EmptyState icon={ShoppingBag} message={orders.length === 0 ? 'No orders yet.' : 'No orders match this filter.'} />
            ) : (
                <>
                    <p className="text-xs text-stone-600 -mb-2">Showing {filtered.length} of {orders.length} orders</p>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map(o => <OrderCard key={o.order_id} o={o} onClick={setSelectedOrder} />)}
                    </div>
                </>
            )}

            {selectedOrder && (
                <OrderDetailDrawer
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onStatusChange={handleStatusChange}
                />
            )}

            {toast && (
                <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />
            )}
        </div>
    );
}
