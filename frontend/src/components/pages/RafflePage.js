import React, { useState, useEffect } from 'react';
import '../css/RafflePage.css';

function RafflePage() {
  const [generatedName, setGeneratedName] = useState('');
  const [selectedPrize, setSelectedPrize] = useState(null);
  const [prizes, setPrizes] = useState([]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'NAME_GENERATED') {
        setGeneratedName(event.data.name);
        localStorage.setItem('generatedName', event.data.name);
      } else if (event.data.type === 'PRIZE_REVEALED') {
        setSelectedPrize(event.data.prize);
      } else if (event.data.type === 'UPDATE_PRIZES') {
        setPrizes(event.data.prizes);
        localStorage.setItem('prizes', JSON.stringify(event.data.prizes));
      } else if (event.data.type === 'RESTART_DRAW') {
        setGeneratedName('');
        setSelectedPrize(null);
        setPrizes([]);
        localStorage.removeItem('generatedName');
        localStorage.removeItem('prizes');
      }
    };
    window.addEventListener('message', handleMessage);

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="rafflePage-container">
        <div className='rafflePage-body'>
            {generatedName && <p>Congratulations,{generatedName}</p>}
            {selectedPrize && <p>You won a {selectedPrize.name}</p>}
        </div>
    </div>
  );
}

export default RafflePage;
