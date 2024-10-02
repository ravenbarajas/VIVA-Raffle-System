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

  const [logoSrcs, setLogoSrcs] = useState([]);  // To track the logos (mainLogo or company logos)
  const [isRolling, setIsRolling] = useState(true);  // To track whether the rolling animation is ongoing
  const [flipDuration, setFlipDuration] = useState(3000);  // Duration for the rolling animation (modifiable later)
  const [flippedLogos, setFlippedLogos] = useState([]);

  // Show mainLogo by default
  const [showDefaultLogo, setShowDefaultLogo] = useState(true);
  
   // Function to handle animation and reveal logos
   const triggerLogoFlip = () => {
    // Initially show the mainLogo for all cards
    setLogoSrcs(Array(generatedName.length).fill(mainlogo));
    setIsRolling(true);  // Trigger rolling animation
  
    // Set a timeout to stop the rolling animation and flip to company logos
    setTimeout(() => {
      const updatedLogos = generatedName.map(name => {
        const companyName = name.split('(')[1]?.replace(')', '').trim();
        return getLogoForCompany(companyName);  // Get the company logo based on the company name
      });
  
      setLogoSrcs(updatedLogos);  // Set the updated logos (company logos)
      setIsRolling(false);  // Stop rolling animation
      setFlippedLogos(new Array(generatedName.length).fill(true));  // Set flippedLogos to true to flip to company logos
    }, flipDuration);
  };
  
  const [triggerSpin, setTriggerSpin] = useState(false);
  const [triggerPull, setTriggerPull] = useState(false);
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
      else if (event.data.type === 'TRIGGER_DRAW') {
          // Reset result, trigger handle pull and spin
        setTriggerPull(true);  // Trigger the handle pull-down animation

        // After the handle is pulled down, trigger the slot machine spin
        setTimeout(() => {
            setTriggerSpin(true);  // Trigger the slot machine spin
            setTriggerPull(false); // Reset the handle after pulling it down
        }, 1500); // Add a delay to simulate the lever pull before the slot machine starts spinning

        // Stop spin animation after a set time (e.g., 3 seconds)
        setTimeout(() => {
            setTriggerSpin(false);
            setShowResult(true); // Show result after spinning
        }, 0); // 1 second for handle + 3 seconds for spin

      } // Hide the welcome message and show the logo slot machine
      else if (event.data.type === 'START_DRAW') {
          setWelcomeMessage(false); // Hide welcome message and enable draw
      } // Reset state after each draw
      else if (event.data.type === 'RESET_WINNERS') {
        setGeneratedName([]); // Clear previous winners
        setSelectedPrize(null); // Clear previous prize
      } // Update the flip duration
      else if (event.data.type === 'SET_FLIP_DURATION') {
        console.log('Flip duration updated to:', event.data.duration);  // Test log
        setFlipDuration(event.data.duration);
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
        const { winner, isRedraw, waivedWinnerName, prize } = event.data;

        setNewWinner(winner);
        setSelectedPrize(prize);
    
        // Ensure the previous generated name is always an array
        setGeneratedName(prevGeneratedName => {
            let updatedNames = Array.isArray(prevGeneratedName) ? [...prevGeneratedName] : [];
    
            if (isRedraw && waivedWinnerName) {
                // Replace the waived winner with the new winner
                const indexToReplace = updatedNames.findIndex(name => name === waivedWinnerName);
                if (indexToReplace !== -1) {
                    updatedNames[indexToReplace] = winner.DRWNAME;
                } else {
                    // If the waived winner is not found, append the new winner
                    updatedNames.push(winner.DRWNAME);
                }
            } else {
                // For normal draws, check for duplicates before appending
                if (!updatedNames.includes(winner.DRWNAME)) {
                    updatedNames.push(winner.DRWNAME);
                }
            }
            return updatedNames;
        });
    
        setFlippedCards(prevFlippedCards => {
            let updatedFlippedCards = Array.isArray(prevFlippedCards) ? [...prevFlippedCards] : [];
    
            if (isRedraw && waivedWinnerName) {
                const indexToUpdate = updatedFlippedCards.findIndex((_, index) => 
                    generatedName[index] === waivedWinnerName
                );
                if (indexToUpdate !== -1) {
                    updatedFlippedCards[indexToUpdate] = false;  // Reset to unflipped
                } else {
                    updatedFlippedCards.push(false);  // Add new unflipped card if waived winner not found
                }
            } else {
                // For normal draws, add a new unflipped card if it doesn't already exist
                if (updatedFlippedCards.length < generatedName.length + 1) {
                    updatedFlippedCards.push(false);
                }
            }
            return updatedFlippedCards;
        });
        
        // Clear waived prize notice
        setWaivedPrize(null);

        setFlippedCards(new Array(generatedName.length).fill(false));
         // Reset flipped logos to show the mainLogo initially
        setFlippedLogos(new Array(generatedName.length).fill(false));

        // Trigger the logo flip animation
        triggerLogoFlip();
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
        const waivedWinnerIndex = generatedName.findIndex(name => name === waivedPrize.name);
    
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
  }, [generatedName, flipDuration]);

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
    setTriggerPull(false); // Reset spin trigger
    setShowResult(false); // Reset result display
    localStorage.removeItem('generatedName');
    localStorage.removeItem('prizes');
    localStorage.removeItem('winners');
  };

  const handleSpinComplete = (winnerLogo) => {
    console.log('Spin complete, winner logo:', winnerLogo);
    setTriggerSpin(false); // Reset triggerSpin after spin completion
    setTriggerPull(false); // Reset triggerSpin after spin completion
    setShowResult(true); // Show result immediately after spin completes
  };

  const [flippedCards, setFlippedCards] = useState(new Array(generatedName.length).fill(false));

  const [newWinner, setNewWinner] = useState(null);

   // Reset flipped cards when a new draw starts
   useEffect(() => {
    if (Array.isArray(generatedName) && generatedName.length > 0) {
        setFlippedLogos(new Array(generatedName.length).fill(false));
        setLogoSrcs(new Array(generatedName.length).fill(mainlogo));  // Initially show the mainLogo
    }
}, [generatedName]);

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
                            {showResult && Array.isArray(generatedName) && generatedName.length > 0 && (
                                <div className="winners-overlay">
                                    
                                    <div className='overlay-cards'>
                                        {generatedName.map((name, index) => {
                                            const companyName = name.split('(')[1]?.replace(')', '').trim();
                                            const winnerName = name.split('(')[0].trim();
                                              // Get the logo for the company or show mainlogo
                                              const logoSrc = flippedLogos[index] ? getLogoForCompany(companyName) : mainlogo;  

                                            return (
                                                <div 
                                                    key={index} 
                                                    className="winner-card"
                                                    onClick={() => handleCardClick(index)}
                                                >
                                                    <div className={`card ${flippedCards[index] ? 'is-flipped' : ''}`}>
                                                        <div className="card-face card-front">
                                                            <img 
                                                                src={isRolling ? mainlogo : logoSrc} 
                                                                alt={`logo-${index}`} 
                                                                className={`company-logo ${isRolling ? 'rolling' : ''}`}  // Apply rolling class during animation
                                                            />
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
                                </div>
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