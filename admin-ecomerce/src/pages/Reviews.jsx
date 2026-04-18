import { useState, useEffect, useMemo } from 'react';
import { getAllReviews, approveReview, deleteReview } from '../api';
import { useToast } from '../context/ToastContext';
import ConfirmDialog from '../components/ConfirmDialog';

const Stars = ({ rating }) => (
  <div className="star-rating">
    {[1, 2, 3, 4, 5].map(s => (
      <span key={s} className={`star ${s <= rating ? '' : 'empty'}`}>★</span>
    ))}
  </div>
);

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterApproved, setFilterApproved] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [approvingId, setApprovingId] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    getAllReviews()
      .then(res => setReviews(res.data || res.reviews || res || []))
      .catch(() => addToast('Không thể tải đánh giá', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return reviews.filter(r =>
      (filterApproved === '' || (filterApproved === 'approved' ? r.isApproved : !r.isApproved)) &&
      (r.comment?.toLowerCase().includes(q) || r.user?.name?.toLowerCase().includes(q))
    );
  }, [reviews, search, filterApproved]);

  const handleApprove = async (id) => {
    setApprovingId(id);
    try {
      await approveReview(id);
      setReviews(prev => prev.map(r => r._id === id ? { ...r, isApproved: true } : r));
      addToast('Đã duyệt đánh giá', 'success');
    } catch (e) {
      addToast(e.message || 'Lỗi xảy ra', 'error');
    } finally {
      setApprovingId(null);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteReview(deleteId);
      setReviews(prev => prev.filter(r => r._id !== deleteId));
      addToast('Đã xóa đánh giá', 'success');
      setDeleteId(null);
    } catch (e) {
      addToast(e.message || 'Xóa thất bại', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const pending = reviews.filter(r => !r.isApproved).length;

  return (
    <div className="page-enter">
      <div className="page-header">
        <div>
          <div className="page-title">⭐ Đánh giá</div>
          <div className="page-subtitle">
            {reviews.length} đánh giá — {pending > 0 && <span style={{ color: 'var(--accent-orange)' }}>{pending} chờ duyệt</span>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[['', 'Tất cả'], ['pending', '⏳ Chờ duyệt'], ['approved', '✅ Đã duyệt']].map(([v, l]) => (
            <button key={v} className={`btn btn-sm ${filterApproved === v ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilterApproved(v)}>{l}</button>
          ))}
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <span className="table-title">Danh sách đánh giá</span>
          <div className="search-box">
            <span>🔍</span>
            <input id="reviews-search" placeholder="Tìm đánh giá..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <div className="loading-container"><div className="loading-spinner" /></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Sản phẩm</th>
                <th>Đánh giá</th>
                <th>Nội dung</th>
                <th>Ngày viết</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="7">
                  <div className="empty-state"><div className="empty-state-icon">⭐</div><div className="empty-state-text">Không có đánh giá nào</div></div>
                </td></tr>
              ) : filtered.map(r => (
                <tr key={r._id}>
                  <td>
                    <div className="product-cell">
                      <div className="avatar">{r.user?.name?.[0]?.toUpperCase() || '?'}</div>
                      <span className="td-main">{r.user?.name || 'Ẩn danh'}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 13 }}>{r.product?.name || r.productId || '—'}</td>
                  <td><Stars rating={r.rating} /></td>
                  <td style={{ maxWidth: 200, fontSize: 13, color: 'var(--text-secondary)' }}>
                    <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {r.comment || '—'}
                    </span>
                  </td>
                  <td style={{ fontSize: 12 }}>{new Date(r.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <span className={`badge ${r.isApproved ? 'badge-green' : 'badge-yellow'}`}>
                      {r.isApproved ? '✅ Đã duyệt' : '⏳ Chờ duyệt'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {!r.isApproved && (
                        <button id={`approve-review-${r._id}`} className="btn btn-success btn-sm" onClick={() => handleApprove(r._id)} disabled={approvingId === r._id}>
                          {approvingId === r._id ? '⏳' : '✅'}
                        </button>
                      )}
                      <button id={`delete-review-${r._id}`} className="btn btn-danger btn-sm" onClick={() => setDeleteId(r._id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} message="Bạn có chắc muốn xóa đánh giá này?" />
    </div>
  );
}
