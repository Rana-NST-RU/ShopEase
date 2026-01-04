import { useEffect, useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import api from '../api/axios';
import Pagination from '../components/Pagination.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      setTimeout(() => setMessage(''), 5000);
    }
  }, [location]);

  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '12', 10);
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const order = searchParams.get('order') || 'desc';

  useEffect(() => {
    setLoading(true);
    const params = { page, limit, q, category, sortBy, order };
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    api
      .get('/api/products', { params })
      .then(({ data }) => {
        setProducts(data.items);
        setTotal(data.total);
      })
      .finally(() => setLoading(false));
  }, [page, limit, q, category, minPrice, maxPrice, sortBy, order]);

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    if (key !== 'page') next.set('page', '1');
    setSearchParams(next);
  }

  return (
    <div className="pb-20">
      {message && (
        <div className="fixed top-24 right-4 z-50 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl shadow-lg border-l-4 border-l-green-500 animate-fade-in flex items-center gap-3">
          <span className="text-xl">✅</span>
          <p className="font-medium">{message}</p>
        </div>
      )}

      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4 tracking-tight">Our Products</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our wide range of premium products. Use the filters below to find exactly what you're looking for.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <input
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
              placeholder="Search products..."
              value={q}
              onChange={(e) => updateParam('q', e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>

          <div className="relative">
            <select
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none appearance-none cursor-pointer"
              value={category}
              onChange={(e) => updateParam('category', e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home">Home & Living</option>
              <option value="Fitness">Fitness & Sports</option>
            </select>
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9h16"></path><path d="M4 15h16"></path><path d="M10 3L8 21"></path><path d="M16 3l-2 18"></path></svg>
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => updateParam('minPrice', e.target.value)}
            />
            <input
              type="number"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => updateParam('maxPrice', e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <select
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
              value={sortBy}
              onChange={(e) => updateParam('sortBy', e.target.value)}
            >
              <option value="createdAt">Newest</option>
              <option value="price">Price</option>
              <option value="popularity">Popularity</option>
            </select>
            <select
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
              value={order}
              onChange={(e) => updateParam('order', e.target.value)}
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>
        </div>

        {(q || category || minPrice || maxPrice) && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                const next = new URLSearchParams();
                next.set('page', '1');
                setSearchParams(next);
              }}
              className="px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse">
              <div className="aspect-[4/3] bg-gray-100 rounded-xl mb-4" />
              <div className="space-y-3">
                <div className="h-4 bg-gray-100 rounded w-1/4" />
                <div className="h-6 bg-gray-100 rounded w-3/4" />
                <div className="h-6 bg-gray-100 rounded w-1/2" />
                <div className="h-10 bg-gray-100 rounded-xl w-full mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
          <div className="mt-10">
            <Pagination page={page} total={total} pageSize={limit} onPage={(n) => updateParam('page', String(n))} />
          </div>
        </>
      )}
    </div>
  );
}


