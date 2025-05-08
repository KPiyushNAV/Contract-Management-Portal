import './DomainCheckModal.css';

function DomainCheckModal({ onConfirm, onCancel }) {
  return (
    <div className="domain-modal-overlay">
      <div className="domain-modal-content">
        
        <p className="domain-question">Login with your <strong>Navriti</strong> Account</p>
        <div className="domain-buttons">
          <div style={{ marginTop: '20px' }}></div>
          <button className="yes-btn" onClick={onConfirm}>
            Continue with my Navriti Account
          </button>
          <button className="no-btn" onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
}

export default DomainCheckModal;