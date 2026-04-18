import { useState, useEffect, useMemo } from 'react';
import { getAllUsers, deleteUser } from '../api';
import { useToast } from '../context/ToastContext';
import ConfirmDialog from '../components/ConfirmDialog';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(0);
  const PER_PAGE = 10;
  const { addToast } = useToast();

  useEffect(() => {
    getAllUsers()
      .then(res => setUsers(res.data || res.users || res || []))
      .catch(() => addToast('Không thể tải danh sách người dùng', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter(u =>
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.includes(q)
    );
  }, [users, search]);

  const paginated = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteUser(deleteId);
      setUsers(prev => prev.filter(u => u._id !== deleteId));
      addToast('Đã xóa người dùng', 'success');
      setDeleteId(null);
    } catch (e) {
      addToast(e.message || 'Xóa thất bại', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="page-enter">
      <div className="page-header">
        <div>
          <div className="page-title">👥 Người dùng</div>
          <div className="page-subtitle">{users.length} tài khoản đã đăng ký</div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <span className="table-title">Danh sách người dùng</span>
          <div className="search-box">
            <span>🔍</span>
            <input
              id="users-search"
              placeholder="Tìm theo tên, email, SĐT..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0); }}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-container"><div className="loading-spinner" /></div>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Người dùng</th>
                  <th>Email</th>
                  <th>Điện thoại</th>
                  <th>Vai trò</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr><td colSpan="7">
                    <div className="empty-state"><div className="empty-state-icon">👥</div><div className="empty-state-text">Không tìm thấy người dùng</div></div>
                  </td></tr>
                ) : paginated.map((u, i) => (
                  <tr key={u._id}>
                    <td style={{ color: 'var(--text-muted)' }}>{page * PER_PAGE + i + 1}</td>
                    <td>
                      <div className="product-cell">
                        <div className="avatar">{u.name?.[0]?.toUpperCase() || '?'}</div>
                        <div>
                          <div className="product-info-name">{u.name || '—'}</div>
                          <div className="product-info-meta">ID: {u._id?.slice(-8)}</div>
                        </div>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>{u.phone || '—'}</td>
                    <td>
                      <span className={`badge ${u.isAdmin ? 'badge-purple' : 'badge-gray'}`}>
                        {u.isAdmin ? '👑 Admin' : '👤 User'}
                      </span>
                    </td>
                    <td style={{ fontSize: 12 }}>{new Date(u.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td>
                      {!u.isAdmin && (
                        <button
                          id={`delete-user-${u._id}`}
                          className="btn btn-danger btn-sm"
                          onClick={() => setDeleteId(u._id)}
                        >🗑️</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="pagination">
                <span className="pagination-info">
                  Hiển thị {page * PER_PAGE + 1}–{Math.min((page + 1) * PER_PAGE, filtered.length)} / {filtered.length}
                </span>
                <div className="pagination-controls">
                  <button className="page-btn" disabled={page === 0} onClick={() => setPage(p => p - 1)}>‹</button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i} className={`page-btn ${i === page ? 'active' : ''}`} onClick={() => setPage(i)}>{i + 1}</button>
                  ))}
                  <button className="page-btn" disabled={page === totalPages - 1} onClick={() => setPage(p => p + 1)}>›</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message="Bạn có chắc muốn xóa người dùng này?"
      />
    </div>
  );
}
