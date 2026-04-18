import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Categories from './pages/Categories';
import Posts from './pages/Posts';
import Banners from './pages/Banners';
import Reviews from './pages/Reviews';
import Contacts from './pages/Contacts';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0d0d1a' }}>
      <div style={{ borderRadius: '50%', width: 40, height: 40, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#7c6fff', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (!user.isAdmin) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user?.isAdmin ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
      <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
      <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
      <Route path="/categories" element={<PrivateRoute><Categories /></PrivateRoute>} />
      <Route path="/posts" element={<PrivateRoute><Posts /></PrivateRoute>} />
      <Route path="/banners" element={<PrivateRoute><Banners /></PrivateRoute>} />
      <Route path="/reviews" element={<PrivateRoute><Reviews /></PrivateRoute>} />
      <Route path="/contacts" element={<PrivateRoute><Contacts /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
