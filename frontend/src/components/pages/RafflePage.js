import React, { useState, useEffect } from 'react';
import '../css/RafflePage.css';

function RafflePage() {
  const [generatedName, setGeneratedName] = useState('');
  const [selectedPrize, setSelectedPrize] = useState(null);
  const [prizes, setPrizes] = useState([]);
  const [winners, setWinners] = useState([]);
  const [showWinners, setShowWinners] = useState(false);
  const [waivedPrize, setWaivedPrize] = useState(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'NAME_GENERATED') {
        setGeneratedName(event.data.name);
        localStorage.setItem('generatedName', event.data.name);
        setWaivedPrize(null); // Clear waived prize notice
      } else if (event.data.type === 'PRIZE_REVEALED') {
        setSelectedPrize(event.data.prize);
      } else if (event.data.type === 'UPDATE_PRIZES') {
        setPrizes(event.data.prizes);
        localStorage.setItem('prizes', JSON.stringify(event.data.prizes));
      } else if (event.data.type === 'WINNER_ADDED') {
        setWinners(prevWinners => [...prevWinners, event.data.winner]);
        setWaivedPrize(null); // Clear waived prize notice
      } else if (event.data.type === 'RESTART_DRAW') {
        setGeneratedName('');
        setSelectedPrize(null);
        setPrizes([]);
        setWinners([]);
        setShowWinners(false);
        localStorage.removeItem('generatedName');
        localStorage.removeItem('prizes');
        localStorage.removeItem('winners');
      } else if (event.data.type === 'END_DRAW') {
        setWinners(event.data.winners);
        setShowWinners(true); // Show winners only when end draw is clicked
      } else if (event.data.type === 'PRIZE_WAIVED') {
        setWaivedPrize(event.data.waivedPrize);
        setGeneratedName(''); // Clear generated name to remove winner notice
        setSelectedPrize(null); // Clear selected prize to remove prize notice
      }
    };
    window.addEventListener('message', handleMessage);

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="rafflePage-container">
        <div className='rafflePage-body'>
            {generatedName && <p>Congratulations, {generatedName}</p>}
            {selectedPrize && <p>You won {selectedPrize.RFLITEM}</p>}

            {waivedPrize && (
                <p>
                    Prize "{waivedPrize.prize}" waived by {waivedPrize.name} ({waivedPrize.company})
                </p>
            )}

            {showWinners && winners.length > 0 && (
              <div className="winners-summary">
                <h3>All Winners</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Company</th>
                      <th>Prize</th>
                    </tr>
                  </thead>
                  <tbody>
                    {winners.map((winner, index) => (
                      <tr key={index}>
                        <td>{winner.name}</td>
                        <td>{winner.company}</td>
                        <td>{winner.prize}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </div>
    </div>
  );
}

export default RafflePage;
