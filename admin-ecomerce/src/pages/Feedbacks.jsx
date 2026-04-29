import { useState, useEffect, useMemo, useCallback } from 'react';
import { getAllFeedbacks, approveFeedback, deleteFeedback } from '../api';
import { useToast } from '../context/ToastContext';
import { useDataCache } from '../context/DataCacheContext';
import ConfirmDialog from '../components/ConfirmDialog';

const CACHE_KEY = 'feedbacks_list';

export default function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterApproved, setFilterApproved] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [approvingId, setApprovingId] = useState(null);
  const { addToast } = useToast();
  const { getCache, getCacheStale, setCache } = useDataCache();

  const fetchFeedbacks = useCallback(async () => {
    const cached = getCache(CACHE_KEY);
    if (cached) { setFeedbacks(cached); setLoading(false); return; }
    const stale = getCacheStale(CACHE_KEY);
    if (stale) { setFeedbacks(stale); setLoading(false); }
    else setLoading(true);
    try {
      const res = await getAllFeedbacks();
      const list = res.data || [];
      setCache(CACHE_KEY, list);
      setFeedbacks(list);
    } catch { addToast('Không thể tải feedback', 'error'); }
    finally { setLoading(false); }
  }, []); // eslint-disable-line

  useEffect(() => { fetchFeedbacks(); }, [fetchFeedbacks]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return feedbacks.filter(f =>
      (filterApproved === '' || (filterApproved === 'approved' ? f.isApproved : !f.isApproved)) &&
      (f.content?.toLowerCase().includes(q) || f.userName?.toLowerCase().includes(q))
    );
  }, [feedbacks, search, filterApproved]);

  const handleApprove = async (id) => {
    setApprovingId(id);
    try {
      await approveFeedback(id);
      const updated = feedbacks.map(f => f._id === id ? { ...f, isApproved: true } : f);
      setFeedbacks(updated);
      setCache(CACHE_KEY, updated);
      addToast('Đã duyệt feedback', 'success');
    } catch (e) {
      addToast(e.message || 'Lỗi xảy ra', 'error');
    } finally {
      setApprovingId(null);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteFeedback(deleteId);
      const updated = feedbacks.filter(f => f._id !== deleteId);
      setFeedbacks(updated);
      setCache(CACHE_KEY, updated);
      addToast('Đã xóa feedback', 'success');
      setDeleteId(null);
    } catch (e) {
      addToast(e.message || 'Xóa thất bại', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const pending = feedbacks.filter(f => !f.isApproved).length;

  return (
    <div className="page-enter">
      <div className="page-header">
        <div>
          <div className="page-title">💬 Feedback khách hàng</div>
          <div className="page-subtitle">
            {feedbacks.length} feedback —{' '}
            {pending > 0 && <span style={{ color: 'var(--accent-orange)' }}>{pending} chờ duyệt</span>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[['', 'Tất cả'], ['pending', '⏳ Chờ duyệt'], ['approved', '✅ Đã duyệt']].map(([v, l]) => (
            <button
              key={v}
              className={`btn btn-sm ${filterApproved === v ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterApproved(v)}
            >{l}</button>
          ))}
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <span className="table-title">Danh sách feedback</span>
          <div className="search-box">
            <span>🔍</span>
            <input
              id="feedbacks-search"
              placeholder="Tìm theo tên hoặc nội dung..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-container"><div className="loading-spinner" /></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Nội dung</th>
                <th>Ảnh</th>
                <th>Ngày gửi</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="6">
                  <div className="empty-state">
                    <div className="empty-state-icon">💬</div>
                    <div className="empty-state-text">Không có feedback nào</div>
                  </div>
                </td></tr>
              ) : filtered.map(f => (
                <tr key={f._id}>
                  <td>
                    <div className="product-cell">
                      {f.userAvatar
                        ? <img src={f.userAvatar} alt={f.userName} className="product-thumb" style={{ width: 36, height: 36, borderRadius: '50%' }} />
                        : <div className="avatar">{f.userName?.[0]?.toUpperCase() || '?'}</div>
                      }
                      <span className="td-main">{f.userName || 'Ẩn danh'}</span>
                    </div>
                  </td>
                  <td style={{ maxWidth: 260, fontSize: 13, color: 'var(--text-secondary)' }}>
                    <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {f.content || '—'}
                    </span>
                  </td>
                  <td>
                    {f.images && f.images.length > 0 ? (
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {f.images.map((url, i) => (
                          <img key={i} src={url} alt={`img-${i}`}
                            style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, border: '1px solid rgba(201,168,76,0.2)' }} />
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Không có</span>
                    )}
                  </td>
                  <td style={{ fontSize: 12 }}>{new Date(f.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <span className={`badge ${f.isApproved ? 'badge-green' : 'badge-yellow'}`}>
                      {f.isApproved ? '✅ Đã duyệt' : '⏳ Chờ duyệt'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {!f.isApproved && (
                        <button
                          id={`approve-feedback-${f._id}`}
                          className="btn btn-success btn-sm"
                          onClick={() => handleApprove(f._id)}
                          disabled={approvingId === f._id}
                          title="Duyệt feedback"
                        >
                          {approvingId === f._id ? '⏳' : '✅'}
                        </button>
                      )}
                      <button
                        id={`delete-feedback-${f._id}`}
                        className="btn btn-danger btn-sm"
                        onClick={() => setDeleteId(f._id)}
                        title="Xóa feedback"
                      >🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message="Bạn có chắc muốn xóa feedback này?"
      />
    </div>
  );
}
