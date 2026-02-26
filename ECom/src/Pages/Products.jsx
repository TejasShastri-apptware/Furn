import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from '../Components/ProductCard';
import { Search, Filter, X } from 'lucide-react';

export default function Products() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const selectedCategory = searchParams.get('category') || 'All';

    const categories = ['All', ...new Set(products.map(p => p.category))];

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory]);

    const handleCategoryClick = (category) => {
        if (category === 'All') {
            searchParams.delete('category');
        } else {
            searchParams.set('category', category);
        }
        setSearchParams(searchParams);
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-col space-y-8 md:flex-row md:items-end md:justify-between md:space-y-0 text-center md:text-left">
                <div className="flex-1">
                    <h1 className="text-4xl font-serif font-black tracking-tighter text-stone-900 sm:text-5xl">The Collection</h1>
                    <p className="mt-4 max-w-md text-stone-500">Explore our complete range of furniture, designed for every room in your modern home.</p>
                </div>

                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search pieces..."
                            className="w-full rounded-full border border-stone-200 bg-white py-3 pl-10 pr-6 text-sm focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 sm:w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center justify-center space-x-2 rounded-full border border-stone-200 bg-white px-6 py-3 text-sm font-bold text-stone-900 transition-all hover:bg-stone-50 active:scale-95 md:hidden"
                    >
                        <Filter size={18} />
                        <span>Filters</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-12 lg:flex-row">
                {/* Desktop Sidebar Filters */}
                <aside className="hidden w-64 flex-shrink-0 lg:block">
                    <div className="sticky top-32 space-y-10">
                        <div>
                            <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-stone-900">Categories</h3>
                            <div className="space-y-4">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => handleCategoryClick(category)}
                                        className={`block text-sm transition-colors hover:text-stone-900 ${selectedCategory === category ? 'font-bold text-stone-900 border-l-2 border-stone-900 pl-4' : 'text-stone-500 pl-4'
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl bg-stone-900 p-8 text-white">
                            <h4 className="mb-2 text-lg font-serif font-bold">Need Help?</h4>
                            <p className="mb-6 text-xs text-stone-400 leading-relaxed">Our design experts are ready to help you find the perfect piece.</p>
                            <button className="text-xs font-bold uppercase tracking-widest underline decoration-stone-600 underline-offset-8 hover:text-stone-200">Contact Us</button>
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-stone-200 p-12 text-center">
                            <div className="mb-6 rounded-full bg-stone-100 p-6 text-stone-400">
                                <Search size={48} />
                            </div>
                            <h3 className="text-xl font-serif font-bold text-stone-900">No pieces found</h3>
                            <p className="mt-2 max-w-xs text-stone-500">We couldn't find anything matching your search. Try adjusting your filters.</p>
                            <button
                                onClick={() => { setSearchQuery(''); handleCategoryClick('All') }}
                                className="mt-8 text-sm font-bold uppercase tracking-widest text-stone-900 underline underline-offset-8"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Filters Modal placeholder/logic */}
            {showFilters && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 md:hidden">
                    <div className="w-full rounded-t-3xl bg-white p-8">
                        <div className="mb-8 flex items-center justify-between">
                            <h3 className="text-xl font-serif font-bold">Filters</h3>
                            <button onClick={() => setShowFilters(false)}><X size={24} /></button>
                        </div>
                        <div className="mb-10">
                            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-stone-400">Categories</h4>
                            <div className="flex flex-wrap gap-3">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => { handleCategoryClick(category); setShowFilters(false) }}
                                        className={`rounded-full px-6 py-2 text-sm font-bold transition-all ${selectedCategory === category ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={() => setShowFilters(false)}
                            className="w-full rounded-xl bg-stone-900 py-4 font-bold text-white transition-all active:scale-95"
                        >
                            Show Results
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
