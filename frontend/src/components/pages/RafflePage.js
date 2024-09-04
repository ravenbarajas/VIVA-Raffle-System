import React, { useState, useEffect } from 'react';
import '../css/RafflePage.css';
import LogoSlotMachine from './LogoSlotMachine';
import mainlogo from  '../assets/logo/mainlogo.png';
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
    { src: logo1, company: 'VIVA ARTISTS AGENCY, INC.' }, { src: logo2, company: 'VIVA LIVE, INC.' }, { src: logo3, company: 'ULTIMATE ENTERTAINMENT, INC.' }, 
    { src: logo4, company: 'VIVA LIFESTYLE and LEISURE, INC.' }, { src: logo5, company: 'EPIK STUDIOS, INC.' }, { src: logo6, company: 'VIVA RECORDS CORP.' }, 
    { src: logo7, company: 'VICOR MUSIC CORP.' }, { src: logo8, company: 'VIVA MUSIC PUBLISHING, INC.' }, { src: logo9, company: 'OC PRODUCTIONS AND ENTERTAINMENT, INC.' }, 
    { src: logo10, company: 'VIVA BOOKS PUBLISHING, INC.' }, { src: logo11, company: 'VIVA COMMUNICATIONS, INC.' }, { src: logo12, company: 'VIVA INTERNATIONAL FOOD & RESTAURANTS, INC.' },
  ];

  const getLogoForCompany = (companyName) => {
    const logo = logos.find(logo => logo.company === companyName);
    return logo ? logo.src : null; // Return null or a placeholder if no match is found
  };

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'WELCOME_MESSAGE') {
          setWelcomeMessage(true);
          resetState();
      } else if (event.data.type === 'TRIGGER_SPIN') {
          setShowResult(false);
          setTriggerSpin(true);
      } else if (event.data.type === 'START_DRAW') {
          setWelcomeMessage(false); // Hide welcome message and enable draw
      } else if (event.data.type === 'RESET_WINNERS') {
        setGeneratedName([]); // Clear previous winners
        setSelectedPrize(null); // Clear previous prize
      } else if (event.data.type === 'NAME_GENERATED') {
        try {
            const names = JSON.parse(event.data.name); // Ensure it's parsed as an array

            // Clear previous generated names before setting new ones
            setGeneratedName([]);
    
            // Check if names is an array and has at least one element
            if (Array.isArray(names) && names.length > 0) {
                setGeneratedName(names);
                localStorage.setItem('generatedName', JSON.stringify(names));
    
                // Safeguard against undefined values and ensure split only happens on a valid string
                const firstName = names[0];
                const company = firstName?.split('(')[1]?.replace(')', '').trim() || 'Unknown'; // Fallback to 'Unknown' if company name is not available
    
                setGeneratedWinnerCompany(company);
                setWaivedPrize(null); // Clear waived prize notice
            } else {
                console.error('Names array is empty or not valid.');
            }
        } catch (error) {
          console.error('Error parsing names:', error);
        }
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
        else if (event.data.type === 'FLIP_ALL_CARDS') {
          setFlippedCards(new Array(generatedName.length).fill(true)); // Flip all cards
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
        window.removeEventListener('message', handleMessage);
    };
  }, [generatedName]);

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
    setShowResult(true); // Show result immediately after spin completes
  };

  const [flippedCards, setFlippedCards] = useState([]); // Track flipped cards

    // Reset flipped cards when a new draw starts
    useEffect(() => {
      if (Array.isArray(generatedName) && generatedName.length > 0) {
          // Reset flipped state when a new draw starts
          setFlippedCards(new Array(generatedName.length).fill(false));
      }
  }, [generatedName]);

  const handleCardClick = (index) => {
      // Flip the card when clicked
      setFlippedCards(prevState => {
          const newState = [...prevState];
          newState[index] = true; // Flip only the clicked card
          return newState;
      });
  };

  return (
    <div className="rafflePage-container">
        <div className='rafflePage-body'>
            {welcomeMessage ? (
                <p className='raffleMsg'>Welcome to the Raffle Page! Please press "Start Draw" to begin.</p>
            ) : (
                <>
                    {!showWinners && (
                        <>
                        <div className='rafflePage-slotmachine'>
                          <div className='rafflepage-machine-top1'>
                            <div className='mainlogo-wrapper'>
                              <img src={mainlogo} alt="Main Logo" />
                            </div>
                          </div>
                          <div className='rafflepage-machine-top2'>

                          </div>
                          <div className='rafflePage-machine-upper'>
                            <div className='lights-left-container'>
                              <div className="lights-left">
                                {[...Array(5)].map((_, index) => (
                                    <div key={index} className="light-bulb"></div>
                                ))}
                              </div>
                            </div>
                            <div className='rafflePage-logos'>
                              <LogoSlotMachine 
                                  logos={logos} 
                                  winnerCompany={generatedWinnerCompany} 
                                  triggerSpin={triggerSpin} 
                                  onSpinComplete={handleSpinComplete} 
                              />
                            </div>
                            <div className='lights-right-container'>
                              <div className="lights-right">
                                {[...Array(5)].map((_, index) => (
                                    <div key={index} className="light-bulb"></div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className='rafflePage-hl'>
                            
                          </div>
                          <div className="rafflePage-header">
                                {showResult && Array.isArray(generatedName) && generatedName.length > 0 && (
                                    <div className="winners-overlay">
                                        {generatedName.map((name, index) => {
                                            const companyName = name.split('(')[1]?.replace(')', '').trim();
                                            const winnerName = name.split('(')[0].trim();
                                            const logoSrc = getLogoForCompany(companyName);

                                            return (
                                                <div 
                                                    key={index} 
                                                    className="winner-card"
                                                    onClick={() => handleCardClick(index)}
                                                >
                                                    <div className={`card ${flippedCards[index] ? 'is-flipped' : ''}`}>
                                                        <div className="card-face card-front">
                                                            <img src={logoSrc} alt={`logo-${index}`} className="company-logo" />
                                                        </div>
                                                        <div className="card-face card-back">
                                                            <p className="winner-header">Congratulations,</p>
                                                            <p className="winner-name">{winnerName}</p>
                                                            <p className="winner-company">{companyName}</p>
                                                            {selectedPrize && <p className="prize-won">You won {selectedPrize.RFLITEM}</p>}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                          </div>
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