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
        // Welcome message in Raffle Page
      if (event.data.type === 'WELCOME_MESSAGE') {
          setWelcomeMessage(true);
          resetState();
      } // Trigger logo slot machine animation
      else if (event.data.type === 'TRIGGER_SPIN') {
          setShowResult(false);
          setTriggerSpin(true);
      } // Hide the welcome message and show the logo slot machine
      else if (event.data.type === 'START_DRAW') {
          setWelcomeMessage(false); // Hide welcome message and enable draw
      } // Reset state after each draw
      else if (event.data.type === 'RESET_WINNERS') {
        setGeneratedName([]); // Clear previous winners
        setSelectedPrize(null); // Clear previous prize
      } // Draw Winners
      else if (event.data.type === 'NAME_GENERATED') {
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
      } // Include the prize in draw
      else if (event.data.type === 'PRIZE_REVEALED') {
          setSelectedPrize(event.data.prize);
      } // Update the state and quantity of the Prize
      else if (event.data.type === 'UPDATE_PRIZES') {
          setPrizes(event.data.prizes);
          localStorage.setItem('prizes', JSON.stringify(event.data.prizes));
      } // Add the winner to winners table and winner cards
      else if (event.data.type === 'WINNER_ADDED') {
            const winner = event.data.winner;
            const isRedraw = event.data.isRedraw;

            setNewWinner(winner);
        
            // Ensure the previous generated name is always an array
            setGeneratedName(prevGeneratedName => {
                let safePrevNames = Array.isArray(prevGeneratedName) ? prevGeneratedName : [];
        
                // If it's a redraw, replace the redrawn name with the new winner
                if (isRedraw) {
                    const indexToReplace = safePrevNames.findIndex(name => name === winner.previousName);
                    if (indexToReplace !== -1) {
                        // Replace the specific winner being redrawn
                        const updatedNames = [...safePrevNames];
                        updatedNames[indexToReplace] = winner.DRWNAME;
                        return updatedNames;
                    }
                } else {
                    // Append new winner if it's a normal draw and no duplicates exist
                    const winnerExists = safePrevNames.findIndex(name => name === winner.DRWNAME) !== -1;
                    if (!winnerExists) {
                        return [...safePrevNames, winner.DRWNAME];
                    }
                }

                return safePrevNames;
            });
        
            // Set the selected prize correctly
            setSelectedPrize(event.data.prize);
        
            // Update flipped cards based on redraw or normal draw
            setFlippedCards(prevFlippedCards => {
                let safePrevFlippedCards = Array.isArray(prevFlippedCards) ? prevFlippedCards : [];

                if (isRedraw) {
                    // Reset only the card of the redrawn winner
                    const indexToFlip = generatedName.findIndex(name => name === winner.DRWNAME);
                    if (indexToFlip !== -1) {
                        const updatedFlippedCards = [...safePrevFlippedCards];
                        updatedFlippedCards[indexToFlip] = false; // Reset the flip state for this card
                        return updatedFlippedCards;
                    }
                } else {
                    // Append a new entry for a normal draw
                    return [...safePrevFlippedCards, false];
                }

                return safePrevFlippedCards;
            });
        
            // Clear waived prize notice
            setWaivedPrize(null);
      } // Restart draw (Not in use; Old feature)
      else if (event.data.type === 'RESTART_DRAW') {
        resetState();
      } // End draw and roll creddits (Not fully functional)
      else if (event.data.type === 'END_DRAW') {
        setWinners(event.data.winners);
        setShowWinners(true);
      } // Waiving of prize
      else if (event.data.type === 'PRIZE_WAIVED') {
        const waivedPrize = event.data.waivedPrize;
    
        // Ensure waivedPrize and its name are defined
        if (!waivedPrize || !waivedPrize.name) {
            console.error('Waived prize or name is undefined');
            return;
        }
    
        setWaivedPrize(waivedPrize);
    
        // Ensure generatedName is an array before finding the index
        const waivedWinnerIndex = Array.isArray(generatedName)
            ? generatedName.findIndex(name => name === waivedPrize.name)
            : -1;
    
        if (waivedWinnerIndex !== -1) {
            // Flip only the card of the waived winner
            setFlippedCards(prevState => {
                const newState = [...prevState];
                newState[waivedWinnerIndex] = false; // Reset the flip state for this card
                return newState;
            });
        } else {
            console.error('Waived winner not found in generatedName array');
        }
      } // Flip all drawn winner cards
      else if (event.data.type === 'FLIP_ALL_CARDS') {
            setFlippedCards(new Array(generatedName.length).fill(true)); // Flip all cards
      } // Flip a single drawn winner cards
      else if (event.data.type === 'FLIP_CARD') {
            const { index } = event.data;
            setFlippedCards(prevState => {
                const newState = [...prevState];
                newState[index] = true; // Flip only the specified card
                return newState;
            });
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

  const [flippedCards, setFlippedCards] = useState(new Array(generatedName.length).fill(false));

  const [newWinner, setNewWinner] = useState(null);

    // Reset flipped cards when a new draw starts
    useEffect(() => {
        if (Array.isArray(generatedName) && generatedName.length > 0 && !newWinner) {
            // Reset the flipped cards to their unflipped state for a new draw
            setFlippedCards(new Array(generatedName.length).fill(false));
        }
    }, [generatedName, newWinner]);

  const handleNewWinner = (winner) => {
      setNewWinner(winner);
  };

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