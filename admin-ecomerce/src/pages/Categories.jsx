import { useState, useEffect } from 'react';
import { getAllCategoriesAdmin, createCategory, updateCategory, deleteCategory } from '../api';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

const EMPTY = { name: '', slug: '', image: '', parent: '' };

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { addToast } = useToast();

  const fetch = () => {
    setLoading(true);
    getAllCategoriesAdmin()
      .then(res => setCategories(res.data || res.categories || res || []))
      .catch(() => addToast('Không thể tải danh mục', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (c) => { setEditing(c); setForm({ name: c.name, slug: c.slug, image: c.image || '', parent: c.parent || '' }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.name) { addToast('Tên danh mục là bắt buộc', 'warning'); return; }
    setSaving(true);
    try {
      if (editing) {
        await updateCategory(editing._id, form);
        addToast('Cập nhật danh mục thành công', 'success');
      } else {
        await createCategory(form);
        addToast('Tạo danh mục thành công', 'success');
      }
      setModalOpen(false);
      fetch();
    } catch (e) {
      addToast(e.message || 'Lỗi xảy ra', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteCategory(deleteId);
      setCategories(prev => prev.filter(c => c._id !== deleteId));
      addToast('Đã xóa danh mục', 'success');
      setDeleteId(null);
    } catch (e) {
      addToast(e.message || 'Xóa thất bại', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const roots = categories.filter(c => !c.parent);
  const children = categories.filter(c => c.parent);

  return (
    <div className="page-enter">
      <div className="page-header">
        <div>
          <div className="page-title">📂 Danh mục</div>
          <div className="page-subtitle">{categories.length} danh mục — {roots.length} danh mục cha, {children.length} danh mục con</div>
        </div>
        <button id="create-category-btn" className="btn btn-primary" onClick={openCreate}>＋ Thêm danh mục</button>
      </div>

      <div className="table-container">
        <div className="table-header">
          <span className="table-title">Danh sách danh mục</span>
        </div>
        {loading ? (
          <div className="loading-container"><div className="loading-spinner" /></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Danh mục</th>
                <th>Slug</th>
                <th>Danh mục cha</th>
                <th>Số SP</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr><td colSpan="6">
                  <div className="empty-state"><div className="empty-state-icon">📂</div><div className="empty-state-text">Chưa có danh mục</div></div>
                </td></tr>
              ) : categories.map((c, i) => {
                const parent = categories.find(p => p._id === c.parent);
                return (
                  <tr key={c._id}>
                    <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                    <td>
                      <div className="product-cell">
                        {c.image && <img src={c.image} alt={c.name} className="product-thumb" onError={e => e.target.style.display = 'none'} />}
                        <span className="td-main">{c.name}</span>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-muted)' }}>{c.slug}</td>
                    <td>
                      {parent
                        ? <span className="badge badge-purple">{parent.name}</span>
                        : <span className="badge badge-green">Danh mục gốc</span>
                      }
                    </td>
                    <td style={{ color: 'var(--accent-cyan)' }}>{c.productCount || 0}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button id={`edit-cat-${c._id}`} className="btn btn-secondary btn-sm" onClick={() => openEdit(c)}>✏️</button>
                        <button id={`delete-cat-${c._id}`} className="btn btn-danger btn-sm" onClick={() => setDeleteId(c._id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}
        title={editing ? '✏️ Sửa danh mục' : '＋ Thêm danh mục'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Hủy</button>
            <button id="save-cat-btn" className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? '⏳ Đang lưu...' : '💾 Lưu'}</button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Tên danh mục *</label>
          <input className="form-control" placeholder="Nhẫn Bạc..." value={form.name} onChange={e => set('name', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Slug</label>
          <input className="form-control" placeholder="nhan-bac" value={form.slug} onChange={e => set('slug', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">URL Ảnh</label>
          <input className="form-control" placeholder="https://..." value={form.image} onChange={e => set('image', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Danh mục cha</label>
          <select className="form-control" value={form.parent} onChange={e => set('parent', e.target.value)}>
            <option value="">— Là danh mục gốc —</option>
            {roots.filter(r => r._id !== editing?._id).map(r => (
              <option key={r._id} value={r._id}>{r.name}</option>
            ))}
          </select>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} message="Bạn có chắc muốn xóa danh mục này?" />
    </div>
  );
}
