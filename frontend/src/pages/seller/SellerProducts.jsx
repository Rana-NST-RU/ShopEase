import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function SellerProducts() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
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
            .get('/api/seller/products')
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
        try {
            await api.delete(`/api/products/${id}`);
            load();
        } catch (e) {
            alert('Failed to delete product: ' + (e.response?.data?.error || e.message));
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
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Products</h1>
                <p className="mt-2 text-gray-600">Manage your product catalog</p>
            </div>

            {/* Product Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-12">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    {editing ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                            </svg>
                            Edit Product
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="16"></line>
                                <line x1="8" y1="12" x2="16" y2="12"></line>
                            </svg>
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
                                rows="4"
                                placeholder="Product description..."
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2 flex gap-3">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors"
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
                                className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Products List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {items.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {item.imageUrl && (
                                                <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                                            )}
                                            <div>
                                                <div className="font-medium text-gray-900">{item.name}</div>
                                                <div className="text-sm text-gray-500 line-clamp-1">{item.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-lg">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-900 font-medium">${Number(item.price).toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-lg ${item.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => startEdit(item)}
                                            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => remove(item.id)}
                                            className="text-red-600 hover:text-red-700 font-medium text-sm"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
