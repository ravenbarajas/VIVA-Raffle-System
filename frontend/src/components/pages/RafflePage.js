import React, { useState, useEffect } from 'react';
import '../css/RafflePage.css';

function RafflePage() {
  const [generatedName, setGeneratedName] = useState('');
  const [selectedPrize, setSelectedPrize] = useState(null);
  const [prizes, setPrizes] = useState([]);
  const [winners, setWinners] = useState([]);
  const [showWinners, setShowWinners] = useState(false);
  const [waivedPrize, setWaivedPrize] = useState(null);
  const [welcomeMessage, setWelcomeMessage] = useState(true);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'WELCOME_MESSAGE') {
        setWelcomeMessage(true);
        setGeneratedName('');
        setSelectedPrize(null);
        setWinners([]);
        setShowWinners(false);
        setWaivedPrize(null);
      } else if (event.data.type === 'START_DRAW') {
        setWelcomeMessage(false); // Hide welcome message and enable draw
      } else if (event.data.type === 'NAME_GENERATED') {
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
        setWelcomeMessage(false); // Ensure the welcome message is not shown on restart
        setWaivedPrize(null);
        localStorage.removeItem('generatedName');
        localStorage.removeItem('prizes');
        localStorage.removeItem('winners');
      } else if (event.data.type === 'END_DRAW') {
        setWinners(event.data.winners);
        setShowWinners(true);
      } else if (event.data.type === 'PRIZE_WAIVED') {
        setWaivedPrize(event.data.waivedPrize);
        console.log('Waived Prize Received:', event.data.waivedPrize); // For debugging
        setGeneratedName(''); // Clear generated name
        setSelectedPrize(null); // Clear selected prize
    }
    
    };

    window.addEventListener('message', handleMessage);

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="rafflePage-container">
        <div className='rafflePage-body'>
        {welcomeMessage ? (
    <p>Welcome to the Raffle Page! Please press "Start Draw" to begin.</p>
) : (
    <>
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
                                <td>{winner.DRWNAME}</td>
                                <td>{winner.DRWNAME.split('(')[1].split(')')[0]}</td>
                                <td>{winner.DRWPRICE}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </>
)}

        </div>
    </div>
  );
}

export default RafflePage;
