import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  async function submit(e) {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      login(data.token, data.user);
      nav('/');
    } catch (e) {
      setError('Invalid credentials');
    }
  }
  return (
    <form onSubmit={submit} className="max-w-sm mx-auto bg-white p-6 rounded-lg border mt-8">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      <label className="block text-sm mb-1">Email</label>
      <input className="border p-2 w-full rounded mb-3" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      <label className="block text-sm mb-1">Password</label>
      <input className="border p-2 w-full rounded mb-3" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
      <button className="px-4 py-2 bg-black text-white rounded w-full">Login</button>
    </form>
  );
}


