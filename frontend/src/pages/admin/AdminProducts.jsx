import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function AdminProducts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(new Set());
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    stock: 0,
    imageUrl: '',
  });

  function load() {
    setLoading(true);
    api
      .get('/api/products', { params: { limit: 100 } })
      .then(({ data }) => setItems(data.items))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (editing) {
      await update(editing);
    } else {
      await create();
    }
  }

  async function create() {
    try {
      await api.post('/api/products', {
        ...form,
        price: Number(form.price),
        stock: parseInt(form.stock, 10),
      });
      setForm({
        name: '',
        price: '',
        category: '',
        description: '',
        stock: 0,
        imageUrl: '',
      });
      load();
    } catch (e) {
      alert('Failed to create product: ' + (e.response?.data?.error || e.message));
    }
  }

  function startEdit(product) {
    setEditing(product.id);
    setForm({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description,
      stock: product.stock,
      imageUrl: product.imageUrl || '',
    });
  }

  async function update(id) {
    try {
      await api.post(`/api/products/${id}`, {
        ...form,
        price: Number(form.price),
        stock: parseInt(form.stock, 10),
      });
      setEditing(null);
      setForm({
        name: '',
        price: '',
        category: '',
        description: '',
        stock: 0,
        imageUrl: '',
      });
      load();
    } catch (e) {
      alert('Failed to update product: ' + (e.response?.data?.error || e.message));
    }
  }

  async function remove(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    setDeleting((prev) => new Set(prev).add(id));
    try {
      await api.delete(`/api/products/${id}`);
      load();
    } catch (e) {
      const errorMessage = e.response?.data?.error || e.response?.data?.details || e.message || 'Failed to delete product';
      alert(errorMessage);
      console.error('Delete product error:', e);
    } finally {
      setDeleting((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Products Management</h1>
          <p className="mt-2 text-gray-600">Add, edit, or remove products from your catalog</p>
        </div>
        <button
          onClick={async () => {
            if (!confirm('Are you sure you want to delete all out-of-stock products?')) return;
            try {
              const { data } = await api.post('/api/admin/cleanup/out-of-stock');
              console.log('Delete response:', data);

              let message = data.message || `Deleted ${data.deleted} out-of-stock product(s)`;
              if (data.totalFound !== undefined) {
                message = `Found ${data.totalFound} product(s) with stock <= 0.\n${message}`;
              }
              if (data.productsWithOrders && data.productsWithOrders.length > 0) {
                message += `\n\nProducts with orders (not deleted):\n${data.productsWithOrders.map(p => `- ${p.name} (ID: ${p.id})`).join('\n')}`;
              }
              alert(message);
              load();
            } catch (e) {
              console.error('Delete error:', e);
              alert('Failed to delete out-of-stock products: ' + (e.response?.data?.error || e.response?.data?.details || e.message));
            }
          }}
          className="px-4 py-2 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
          Delete Out of Stock
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          {editing ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
              Edit Product
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
              Add New Product
            </>
          )}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                placeholder="e.g. Wireless Headphones"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  placeholder="0.00"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  placeholder="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value || '0', 10) })}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
                <span className="text-xs text-gray-500 ml-2">(Select or type custom)</span>
              </label>
              <input
                list="category-suggestions"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                placeholder="e.g. Electronics or type custom category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
              />
              <datalist id="category-suggestions">
                <option value="Electronics" />
                <option value="Fashion" />
                <option value="Home" />
                <option value="Fitness" />
              </datalist>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                placeholder="https://..."
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all h-32 resize-none"
                placeholder="Product description..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 btn-primary justify-center"
              >
                {editing ? 'Update Product' : 'Add Product'}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setForm({
                      name: '',
                      price: '',
                      category: '',
                      description: '',
                      stock: 0,
                      imageUrl: '',
                    });
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((p) => (
          <div key={p.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
            <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                </div>
              )}
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-semibold shadow-sm">
                Stock: {p.stock}
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900 line-clamp-1" title={p.name}>{p.name}</h3>
                  <p className="text-sm text-gray-500">{p.category}</p>
                </div>
                <span className="font-bold text-gray-900 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                  ${Number(p.price).toFixed(2)}
                </span>
              </div>

              <div className="mt-auto pt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (editing === p.id) {
                      setEditing(null);
                      setForm({
                        name: '',
                        price: '',
                        category: '',
                        description: '',
                        stock: 0,
                        imageUrl: '',
                      });
                    } else {
                      startEdit(p);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  {editing === p.id ? 'Editing...' : 'Edit'}
                </button>
                <button
                  type="button"
                  onClick={() => remove(p.id)}
                  disabled={deleting.has(p.id)}
                  className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
                  title="Delete Product"
                >
                  {deleting.has(p.id) ? (
                    <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


