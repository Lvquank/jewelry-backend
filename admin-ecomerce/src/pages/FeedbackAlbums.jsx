import { useState, useEffect, useMemo } from 'react';
import { getAllFeedbackAlbums, createFeedbackAlbum, updateFeedbackAlbum, deleteFeedbackAlbum } from '../api';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

const EMPTY = {
  title: '',
  slug: '',
  description: '',
  author: '',
  thumbnail: '',
  images: [],
  sortOrder: 0,
  isActive: true,
};

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export default function FeedbackAlbums() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [imagesInput, setImagesInput] = useState(''); // mỗi dòng 1 URL
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { addToast } = useToast();

  const loadAlbums = () => {
    setLoading(true);
    getAllFeedbackAlbums()
      .then(res => setAlbums(res.data || []))
      .catch(() => addToast('Không thể tải album feedback', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadAlbums(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return albums.filter(a =>
      a.title?.toLowerCase().includes(q) ||
      a.description?.toLowerCase().includes(q) ||
      a.author?.toLowerCase().includes(q)
    );
  }, [albums, search]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setImagesInput('');
    setModalOpen(true);
  };

  const openEdit = (a) => {
    setEditing(a);
    setForm({
      title: a.title || '',
      slug: a.slug || '',
      description: a.description || '',
      author: a.author || '',
      thumbnail: a.thumbnail || '',
      images: a.images || [],
      sortOrder: a.sortOrder ?? 0,
      isActive: a.isActive !== false,
    });
    setImagesInput((a.images || []).join('\n'));
    setModalOpen(true);
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleTitleChange = (val) => {
    setForm(f => ({
      ...f,
      title: val,
      slug: f.slug === '' || f.slug === slugify(f.title) ? slugify(val) : f.slug,
    }));
  };

  const handleSave = async () => {
    if (!form.title) { addToast('Tiêu đề là bắt buộc', 'warning'); return; }
    if (!form.slug) { addToast('Slug là bắt buộc', 'warning'); return; }

    const imagesList = imagesInput
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean);

    const payload = {
      ...form,
      images: imagesList,
      sortOrder: Number(form.sortOrder) || 0,
    };

    setSaving(true);
    try {
      if (editing) {
        await updateFeedbackAlbum(editing._id, payload);
        addToast('Cập nhật album thành công', 'success');
      } else {
        await createFeedbackAlbum(payload);
        addToast('Tạo album thành công', 'success');
      }
      setModalOpen(false);
      loadAlbums();
    } catch (e) {
      addToast(e.message || 'Lỗi xảy ra', 'error');
    } finally {
      setSaving(false);
    }
  };

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
        <button id="create-album-btn" className="btn btn-primary" onClick={openCreate}>
          ＋ Tạo Album
        </button>
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
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        id={`edit-album-${a._id}`}
                        className="btn btn-secondary btn-sm"
                        onClick={() => openEdit(a)}
                        title="Sửa album"
                      >✏️</button>
                      <button
                        id={`delete-album-${a._id}`}
                        className="btn btn-danger btn-sm"
                        onClick={() => setDeleteId(a._id)}
                        title="Xóa album"
                      >🗑️</button>
                    </div>
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

      {/* Modal tạo / sửa album */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? '✏️ Sửa Album Feedback' : '＋ Tạo Album Feedback'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Hủy</button>
            <button id="save-album-btn" className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? '⏳ Đang lưu...' : '💾 Lưu'}
            </button>
          </>
        }
      >
        {/* Tiêu đề */}
        <div className="form-group">
          <label className="form-label">Tiêu đề *</label>
          <input
            className="form-control"
            placeholder="Bộ sưu tập ảnh khách hàng..."
            value={form.title}
            onChange={e => handleTitleChange(e.target.value)}
          />
        </div>

        {/* Slug */}
        <div className="form-group">
          <label className="form-label">Slug *</label>
          <input
            className="form-control"
            placeholder="bo-suu-tap-anh-khach-hang"
            value={form.slug}
            onChange={e => set('slug', e.target.value)}
          />
        </div>

        {/* Mô tả */}
        <div className="form-group">
          <label className="form-label">Mô tả</label>
          <textarea
            className="form-control"
            placeholder="Mô tả ngắn về album..."
            rows={2}
            value={form.description}
            onChange={e => set('description', e.target.value)}
            style={{ resize: 'vertical' }}
          />
        </div>

        {/* Tác giả & Thứ tự */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Tác giả</label>
            <input
              className="form-control"
              placeholder="Tên khách hàng..."
              value={form.author}
              onChange={e => set('author', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Thứ tự hiển thị</label>
            <input
              className="form-control"
              type="number"
              min="0"
              value={form.sortOrder}
              onChange={e => set('sortOrder', e.target.value)}
            />
          </div>
        </div>

        {/* Thumbnail */}
        <div className="form-group">
          <label className="form-label">URL Thumbnail</label>
          <input
            className="form-control"
            placeholder="https://res.cloudinary.com/..."
            value={form.thumbnail}
            onChange={e => set('thumbnail', e.target.value)}
          />
          {form.thumbnail && (
            <img
              src={form.thumbnail}
              alt=""
              style={{ marginTop: 8, width: '100%', height: 140, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(201,168,76,0.2)' }}
              onError={e => e.target.style.display = 'none'}
            />
          )}
        </div>

        {/* Danh sách ảnh */}
        <div className="form-group">
          <label className="form-label">
            Danh sách ảnh
            <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-muted)', marginLeft: 6 }}>
              (mỗi URL trên một dòng)
            </span>
          </label>
          <textarea
            className="form-control"
            placeholder={'https://res.cloudinary.com/.../photo1.jpg\nhttps://res.cloudinary.com/.../photo2.jpg\n...'}
            rows={5}
            value={imagesInput}
            onChange={e => setImagesInput(e.target.value)}
            style={{ resize: 'vertical', fontFamily: 'monospace', fontSize: 12 }}
          />
          {imagesInput.trim() && (
            <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {imagesInput.split('\n').map(l => l.trim()).filter(Boolean).map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt=""
                  style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid rgba(201,168,76,0.25)' }}
                  onError={e => e.target.style.opacity = '0.2'}
                />
              ))}
            </div>
          )}
        </div>

        {/* Toggle isActive */}
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, cursor: 'pointer' }}>
          <label className="toggle-switch">
            <input type="checkbox" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} />
            <span className="toggle-slider" />
          </label>
          Hiển thị album
        </label>
      </Modal>

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
