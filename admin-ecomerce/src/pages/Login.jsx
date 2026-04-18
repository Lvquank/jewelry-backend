import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { loginApi } from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginApi(email, password);

      // Backend trả về: { status, access_token, refresh_token }
      if (res.status === 'ERR') {
        setError(res.message || 'Email hoặc mật khẩu không đúng.');
        return;
      }

      const token = res.access_token;
      if (!token) {
        setError('Không nhận được token từ server.');
        return;
      }

      // Decode JWT payload để lấy id + isAdmin
      let payload;
      try {
        payload = JSON.parse(atob(token.split('.')[1]));
      } catch {
        setError('Token không hợp lệ.');
        return;
      }

      if (!payload.isAdmin) {
        setError('Tài khoản này không có quyền admin.');
        return;
      }

      // Lấy thông tin user đầy đủ từ API
      const BASE_URL = 'https://jewelry-backend-xi.vercel.app';
      let userData = { _id: payload.id, isAdmin: payload.isAdmin, email };
      try {
        const userRes = await fetch(`${BASE_URL}/api/user/get-details/${payload.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const userJson = await userRes.json();
        if (userJson.data) userData = { ...userJson.data, isAdmin: payload.isAdmin };
      } catch (_) {
        // Fallback: dùng payload nếu API fails
      }

      login(userData, token);
      addToast('Đăng nhập thành công! Chào mừng trở lại 🎉', 'success');
      navigate('/');
    } catch (err) {
      setError(err.message || 'Email hoặc mật khẩu không đúng.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">💎</div>
          <h1>Jensy Admin</h1>
          <p>Đăng nhập vào hệ thống quản trị</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              id="login-email"
              type="email"
              className="form-control"
              placeholder="admin@gmail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <input
              id="login-password"
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button id="login-submit" type="submit" className="login-btn" disabled={loading}>
            {loading ? '⏳ Đang đăng nhập...' : '🔑 Đăng nhập'}
          </button>
          {error && (
            <div className="login-error">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
