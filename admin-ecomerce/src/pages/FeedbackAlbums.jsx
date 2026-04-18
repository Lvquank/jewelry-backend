import { useState, useEffect, useMemo } from 'react';
import { getAllFeedbackAlbums, deleteFeedbackAlbum } from '../api';
import { useToast } from '../context/ToastContext';
import ConfirmDialog from '../components/ConfirmDialog';

export default function FeedbackAlbums() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    getAllFeedbackAlbums()
      .then(res => setAlbums(res.data || []))
      .catch(() => addToast('Không thể tải album feedback', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return albums.filter(a =>
      a.title?.toLowerCase().includes(q) ||
      a.description?.toLowerCase().includes(q) ||
      a.author?.toLowerCase().includes(q)
    );
  }, [albums, search]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteFeedbackAlbum(deleteId);
      setAlbums(prev => prev.filter(a => a._id !== deleteId));
      addToast('Đã xóa album', 'success');
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
          <div className="page-title">🖼️ Album Feedback</div>
          <div className="page-subtitle">{albums.length} album — ảnh feedback thực tế từ khách hàng</div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <span className="table-title">Danh sách album</span>
          <div className="search-box">
            <span>🔍</span>
            <input
              id="feedback-albums-search"
              placeholder="Tìm album..."
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
                <th>Thumbnail</th>
                <th>Tiêu đề</th>
                <th>Tác giả</th>
                <th>Số ảnh</th>
                <th>Thứ tự</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="7">
                  <div className="empty-state">
                    <div className="empty-state-icon">🖼️</div>
                    <div className="empty-state-text">Không có album nào</div>
                  </div>
                </td></tr>
              ) : filtered.map(a => (
                <tr key={a._id}>
                  <td>
                    {a.thumbnail
                      ? <img src={a.thumbnail} alt={a.title} style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 6 }} />
                      : <div style={{ width: 64, height: 48, background: 'rgba(201,168,76,0.1)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🖼️</div>
                    }
                  </td>
                  <td>
                    <div className="td-main" style={{ fontWeight: 600 }}>{a.title}</div>
                    {a.description && (
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        {a.description.slice(0, 60)}{a.description.length > 60 ? '...' : ''}
                      </div>
                    )}
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                      slug: {a.slug}
                    </div>
                  </td>
                  <td style={{ fontSize: 13 }}>{a.author || '—'}</td>
                  <td>
                    <span style={{
                      padding: '2px 10px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                      background: 'rgba(201,168,76,0.12)', color: '#C9A84C'
                    }}>
                      {a.images?.length || 0} ảnh
                    </span>
                  </td>
                  <td style={{ fontSize: 13, textAlign: 'center' }}>{a.sortOrder}</td>
                  <td>
                    <span className={`badge ${a.isActive ? 'badge-green' : 'badge-gray'}`}>
                      {a.isActive ? '✅ Hiển thị' : '🚫 Ẩn'}
                    </span>
                  </td>
                  <td>
                    <button
                      id={`delete-album-${a._id}`}
                      className="btn btn-danger btn-sm"
                      onClick={() => setDeleteId(a._id)}
                      title="Xóa album"
                    >🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Preview thumbnails grid */}
      {!loading && filtered.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div className="table-container">
            <div className="table-header">
              <span className="table-title">🖼️ Preview ảnh các album</span>
            </div>
            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              {filtered.map(a => (
                <div key={a._id}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10 }}>
                    {a.title} <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 400 }}>({a.images?.length} ảnh)</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {(a.images || []).map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`${a.title} ${i + 1}`}
                        style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(201,168,76,0.2)' }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message="Bạn có chắc muốn xóa album này? Ảnh trên Cloudinary sẽ không bị xóa."
      />
    </div>
  );
}
