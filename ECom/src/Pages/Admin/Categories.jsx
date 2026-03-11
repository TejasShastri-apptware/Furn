import { useEffect, useState } from 'react';
import { apiFetch } from '../../api/api';
import { FolderOpen, AlertCircle } from 'lucide-react';

export default function CategoriesPage() {
    const [cats, setCats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        apiFetch('/categories')
            .then(setCats)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center gap-3">
                <FolderOpen size={22} className="text-amber-400" />
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-white">Categories</h1>
                    <p className="text-sm text-stone-500">{cats.length} categories defined</p>
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
                            <th className="px-6 py-4">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading
                            ? [...Array(5)].map((_, i) => (
                                <tr key={i} className="border-b border-white/5 last:border-0">
                                    {[...Array(3)].map((_, j) => (
                                        <td key={j} className="px-6 py-4">
                                            <div className="h-4 rounded bg-white/5 animate-pulse" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                            : cats.map(c => (
                                <tr key={c.category_id} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-stone-500">{c.category_id}</td>
                                    <td className="px-6 py-4 font-semibold text-stone-200">{c.category_name}</td>
                                    <td className="px-6 py-4 text-stone-400 max-w-xs truncate">{c.description || '—'}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                {!loading && cats.length === 0 && (
                    <p className="px-6 py-8 text-center text-stone-500">No categories found.</p>
                )}
            </div>
        </div>
    );
}
