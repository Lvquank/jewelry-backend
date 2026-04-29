import { useState, useEffect, useMemo, useCallback } from 'react';
import { getAllOrders, updateOrderStatus, getOrderDetails } from '../api';
import { useToast } from '../context/ToastContext';
import { useDataCache } from '../context/DataCacheContext';
import Modal from '../components/Modal';

const fmt = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n || 0);

const STATUS_LIST = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'];
const statusMap = {
  pending: { label: 'Chờ xử lý', cls: 'badge-yellow', icon: '⏳' },
  confirmed: { label: 'Đã xác nhận', cls: 'badge-cyan', icon: '✅' },
  shipping: { label: 'Đang giao', cls: 'badge-purple', icon: '🚚' },
  delivered: { label: 'Đã giao', cls: 'badge-green', icon: '📦' },
  cancelled: { label: 'Đã hủy', cls: 'badge-red', icon: '❌' },
};
const paymentMap = { COD: '💵 COD', VNPay: '💳 VNPay', PayPal: '🅿️ PayPal' };
const CACHE_KEY = 'orders_list';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(0);
  const [detailOrder, setDetailOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const { addToast } = useToast();
  const { getCache, getCacheStale, setCache } = useDataCache();
  const PER_PAGE = 10;

  const fetchOrders = useCallback(async () => {
    // Thử cache fresh
    const cached = getCache(CACHE_KEY);
    if (cached) { setOrders(cached); setLoading(false); return; }

    // Hiện stale nếu có
    const stale = getCacheStale(CACHE_KEY);
    if (stale) { setOrders(stale); setLoading(false); }
    else setLoading(true);

    try {
      const res = await getAllOrders();
      const data = res.data || res.orders || res || [];
      const list = Array.isArray(data) ? data : [];
      setCache(CACHE_KEY, list);
      setOrders(list);
    } catch {
      addToast('Không thể tải đơn hàng', 'error');
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line

  useEffect(() => { fetchOrders(); }, [fetchOrders]);


  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return orders.filter(o =>
      (!filterStatus || o.status === filterStatus) &&
      (o._id?.toLowerCase().includes(q) ||
        o.shippingAddress?.fullName?.toLowerCase().includes(q) ||
        o.shippingAddress?.phone?.includes(q))
    );
  }, [orders, search, filterStatus]);

  const paginated = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await updateOrderStatus(id, status);
      const updated = orders.map(o => o._id === id ? { ...o, status } : o);
      setOrders(updated);
      setCache(CACHE_KEY, updated); // cập nhật cache
      addToast('Cập nhật trạng thái thành công', 'success');
    } catch (e) {
      addToast(e.message || 'Cập nhật thất bại', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const openDetail = (o) => setDetailOrder(o);

  return (
    <div className="page-enter">
      <div className="page-header">
        <div>
          <div className="page-title">📦 Đơn hàng</div>
          <div className="page-subtitle">{orders.length} đơn hàng tổng cộng</div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {STATUS_LIST.map(s => (
            <button
              key={s}
              className={`btn btn-sm ${filterStatus === s ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => { setFilterStatus(filterStatus === s ? '' : s); setPage(0); }}
            >
              {statusMap[s].icon} {statusMap[s].label}
              <span className="nav-badge" style={{ marginLeft: 4 }}>{orders.filter(o => o.status === s).length}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <span className="table-title">Danh sách đơn hàng</span>
          <div className="search-box">
            <span>🔍</span>
            <input
              id="orders-search"
              placeholder="Tìm mã đơn, tên khách..."
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
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>SĐT</th>
                  <th>Tổng tiền</th>
                  <th>Thanh toán</th>
                  <th>Ngày đặt</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr><td colSpan="8">
                    <div className="empty-state"><div className="empty-state-icon">📦</div><div className="empty-state-text">Không có đơn hàng</div></div>
                  </td></tr>
                ) : paginated.map(o => (
                  <tr key={o._id}>
                    <td className="td-main" style={{ fontFamily: 'monospace', fontSize: 13 }}>
                      #{o._id?.slice(-8)?.toUpperCase()}
                    </td>
                    <td>{o.shippingAddress?.fullName || '—'}</td>
                    <td style={{ fontSize: 13 }}>{o.shippingAddress?.phone || '—'}</td>
                    <td style={{ color: 'var(--accent-green)', fontWeight: 700 }}>{fmt(o.totalPrice)}</td>
                    <td style={{ fontSize: 12 }}>{paymentMap[o.paymentMethod] || o.paymentMethod}</td>
                    <td style={{ fontSize: 12 }}>{new Date(o.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <select
                        className="select-control"
                        style={{ fontSize: 12, padding: '4px 8px' }}
                        value={o.status}
                        disabled={updatingId === o._id || o.status === 'cancelled' || o.status === 'delivered'}
                        onChange={e => handleStatusChange(o._id, e.target.value)}
                        id={`order-status-${o._id}`}
                      >
                        {STATUS_LIST.map(s => (
                          <option key={s} value={s}>{statusMap[s].icon} {statusMap[s].label}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button id={`view-order-${o._id}`} className="btn btn-secondary btn-sm" onClick={() => openDetail(o)}>👁️</button>
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

      {/* Order Detail Modal */}
      <Modal isOpen={!!detailOrder} onClose={() => setDetailOrder(null)} title={`📦 Chi tiết đơn #${detailOrder?._id?.slice(-8)?.toUpperCase()}`} size="lg">
        {detailOrder && (
          <div>
            <div className="form-row" style={{ marginBottom: 16 }}>
              <div className="card" style={{ padding: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 700 }}>THÔNG TIN GIAO HÀNG</div>
                <div style={{ fontSize: 14 }}>
                  <div><strong>{detailOrder.shippingAddress?.fullName}</strong></div>
                  <div style={{ color: 'var(--text-secondary)', marginTop: 4 }}>📞 {detailOrder.shippingAddress?.phone}</div>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    📍 {[detailOrder.shippingAddress?.address, detailOrder.shippingAddress?.ward, detailOrder.shippingAddress?.district, detailOrder.shippingAddress?.city].filter(Boolean).join(', ')}
                  </div>
                </div>
              </div>
              <div className="card" style={{ padding: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 700 }}>THANH TOÁN & TRẠNG THÁI</div>
                <div style={{ fontSize: 14 }}>
                  <div>{paymentMap[detailOrder.paymentMethod] || detailOrder.paymentMethod}</div>
                  <div style={{ marginTop: 8 }}><span className={`badge ${statusMap[detailOrder.status]?.cls}`}>{statusMap[detailOrder.status]?.label}</span></div>
                  <div style={{ marginTop: 8, color: 'var(--text-secondary)', fontSize: 12 }}>
                    {detailOrder.isPaid ? '✅ Đã thanh toán' : '⏳ Chưa thanh toán'}
                  </div>
                </div>
              </div>
            </div>
            <div className="table-container">
              <table>
                <thead><tr><th>Sản phẩm</th><th>Số lượng</th><th>Đơn giá</th><th>Thành tiền</th></tr></thead>
                <tbody>
                  {detailOrder.orderItems?.map((item, i) => (
                    <tr key={i}>
                      <td>
                        <div className="product-cell">
                          <img src={item.image} alt={item.name} className="product-thumb" onError={e => e.target.style.display = 'none'} />
                          <span>{item.name}</span>
                        </div>
                      </td>
                      <td>{item.amount}</td>
                      <td>{fmt(item.price)}</td>
                      <td style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{fmt(item.price * item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 16, padding: '16px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6, color: 'var(--text-secondary)' }}>
                <span>Tạm tính</span><span>{fmt(detailOrder.itemsPrice)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6, color: 'var(--text-secondary)' }}>
                <span>Phí vận chuyển</span><span>{fmt(detailOrder.shippingPrice)}</span>
              </div>
              {detailOrder.discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6, color: 'var(--accent-green)' }}>
                  <span>Giảm giá</span><span>-{fmt(detailOrder.discountAmount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 800, marginTop: 10, color: 'var(--text-primary)', borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                <span>Tổng cộng</span><span style={{ color: 'var(--accent-green)' }}>{fmt(detailOrder.totalPrice)}</span>
              </div>
            </div>
            {detailOrder.note && (
              <div style={{ marginTop: 12, padding: 12, background: 'rgba(255,159,67,0.1)', border: '1px solid rgba(255,159,67,0.3)', borderRadius: 8, fontSize: 13, color: 'var(--accent-orange)' }}>
                📝 Ghi chú: {detailOrder.note}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
