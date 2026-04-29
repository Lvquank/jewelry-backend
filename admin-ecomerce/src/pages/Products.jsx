import { useState, useEffect, useMemo, useCallback } from 'react';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../api';
import { useToast } from '../context/ToastContext';
import { useDataCache } from '../context/DataCacheContext';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n || 0) + '₫';
const EMPTY_FORM = { name: '', image: '', type: '', category: '', price: '', countInStock: '', discount: '', description: '', material: 'Bạc S925', isFlashSale: false, isNewArrival: false, isBestSeller: false, isActive: true };
const CACHE_KEY = 'products_list';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [filterType, setFilterType] = useState('');
  const { addToast } = useToast();
  const { getCache, getCacheStale, setCache, invalidate } = useDataCache();
  const PER_PAGE = 10;

  const fetchProducts = useCallback(async () => {
    // Thử cache fresh
    const cached = getCache(CACHE_KEY);
    if (cached) { setProducts(cached); setLoading(false); return; }

    // Hiện stale data nếu có
    const stale = getCacheStale(CACHE_KEY);
    if (stale) { setProducts(stale); setLoading(false); }
    else setLoading(true);

    try {
      const res = await getAllProducts(0, 200);
      const data = res.data || res.products || res || [];
      const list = Array.isArray(data) ? data : [];
      setCache(CACHE_KEY, list);
      setProducts(list);
    } catch {
      addToast('Không thể tải sản phẩm', 'error');
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line

  useEffect(() => { fetchProducts(); }, [fetchProducts]);


  const types = useMemo(() => [...new Set(products.map(p => p.type).filter(Boolean))], [products]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter(p =>
      (!filterType || p.type === filterType) &&
      (p.name?.toLowerCase().includes(q) || p.type?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q))
    );
  }, [products, search, filterType]);

  const paginated = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ ...EMPTY_FORM, ...p, price: p.price?.toString(), countInStock: p.countInStock?.toString(), discount: p.discount?.toString() });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.image || !form.type || !form.price) {
      addToast('Vui lòng điền đầy đủ thông tin bắt buộc', 'warning'); return;
    }
    setSaving(true);
    const payload = { ...form, price: Number(form.price), countInStock: Number(form.countInStock), discount: Number(form.discount) };
    try {
      if (editing) {
        const res = await updateProduct(editing._id, payload);
        const updated = products.map(p => p._id === editing._id ? (res.data || res) : p);
        setProducts(updated);
        setCache(CACHE_KEY, updated); // cập nhật cache
        addToast('Cập nhật sản phẩm thành công', 'success');
      } else {
        const res = await createProduct(payload);
        const updated = [res.data || res, ...products];
        setProducts(updated);
        setCache(CACHE_KEY, updated); // cập nhật cache
        addToast('Tạo sản phẩm thành công', 'success');
      }
      setModalOpen(false);
    } catch (e) {
      addToast(e.message || 'Lưu thất bại', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProduct(deleteId);
      const updated = products.filter(p => p._id !== deleteId);
      setProducts(updated);
      setCache(CACHE_KEY, updated); // cập nhật cache
      addToast('Đã xóa sản phẩm', 'success');
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
          <div className="page-title">💍 Sản phẩm</div>
          <div className="page-subtitle">{products.length} sản phẩm trong kho</div>
        </div>
        <button id="create-product-btn" className="btn btn-primary" onClick={openCreate}>
          ＋ Thêm sản phẩm
        </button>
      </div>

      <div className="table-container">
        <div className="table-header">
          <span className="table-title">Danh sách sản phẩm</span>
          <div className="table-actions">
            <select className="select-control" value={filterType} onChange={e => { setFilterType(e.target.value); setPage(0); }}>
              <option value="">Tất cả loại</option>
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <div className="search-box">
              <span>🔍</span>
              <input
                id="products-search"
                placeholder="Tìm sản phẩm..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(0); }}
              />
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
                  <th>Sản phẩm</th>
                  <th>Loại</th>
                  <th>Giá</th>
                  <th>Kho</th>
                  <th>Đã bán</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr><td colSpan="7">
                    <div className="empty-state"><div className="empty-state-icon">💍</div><div className="empty-state-text">Không tìm thấy sản phẩm</div></div>
                  </td></tr>
                ) : paginated.map(p => (
                  <tr key={p._id}>
                    <td>
                      <div className="product-cell">
                        <img src={p.image} alt={p.name} className="product-thumb" onError={e => e.target.style.display = 'none'} />
                        <div>
                          <div className="product-info-name" style={{ maxWidth: 200 }}>{p.name}</div>
                          <div className="product-info-meta">{p.sku || p.material}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-purple">{p.type}</span></td>
                    <td style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{fmt(p.price)}</td>
                    <td>
                      <span style={{ color: p.countInStock === 0 ? 'var(--accent-red)' : p.countInStock < 5 ? 'var(--accent-orange)' : 'var(--text-secondary)' }}>
                        {p.countInStock}
                      </span>
                    </td>
                    <td>{p.selled || 0}</td>
                    <td>
                      <span className={`badge ${p.isActive ? 'badge-green' : 'badge-red'}`}>
                        {p.isActive ? 'Hiển thị' : 'Ẩn'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button id={`edit-product-${p._id}`} className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}>✏️</button>
                        <button id={`delete-product-${p._id}`} className="btn btn-danger btn-sm" onClick={() => setDeleteId(p._id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="pagination">
                <span className="pagination-info">
                  {page * PER_PAGE + 1}–{Math.min((page + 1) * PER_PAGE, filtered.length)} / {filtered.length}
                </span>
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

      {/* Product Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? '✏️ Sửa sản phẩm' : '＋ Thêm sản phẩm mới'}
        size="lg"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Hủy</button>
            <button id="save-product-btn" className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? '⏳ Đang lưu...' : '💾 Lưu sản phẩm'}
            </button>
          </>
        }
      >
        <div className="form-row">
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="form-label">Tên sản phẩm *</label>
            <input className="form-control" placeholder="Nhẫn Bạc Đôi..." value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">URL Ảnh chính *</label>
          <input className="form-control" placeholder="https://res.cloudinary.com/..." value={form.image} onChange={e => set('image', e.target.value)} />
          {form.image && <img src={form.image} alt="" style={{ marginTop: 8, height: 80, borderRadius: 8, objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />}
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Loại sản phẩm *</label>
            <input className="form-control" placeholder="Nhẫn, Vòng tay, Dây chuyền..." value={form.type} onChange={e => set('type', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Danh mục</label>
            <input className="form-control" placeholder="Nhẫn Đôi, Nhẫn Bạc..." value={form.category} onChange={e => set('category', e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Giá (₫) *</label>
            <input className="form-control" type="number" placeholder="350000" value={form.price} onChange={e => set('price', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Số lượng kho</label>
            <input className="form-control" type="number" placeholder="100" value={form.countInStock} onChange={e => set('countInStock', e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Giảm giá (%)</label>
            <input className="form-control" type="number" placeholder="0" value={form.discount} onChange={e => set('discount', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Chất liệu</label>
            <input className="form-control" placeholder="Bạc S925" value={form.material} onChange={e => set('material', e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Mô tả</label>
          <textarea className="form-control" placeholder="Mô tả sản phẩm..." rows={3} value={form.description} onChange={e => set('description', e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {[['isActive', '👁️ Hiển thị'], ['isFlashSale', '⚡ Flash Sale'], ['isNewArrival', '🆕 Hàng mới'], ['isBestSeller', '🔥 Bán chạy']].map(([k, label]) => (
            <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
              <label className="toggle-switch">
                <input type="checkbox" checked={!!form[k]} onChange={e => set(k, e.target.checked)} />
                <span className="toggle-slider" />
              </label>
              {label}
            </label>
          ))}
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message="Bạn có chắc muốn xóa sản phẩm này? Hành động không thể hoàn tác."
      />
    </div>
  );
}
