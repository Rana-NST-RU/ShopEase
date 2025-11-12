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
    <div className="py-6">
      <h1 className="text-2xl font-semibold mb-6">Orders Management</h1>
      {items.length === 0 ? (
        <div className="text-center py-12 text-gray-600">No orders found</div>
      ) : (
        <div className="space-y-4">
          {items.map((o) => (
            <div key={o.id} className="p-4 bg-white border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold">Order #{o.id}</div>
                  <div className="text-sm text-gray-600">
                    Created: {new Date(o.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      o.status === 'PAID'
                        ? 'bg-green-100 text-green-800'
                        : o.status === 'CANCELLED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {o.status}
                  </span>
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="border p-1 rounded text-sm"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PAID">PAID</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                Items: {o.items?.length || 0} · Total: ${Number(o.total).toFixed(2)}
              </div>
              {o.items && o.items.length > 0 && (
                <div className="mt-2 space-y-1">
                  {o.items.map((item, idx) => (
                    <div key={idx} className="text-xs text-gray-500">
                      - {item.quantity}x Product #{item.productId} @ ${Number(item.price).toFixed(2)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


