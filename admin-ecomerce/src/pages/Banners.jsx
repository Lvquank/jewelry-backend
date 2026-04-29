import { useState, useEffect, useCallback } from 'react';
import { getAllBannersAdmin, createBanner, updateBanner, deleteBanner } from '../api';
import { useToast } from '../context/ToastContext';
import { useDataCache } from '../context/DataCacheContext';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

const POSITIONS = ['homepage_hero', 'homepage_sub', 'homepage_flash_sale', 'category_top', 'popup'];
const EMPTY = { image: '', title: '', link: '', position: 'homepage_hero', isActive: true };
const CACHE_KEY = 'banners_list';

export default function Banners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { addToast } = useToast();
  const { getCache, getCacheStale, setCache, invalidate } = useDataCache();

  const fetchBanners = useCallback(async () => {
    const cached = getCache(CACHE_KEY);
    if (cached) { setBanners(cached); setLoading(false); return; }
    const stale = getCacheStale(CACHE_KEY);
    if (stale) { setBanners(stale); setLoading(false); }
    else setLoading(true);
    try {
      const res = await getAllBannersAdmin();
      const list = res.data || res.banners || res || [];
      setCache(CACHE_KEY, list);
      setBanners(list);
    } catch { addToast('Không thể tải banner', 'error'); }
    finally { setLoading(false); }
  }, []); // eslint-disable-line

  useEffect(() => { fetchBanners(); }, [fetchBanners]);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (b) => { setEditing(b); setForm({ image: b.image, title: b.title || '', link: b.link || '', position: b.position, isActive: b.isActive !== false }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.image || !form.position) { addToast('Ảnh và vị trí là bắt buộc', 'warning'); return; }
    setSaving(true);
    try {
      if (editing) { await updateBanner(editing._id, form); addToast('Cập nhật banner thành công', 'success'); }
      else { await createBanner(form); addToast('Tạo banner thành công', 'success'); }
      setModalOpen(false);
      invalidate(CACHE_KEY);
      fetchBanners();
    } catch (e) {
      addToast(e.message || 'Lỗi xảy ra', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteBanner(deleteId);
      const updated = banners.filter(b => b._id !== deleteId);
      setBanners(updated);
      setCache(CACHE_KEY, updated);
      addToast('Đã xóa banner', 'success');
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
          <div className="page-title">🖼️ Banner</div>
          <div className="page-subtitle">{banners.length} banner đang quản lý</div>
        </div>
        <button id="create-banner-btn" className="btn btn-primary" onClick={openCreate}>＋ Thêm Banner</button>
      </div>

      {loading ? (
        <div className="loading-container"><div className="loading-spinner" /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {banners.length === 0 ? (
            <div className="empty-state card" style={{ gridColumn: '1/-1' }}>
              <div className="empty-state-icon">🖼️</div>
              <div className="empty-state-text">Chưa có banner nào</div>
            </div>
          ) : banners.map(b => (
            <div key={b._id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ position: 'relative', height: 160, overflow: 'hidden', background: 'var(--bg-input)' }}>
                <img src={b.image} alt={b.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.src = ''} />
                <div style={{ position: 'absolute', top: 8, right: 8 }}>
                  <span className={`badge ${b.isActive ? 'badge-green' : 'badge-red'}`}>{b.isActive ? 'Hiển thị' : 'Ẩn'}</span>
                </div>
                <div style={{ position: 'absolute', top: 8, left: 8 }}>
                  <span className="badge badge-purple">{b.position}</span>
                </div>
              </div>
              <div style={{ padding: '14px 16px' }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{b.title || 'Banner không có tiêu đề'}</div>
                {b.link && <div style={{ fontSize: 12, color: 'var(--accent-cyan)', marginBottom: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>🔗 {b.link}</div>}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button id={`edit-banner-${b._id}`} className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => openEdit(b)}>✏️ Sửa</button>
                  <button id={`delete-banner-${b._id}`} className="btn btn-danger btn-sm" onClick={() => setDeleteId(b._id)}>🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? '✏️ Sửa banner' : '＋ Banner mới'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Hủy</button>
            <button id="save-banner-btn" className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? '⏳...' : '💾 Lưu'}</button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">URL Ảnh *</label>
          <input className="form-control" placeholder="https://res.cloudinary.com/..." value={form.image} onChange={e => set('image', e.target.value)} />
          {form.image && <img src={form.image} alt="" style={{ marginTop: 8, width: '100%', height: 160, objectFit: 'cover', borderRadius: 8 }} onError={e => e.target.style.display = 'none'} />}
        </div>
        <div className="form-group">
          <label className="form-label">Tiêu đề</label>
          <input className="form-control" placeholder="Banner trang chủ..." value={form.title} onChange={e => set('title', e.target.value)} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Vị trí *</label>
            <select className="form-control" value={form.position} onChange={e => set('position', e.target.value)}>
              {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Link (URL)</label>
            <input className="form-control" placeholder="/products" value={form.link} onChange={e => set('link', e.target.value)} />
          </div>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, cursor: 'pointer' }}>
          <label className="toggle-switch">
            <input type="checkbox" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} />
            <span className="toggle-slider" />
          </label>
          Hiển thị banner
        </label>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} message="Bạn có chắc muốn xóa banner này?" />
    </div>
  );
}
