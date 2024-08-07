import React, { useState } from 'react';
import '../css/WaivePrizeModal.css';

const WaivePrizeModal = ({ isOpen, onClose, onWaive, selectedPrize }) => {
  const [redrawOption, setRedrawOption] = useState('redraw_same');

  const handleWaive = () => {
    onWaive(redrawOption);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="waive-prize-modal-overlay">
        <div className="waive-prize-modal">
            <h2>Confirm Waiving Prize</h2>
            <p>Are you sure you want to waive the prize "{selectedPrize.RFLITEM}"?</p>
            <div className="waive-prize-modal-buttons">
                <button onClick={onWaive}>Confirm</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    </div>
  );
};

export default WaivePrizeModal;
