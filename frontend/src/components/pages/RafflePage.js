import React, { useState, useEffect } from 'react';
import '../css/RafflePage.css';

function RafflePage() {
  const [generatedName, setGeneratedName] = useState('');
  const [selectedPrize, setSelectedPrize] = useState(null);

  useEffect(() => {
    const storedName = localStorage.getItem('generatedName');
    if (storedName) {
      setGeneratedName(storedName);
    }

    const handleMessage = (event) => {
      if (event.data.type === 'NAME_GENERATED') {
        setGeneratedName(event.data.name);
        localStorage.setItem('generatedName', event.data.name);
      } else if (event.data.type === 'PRIZE_SELECTED') {
        setSelectedPrize(event.data.prize);
      } else if (event.data.type === 'RESTART_DRAW') {
        setGeneratedName('');
        setSelectedPrize(null);
        localStorage.removeItem('generatedName');
      }
    };
    window.addEventListener('message', handleMessage);

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="rafflePage-container">
        <div className='rafflePage-body'>
            <p>Congratulations: {generatedName}</p>
            {selectedPrize && <p>Selected Prize: {selectedPrize.name}</p>}
        </div>
    </div>
  );
}

export default RafflePage;
