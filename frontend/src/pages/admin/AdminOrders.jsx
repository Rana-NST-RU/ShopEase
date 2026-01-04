import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function AdminOrders() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api
      .get('/api/orders')
      .then(({ data }) => setItems(data.items))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id, status) {
    try {
      await api.put(`/api/orders/${id}`, { status });
      load();
    } catch (e) {
      alert('Failed to update order status');
    }
  }

  if (loading) {
    return <div className="py-10">Loading orders...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-8">Orders Management</h1>
      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-xl font-medium text-gray-900">No orders found</p>
          <p className="mt-1 text-gray-500">Wait for customers to place orders.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {items.map((o) => (
            <div key={o.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-lg font-bold text-gray-900">Order #{o.id}</span>
                      <span className="text-sm text-gray-500 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                        {new Date(o.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {o.items?.length || 0} items · Total: <span className="font-semibold text-gray-900">${Number(o.total).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${o.status === 'PAID'
                        ? 'bg-green-100 text-green-700'
                        : o.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                      {o.status}
                    </div>
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className="text-sm border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 py-2 pl-3 pr-8 bg-gray-50 hover:bg-white transition-colors cursor-pointer"
                    >
                      <option value="PENDING">Mark Pending</option>
                      <option value="PAID">Mark Paid</option>
                      <option value="CANCELLED">Mark Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <div className="space-y-3">
                    {o.items && o.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm group">
                        <div className="flex items-center gap-3 text-gray-600">
                          <span className="font-medium text-gray-900">{item.quantity}x</span>
                          <span className="group-hover:text-primary-600 transition-colors">Product #{item.productId}</span>
                        </div>
                        <span className="font-medium text-gray-900">${Number(item.price).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


