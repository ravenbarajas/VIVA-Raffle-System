import React, { useState, useEffect } from 'react';
import '../css/RafflePage.css';
import LogoSlotMachine from './LogoSlotMachine';
import logo1 from '../assets/logo/logo-1.png';
import logo2 from '../assets/logo/logo-2.png';
import logo3 from '../assets/logo/logo-3.png';
import logo4 from '../assets/logo/logo-4.png';
import logo5 from '../assets/logo/logo-5.png';
import logo6 from '../assets/logo/logo-6.png';
import logo7 from '../assets/logo/logo-7.png';
import logo8 from '../assets/logo/logo-8.png';
import logo9 from '../assets/logo/logo-9.png';
import logo10 from '../assets/logo/logo-10.png';
import logo11 from '../assets/logo/logo-11.png';
import logo12 from '../assets/logo/logo-12.png';

function RafflePage() {
  const [generatedName, setGeneratedName] = useState('');
  const [selectedPrize, setSelectedPrize] = useState(null);
  const [prizes, setPrizes] = useState([]);
  const [winners, setWinners] = useState([]);
  const [showWinners, setShowWinners] = useState(false);
  const [waivedPrize, setWaivedPrize] = useState(null);
  const [welcomeMessage, setWelcomeMessage] = useState(true);

  const [triggerSpin, setTriggerSpin] = useState(false);
  const [generatedWinnerCompany, setGeneratedWinnerCompany] = useState('');
  const [showResult, setShowResult] = useState(false); // New state for controlling the message display

  const logos = [
    { src: logo1, company: 'VIVA ARTISTS AGENCY, INC.' }, { src: logo2, company: 'VIVA LIVE, INC.' }, { src: logo3, company: 'ULTIMATE  ENTERTAINMENT, INC.' }, 
    { src: logo4, company: 'VIVA LIFESTYLE and LEISURE, INC.' }, { src: logo5, company: 'EPIK STUDIOS, INC.' }, { src: logo6, company: 'VIVA RECORDS CORP.' }, 
    { src: logo7, company: 'VICOR MUSIC CORP.' }, { src: logo8, company: 'VIVA MUSIC PUBLISHING, INC.' }, { src: logo9, company: 'OC PRODUCTIONS AND ENTERTAINMENT, INC.' }, 
    { src: logo10, company: 'VIVA BOOKS PUBLISHING, INC.' }, { src: logo11, company: 'VIVA COMMUNICATIONS, INC.' }, { src: logo12, company: 'VIVA INTERNATIONAL FOOD & RESTAURANTS, INC.' },
  ];

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'WELCOME_MESSAGE') {
        setWelcomeMessage(true);
        resetState();
      } else if (event.data.type === 'TRIGGER_SPIN') {
        setTriggerSpin(true);
      } else if (event.data.type === 'START_DRAW') {
        setWelcomeMessage(false); // Hide welcome message and enable draw
      } else if (event.data.type === 'NAME_GENERATED') {
        setGeneratedName(event.data.name);
        localStorage.setItem('generatedName', event.data.name);
        const company = event.data.name.split('(')[1].replace(')', '').trim();
        setGeneratedWinnerCompany(company);
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
        resetState();
      } else if (event.data.type === 'END_DRAW') {
        setWinners(event.data.winners);
        setShowWinners(true);
      } else if (event.data.type === 'PRIZE_WAIVED') {
        setWaivedPrize(event.data.waivedPrize);
        setGeneratedName(''); // Clear generated name
        setSelectedPrize(null); // Clear selected prize
    }
    };

    window.addEventListener('message', handleMessage);

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const resetState = () => {
    setGeneratedName('');
    setSelectedPrize(null);
    setPrizes([]);
    setWinners([]);
    setShowWinners(false);
    setWelcomeMessage(false); // Ensure the welcome message is not shown on restart
    setWaivedPrize(null);
    setGeneratedWinnerCompany('');
    setTriggerSpin(false); // Reset spin trigger
    setShowResult(false); // Reset result display
    localStorage.removeItem('generatedName');
    localStorage.removeItem('prizes');
    localStorage.removeItem('winners');
  };

  const handleSpinComplete = (winnerLogo) => {
    console.log('Spin complete, winner logo:', winnerLogo);
    setTriggerSpin(false); // Reset triggerSpin after spin completion

    // Delay showing result for 1 second (after the spin is complete)
    setTimeout(() => {
      setShowResult(true);
    }, 1000);
  };

  return (
    <div className="rafflePage-container">
        <div className='rafflePage-body'>
            {welcomeMessage ? (
                <p>Welcome to the Raffle Page! Please press "Start Draw" to begin.</p>
            ) : (
                <>
                    {!showWinners && (
                        <>
                          <LogoSlotMachine 
                              logos={logos} 
                              winnerCompany={generatedWinnerCompany} 
                              triggerSpin={triggerSpin} 
                              onSpinComplete={handleSpinComplete} 
                          />
                            {showResult && generatedName && <p>Congratulations, {generatedName}</p>}
                            {showResult && selectedPrize && <p>You won {selectedPrize.RFLITEM}</p>}
                            {waivedPrize && (
                                <p>
                                    Prize "{waivedPrize.prize}" waived by {waivedPrize.name} ({waivedPrize.company})
                                </p>
                            )}
                        </>
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
                                  {winners.filter(winner => winner.DRWNUM === 1).map((winner, index) => (
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
