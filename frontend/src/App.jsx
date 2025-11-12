import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Navbar from './components/Navbar.jsx';

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute role="ADMIN"><AdminProducts /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute role="ADMIN"><AdminOrders /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}


