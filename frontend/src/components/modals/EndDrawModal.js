// EndDrawModal.js
import React from 'react';
import '../css/EndDrawModal.css'; // Import any necessary CSS

const EndDrawModal = ({ winners, onConfirm, onCancel }) => {
  return (
    <div className="end-draw-modal-overlay">
      <div className="end-draw-modal-content">
        <h2>End Draw</h2>
        <p>Are you sure you want to end the draw? The winners will be displayed.</p>
        <div className="end-draw-modal-buttons">
          <button onClick={onConfirm}>Confirm</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EndDrawModal;
