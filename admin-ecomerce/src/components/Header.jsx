import { useLocation } from 'react-router-dom';

const routeTitles = {
  '/': { title: 'Dashboard', subtitle: 'Xem tổng quan hệ thống' },
  '/products': { title: 'Sản phẩm', subtitle: 'Quản lý danh sách sản phẩm' },
  '/orders': { title: 'Đơn hàng', subtitle: 'Quản lý đơn hàng khách' },
  '/categories': { title: 'Danh mục', subtitle: 'Quản lý danh mục sản phẩm' },
  '/users': { title: 'Người dùng', subtitle: 'Quản lý tài khoản khách hàng' },
  '/posts': { title: 'Bài viết', subtitle: 'Quản lý nội dung blog & tin tức' },
  '/banners': { title: 'Banner', subtitle: 'Quản lý banner hiển thị' },
  '/reviews': { title: 'Đánh giá', subtitle: 'Duyệt và quản lý đánh giá sản phẩm' },
  '/contacts': { title: 'Liên hệ', subtitle: 'Xử lý yêu cầu liên hệ từ khách hàng' },
};

export default function Header() {
  const { pathname } = useLocation();
  const info = routeTitles[pathname] || { title: 'Admin', subtitle: '' };
  const now = new Date();
  const dateStr = now.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <header className="header">
      <div className="header-left">
        <div>
          <div className="header-title">{info.title}</div>
          <div className="header-subtitle">{info.subtitle}</div>
        </div>
      </div>
      <div className="header-right">
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{dateStr}</div>
      </div>
    </header>
  );
}
