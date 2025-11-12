import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get('/api/admin/analytics')
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="py-10">Loading analytics...</div>;
  }

  return (
    <div className="py-6">
      <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>
      <div className="flex gap-4 mb-8">
        <Link
          to="/admin/products"
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Manage Products
        </Link>
        <Link
          to="/admin/orders"
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Manage Orders
        </Link>
      </div>
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 bg-white border rounded-lg">
            <div className="text-2xl font-bold mb-1">{stats.users}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
          <div className="p-6 bg-white border rounded-lg">
            <div className="text-2xl font-bold mb-1">{stats.products}</div>
            <div className="text-sm text-gray-600">Total Products</div>
          </div>
          <div className="p-6 bg-white border rounded-lg">
            <div className="text-2xl font-bold mb-1">{stats.orders}</div>
            <div className="text-sm text-gray-600">Paid Orders</div>
          </div>
          <div className="p-6 bg-white border rounded-lg">
            <div className="text-2xl font-bold mb-1">
              ${Number(stats.revenue).toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
        </div>
      )}
    </div>
  );
}


