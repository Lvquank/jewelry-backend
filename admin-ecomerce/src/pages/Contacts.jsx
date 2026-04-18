import { useState, useEffect, useMemo } from 'react';
import { getAllContacts, updateContactStatus, deleteContact } from '../api';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

const STATUS_MAP = {
  new: { label: 'Mới', cls: 'badge-yellow', icon: '🆕' },
  processing: { label: 'Đang xử lý', cls: 'badge-cyan', icon: '⚙️' },
  done: { label: 'Đã xử lý', cls: 'badge-green', icon: '✅' },
};

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [viewContact, setViewContact] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    getAllContacts()
      .then(res => setContacts(res.data || res.contacts || res || []))
      .catch(() => addToast('Không thể tải liên hệ', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return contacts.filter(c =>
      (!filterStatus || c.status === filterStatus) &&
      (c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.phone?.includes(q))
    );
  }, [contacts, search, filterStatus]);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await updateContactStatus(id, status);
      setContacts(prev => prev.map(c => c._id === id ? { ...c, status } : c));
      addToast('Cập nhật trạng thái thành công', 'success');
    } catch (e) {
      addToast(e.message || 'Lỗi', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteContact(deleteId);
      setContacts(prev => prev.filter(c => c._id !== deleteId));
      addToast('Đã xóa liên hệ', 'success');
      setDeleteId(null);
    } catch (e) {
      addToast(e.message || 'Xóa thất bại', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const newCount = contacts.filter(c => c.status === 'new' || !c.status).length;

  return (
    <div className="page-enter">
      <div className="page-header">
        <div>
          <div className="page-title">📞 Liên hệ</div>
          <div className="page-subtitle">
            {contacts.length} tin nhắn — {newCount > 0 && <span style={{ color: 'var(--accent-orange)' }}>{newCount} chưa xử lý</span>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[['', 'Tất cả'], ['new', '🆕 Mới'], ['processing', '⚙️ Đang xử lý'], ['done', '✅ Xong']].map(([v, l]) => (
            <button key={v} className={`btn btn-sm ${filterStatus === v ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilterStatus(v)}>{l}</button>
          ))}
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <span className="table-title">Danh sách liên hệ</span>
          <div className="search-box">
            <span>🔍</span>
            <input id="contacts-search" placeholder="Tìm theo tên, email..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <div className="loading-container"><div className="loading-spinner" /></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Người liên hệ</th>
                <th>Email</th>
                <th>SĐT</th>
                <th>Nội dung</th>
                <th>Ngày gửi</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="7">
                  <div className="empty-state"><div className="empty-state-icon">📞</div><div className="empty-state-text">Chưa có liên hệ</div></div>
                </td></tr>
              ) : filtered.map(c => (
                <tr key={c._id}>
                  <td className="td-main">{c.name}</td>
                  <td style={{ fontSize: 13 }}>{c.email}</td>
                  <td style={{ fontSize: 13 }}>{c.phone || '—'}</td>
                  <td style={{ maxWidth: 200, fontSize: 13, color: 'var(--text-secondary)' }}>
                    <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {c.message}
                    </span>
                  </td>
                  <td style={{ fontSize: 12 }}>{new Date(c.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <select
                      className="select-control"
                      style={{ fontSize: 12, padding: '4px 8px' }}
                      value={c.status || 'new'}
                      onChange={e => handleStatusChange(c._id, e.target.value)}
                      disabled={updatingId === c._id}
                      id={`contact-status-${c._id}`}
                    >
                      {Object.entries(STATUS_MAP).map(([v, m]) => (
                        <option key={v} value={v}>{m.icon} {m.label}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button id={`view-contact-${c._id}`} className="btn btn-secondary btn-sm" onClick={() => setViewContact(c)}>👁️</button>
                      <button id={`delete-contact-${c._id}`} className="btn btn-danger btn-sm" onClick={() => setDeleteId(c._id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* View Detail */}
      <Modal isOpen={!!viewContact} onClose={() => setViewContact(null)} title="📞 Chi tiết liên hệ" size="sm">
        {viewContact && (
          <div>
            <div style={{ display: 'grid', gap: 12 }}>
              {[['👤 Tên', viewContact.name], ['📧 Email', viewContact.email], ['📱 SĐT', viewContact.phone || '—']].map(([lbl, val]) => (
                <div key={lbl} style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)', minWidth: 90 }}>{lbl}</span>
                  <span style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>{val}</span>
                </div>
              ))}
              <div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>📝 Nội dung</div>
                <div style={{ background: 'var(--bg-input)', borderRadius: 8, padding: 12, fontSize: 14, lineHeight: 1.7, color: 'var(--text-primary)' }}>
                  {viewContact.message}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)' }}>
                <span>Gửi lúc: {new Date(viewContact.createdAt).toLocaleString('vi-VN')}</span>
                <span className={`badge ${STATUS_MAP[viewContact.status || 'new']?.cls}`}>
                  {STATUS_MAP[viewContact.status || 'new']?.label}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} message="Xóa liên hệ này khỏi hệ thống?" />
    </div>
  );
}
