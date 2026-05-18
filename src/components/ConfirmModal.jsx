import "../styles/ConfirmModal.css";

function ConfirmModal({ show, onYes, onNo, message }) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{message}</h3>

        <div className="modal-actions">
          <button className="yes-btn" onClick={onYes}>
            Yes
          </button>

          <button className="no-btn" onClick={onNo}>
            No
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;