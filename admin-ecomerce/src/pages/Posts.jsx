import { useState, useEffect, useMemo } from 'react';
import { getAllPosts, createPost, updatePost, deletePost } from '../api';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

const POST_TYPES = [
  { value: 'tin-tuc', label: '📰 Tin tức' },
  { value: 'kiem-dinh', label: '🔍 Kiểm định' },
  { value: 'feedback', label: '💬 Feedback' },
  { value: 'huong-dan', label: '📖 Hướng dẫn' },
];
const EMPTY = { title: '', image: '', content: '', type: 'tin-tuc', author: '' };

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { addToast } = useToast();
  const PER_PAGE = 10;

  useEffect(() => {
    getAllPosts(0, 100)
      .then(res => {
        const data = res.data || res.posts || res || [];
        setPosts(Array.isArray(data) ? data : []);
      })
      .catch(() => addToast('Không thể tải bài viết', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return posts.filter(p =>
      (!filterType || p.type === filterType) &&
      (p.title?.toLowerCase().includes(q) || p.author?.toLowerCase().includes(q))
    );
  }, [posts, search, filterType]);

  const paginated = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (p) => { setEditing(p); setForm({ title: p.title, image: p.image || '', content: p.content || '', type: p.type, author: p.author || '' }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.title || !form.type) { addToast('Tiêu đề và loại là bắt buộc', 'warning'); return; }
    setSaving(true);
    try {
      if (editing) {
        const res = await updatePost(editing._id, form);
        setPosts(prev => prev.map(p => p._id === editing._id ? { ...p, ...form } : p));
        addToast('Cập nhật bài viết thành công', 'success');
      } else {
        const res = await createPost(form);
        const newPost = res.data || res;
        setPosts(prev => [newPost, ...prev]);
        addToast('Tạo bài viết thành công', 'success');
      }
      setModalOpen(false);
    } catch (e) {
      addToast(e.message || 'Lỗi xảy ra', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deletePost(deleteId);
      setPosts(prev => prev.filter(p => p._id !== deleteId));
      addToast('Đã xóa bài viết', 'success');
      setDeleteId(null);
    } catch (e) {
      addToast(e.message || 'Xóa thất bại', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="page-enter">
      <div className="page-header">
        <div>
          <div className="page-title">📝 Bài viết</div>
          <div className="page-subtitle">{posts.length} bài viết</div>
        </div>
        <button id="create-post-btn" className="btn btn-primary" onClick={openCreate}>＋ Thêm bài viết</button>
      </div>

      <div className="table-container">
        <div className="table-header">
          <span className="table-title">Danh sách bài viết</span>
          <div className="table-actions">
            <select className="select-control" value={filterType} onChange={e => { setFilterType(e.target.value); setPage(0); }}>
              <option value="">Tất cả loại</option>
              {POST_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <div className="search-box">
              <span>🔍</span>
              <input id="posts-search" placeholder="Tìm bài viết..." value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-container"><div className="loading-spinner" /></div>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Bài viết</th>
                  <th>Loại</th>
                  <th>Tác giả</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr><td colSpan="5">
                    <div className="empty-state"><div className="empty-state-icon">📝</div><div className="empty-state-text">Chưa có bài viết</div></div>
                  </td></tr>
                ) : paginated.map(p => (
                  <tr key={p._id}>
                    <td>
                      <div className="product-cell">
                        {p.image && <img src={p.image} alt={p.title} className="product-thumb" onError={e => e.target.style.display = 'none'} />}
                        <div>
                          <div className="product-info-name">{p.title}</div>
                          <div className="product-info-meta">{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-cyan">{POST_TYPES.find(t => t.value === p.type)?.label || p.type}</span>
                    </td>
                    <td>{p.author || '—'}</td>
                    <td style={{ fontSize: 12 }}>{new Date(p.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button id={`edit-post-${p._id}`} className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}>✏️</button>
                        <button id={`delete-post-${p._id}`} className="btn btn-danger btn-sm" onClick={() => setDeleteId(p._id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="pagination">
                <span className="pagination-info">{page * PER_PAGE + 1}–{Math.min((page + 1) * PER_PAGE, filtered.length)} / {filtered.length}</span>
                <div className="pagination-controls">
                  <button className="page-btn" disabled={page === 0} onClick={() => setPage(p => p - 1)}>‹</button>
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => (
                    <button key={i} className={`page-btn ${i === page ? 'active' : ''}`} onClick={() => setPage(i)}>{i + 1}</button>
                  ))}
                  <button className="page-btn" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>›</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}
        title={editing ? '✏️ Sửa bài viết' : '＋ Bài viết mới'} size="lg"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Hủy</button>
            <button id="save-post-btn" className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? '⏳...' : '💾 Lưu'}</button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Tiêu đề *</label>
          <input className="form-control" placeholder="Tiêu đề bài viết..." value={form.title} onChange={e => set('title', e.target.value)} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Loại bài viết *</label>
            <select className="form-control" value={form.type} onChange={e => set('type', e.target.value)}>
              {POST_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Tác giả</label>
            <input className="form-control" placeholder="Jensy Team" value={form.author} onChange={e => set('author', e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">URL Ảnh</label>
          <input className="form-control" placeholder="https://..." value={form.image} onChange={e => set('image', e.target.value)} />
          {form.image && <img src={form.image} alt="" style={{ marginTop: 8, height: 80, borderRadius: 8, objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />}
        </div>
        <div className="form-group">
          <label className="form-label">Nội dung</label>
          <textarea className="form-control" rows={5} placeholder="Nội dung bài viết..." value={form.content} onChange={e => set('content', e.target.value)} />
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} message="Bạn có chắc muốn xóa bài viết này?" />
    </div>
  );
}
