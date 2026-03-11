import { useEffect, useState } from 'react';
import { apiFetch } from '../../api/api';
import { Users, AlertCircle, Clock } from 'lucide-react';

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        apiFetch('/users/org')
            .then(setUsers)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    const roleColors = {
        Admin: 'text-red-400 bg-red-400/10 border-red-400/20',
        Org_Level_Access: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
        Customer: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
        Dev: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center gap-3">
                <Users size={22} className="text-amber-400" />
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-white">Users</h1>
                    <p className="text-sm text-stone-500">{users.length} members in this organization</p>
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
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Phone</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading
                            ? [...Array(6)].map((_, i) => (
                                <tr key={i} className="border-b border-white/5 last:border-0">
                                    {[...Array(6)].map((_, j) => (
                                        <td key={j} className="px-6 py-4">
                                            <div className="h-4 rounded bg-white/5 animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
                                        </td>
                                    ))}
                                </tr>
                            ))
                            : users.map(u => (
                                <tr key={u.user_id} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-stone-500">{u.user_id}</td>
                                    <td className="px-6 py-4 font-semibold text-stone-200">{u.full_name}</td>
                                    <td className="px-6 py-4 text-stone-400">{u.email}</td>
                                    <td className="px-6 py-4 text-stone-400">{u.phone || '—'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${roleColors[u.role_name] || 'text-stone-400 bg-stone-400/10 border-stone-400/20'}`}>
                                            {u.role_name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-stone-500 text-xs">
                                        <div className="flex items-center gap-1">
                                            <Clock size={12} />
                                            {new Date(u.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                {!loading && users.length === 0 && (
                    <p className="px-6 py-8 text-center text-stone-500">No users found.</p>
                )}
            </div>
        </div>
    );
}
