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
    <div>
      {message && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded">
          {message}
        </div>
      )}
      <h1 className="text-2xl font-semibold mb-6">Products</h1>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <input
          className="border p-2 rounded"
          placeholder="Search products..."
          value={q}
          onChange={(e) => updateParam('q', e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Category"
          value={category}
          onChange={(e) => updateParam('category', e.target.value)}
        />
        <input
          type="number"
          className="border p-2 rounded"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => updateParam('minPrice', e.target.value)}
        />
        <input
          type="number"
          className="border p-2 rounded"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => updateParam('maxPrice', e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={sortBy}
          onChange={(e) => updateParam('sortBy', e.target.value)}
        >
          <option value="createdAt">Newest</option>
          <option value="price">Price</option>
          <option value="popularity">Popularity</option>
        </select>
        <select
          className="border p-2 rounded"
          value={order}
          onChange={(e) => updateParam('order', e.target.value)}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
        {(q || category || minPrice || maxPrice) && (
          <button
            onClick={() => {
              const next = new URLSearchParams();
              next.set('page', '1');
              setSearchParams(next);
            }}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Clear Filters
          </button>
        )}
      </div>
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border rounded-lg bg-white animate-pulse">
              <div className="aspect-[4/3] bg-gray-100"/>
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-2/3" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {products.length === 0 ? (
            <div className="text-center text-gray-500 py-12">No products match your filters.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
          <Pagination page={page} total={total} pageSize={limit} onPage={(n) => updateParam('page', String(n))} />
        </>
      )}
    </div>
  );
}


