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
    return <div className="py-10">Loading products...</div>;
  }

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Products Management</h1>
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
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete Out of Stock
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-lg p-4 mb-6 grid md:grid-cols-6 gap-3"
      >
        <input
          className="border p-2 rounded"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="number"
          step="0.01"
          className="border p-2 rounded"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <input
          className="border p-2 rounded"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        />
        <input
          type="number"
          className="border p-2 rounded"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value || '0', 10) })}
          required
        />
        <input
          className="border p-2 rounded"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
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
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        )}
        <textarea
          className="border p-2 rounded md:col-span-6"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
      </form>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((p) => (
          <div key={p.id} className="p-4 bg-white border rounded-lg">
            {p.imageUrl && (
              <img src={p.imageUrl} alt={p.name} className="w-full h-32 object-cover rounded mb-2" />
            )}
            <div className="font-medium mb-1">{p.name}</div>
            <div className="text-sm text-gray-600 mb-2">
              ${Number(p.price).toFixed(2)} · {p.category}
            </div>
            <div className="text-xs text-gray-500 mb-2">
              Stock: {p.stock} · Popularity: {p.popularity}
            </div>
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={() => {
                  if (editing === p.id) {
                    // If already editing this product, cancel edit
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
                  }
                }}
                className="flex-1 px-3 py-1.5 text-sm border rounded hover:bg-gray-100"
              >
                {editing === p.id ? 'Cancel' : 'Edit'}
              </button>
              <button
                type="button"
                onClick={() => remove(p.id)}
                disabled={deleting.has(p.id)}
                className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {deleting.has(p.id) ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


