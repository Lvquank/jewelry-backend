import Modal from './Modal';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, loading }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="sm">
      <div className="confirm-dialog">
        <div className="confirm-icon">🗑️</div>
        <div className="confirm-title">{title || 'Xác nhận xóa'}</div>
        <p className="confirm-message">{message || 'Bạn có chắc chắn muốn thực hiện hành động này không? Thao tác này không thể hoàn tác.'}</p>
      </div>
      <div className="modal-footer" style={{ justifyContent: 'center', gap: 12, marginTop: 8 }}>
        <button className="btn btn-secondary" onClick={onClose} disabled={loading}>Hủy</button>
        <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
          {loading ? '⏳ Đang xóa...' : '🗑️ Xóa'}
        </button>
      </div>
    </Modal>
  );
}
