import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Tổng quan', icon: '📊', path: '/', section: 'MENU' },
  { label: 'Sản phẩm', icon: '💍', path: '/products', section: 'QUẢN LÝ' },
  { label: 'Đơn hàng', icon: '📦', path: '/orders', section: 'QUẢN LÝ' },
  { label: 'Danh mục', icon: '📂', path: '/categories', section: 'QUẢN LÝ' },
  { label: 'Người dùng', icon: '👥', path: '/users', section: 'QUẢN LÝ' },
  { label: 'Bài viết', icon: '📝', path: '/posts', section: 'NỘI DUNG' },
  { label: 'Banner', icon: '🖼️', path: '/banners', section: 'NỘI DUNG' },
  { label: 'Feedback', icon: '💬', path: '/feedbacks', section: 'NỘI DUNG' },
  { label: 'Album Feedback', icon: '🖼️', path: '/feedback-albums', section: 'NỘI DUNG' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sections = [...new Set(navItems.map(i => i.section))];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon" style={{ background: 'none', padding: 0, width: 48, height: 48 }}>
          <img src="/logo.png" alt="The Q Dynasty Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <div className="sidebar-logo-text">
          <h2>The Q Dynasty</h2>
          <span>Quản trị hệ thống</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {sections.map(section => (
          <div key={section}>
            <div className="nav-section-label">{section}</div>
            {navItems.filter(i => i.section === section).map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name || 'Admin'}</div>
            <div className="sidebar-user-role">● Admin</div>
          </div>
          <button className="btn-logout" onClick={handleLogout} title="Đăng xuất">⏻</button>
        </div>
      </div>
    </aside>
  );
}
