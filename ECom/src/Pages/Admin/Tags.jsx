import { useEffect, useState } from 'react';
import { apiFetch } from '../../api/api';
import { Tag, AlertCircle } from 'lucide-react';

const TYPE_COLORS = {
    room: 'text-blue-400 bg-blue-400/10',
    style: 'text-purple-400 bg-purple-400/10',
    material: 'text-amber-400 bg-amber-400/10',
    height: 'text-teal-400 bg-teal-400/10',
    length: 'text-teal-400 bg-teal-400/10',
    width: 'text-teal-400 bg-teal-400/10',
    general: 'text-stone-400 bg-stone-400/10',
    color: 'text-pink-400 bg-pink-400/10',
};

export default function TagsPage() {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');

    useEffect(() => {
        apiFetch('/tags/org')
            .then(setTags)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    const types = ['all', ...Object.keys(TYPE_COLORS)];
    const filtered = typeFilter === 'all' ? tags : tags.filter(t => t.tag_type === typeFilter);

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center gap-3">
                <Tag size={22} className="text-amber-400" />
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-white">Tags</h1>
                    <p className="text-sm text-stone-500">{tags.length} tags in this organization</p>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            {/* Type filter pills */}
            <div className="flex gap-1 flex-wrap">
                {types.map(t => (
                    <button
                        key={t}
                        onClick={() => setTypeFilter(t)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition-all ${typeFilter === t
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'text-stone-500 hover:bg-white/5 hover:text-stone-300'
                            }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* Tags as cards */}
            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />
                    ))}
                </div>
            ) : filtered.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {filtered.map(tag => (
                        <div key={tag.tag_id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3 hover:bg-white/8 transition-colors">
                            <div>
                                <p className="text-sm font-semibold text-stone-200">{tag.tag_name}</p>
                                <p className="text-[10px] font-mono text-stone-600">id:{tag.tag_id}</p>
                            </div>
                            <span className={`rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase ${TYPE_COLORS[tag.tag_type] || 'text-stone-400 bg-stone-400/10'}`}>
                                {tag.tag_type}
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-stone-500 text-sm">No tags for this filter.</p>
            )}
        </div>
    );
}
