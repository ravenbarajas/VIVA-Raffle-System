import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect, useRef } from 'react';
import { WAIVE_PRIZE_EVENT } from '../../constants/events.js';
import '../css/RafflePage.css';
import LogoSlotMachine from './LogoSlotMachine';
import mainlogo from  '../assets/logo/Viva43rdAnivFINALwbluebg.png';
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

import spinSound from '../assets/audio/spin.mp3';
import heartbeatSound from '../assets/audio/heartbeat.mp3';

import videoSrc from '../assets/logo/gifbg.mp4';

function RafflePage() {
  const [generatedName, setGeneratedName] = useState('');
  const [selectedPrize, setSelectedPrize] = useState(null);
  const [prizes, setPrizes] = useState([]);
  const [winners, setWinners] = useState([]);
  const [showWinners, setShowWinners] = useState(false);
  const [waivedPrize, setWaivedPrize] = useState(null);
  const [welcomeMessage, setWelcomeMessage] = useState(true);

  const [logoSrcs, setLogoSrcs] = useState([]);  // To track the logos (mainLogo or company logos)
  const [isRolling, setIsRolling] = useState(false);  // To track whether the rolling animation is ongoing
  const [revealedLogos, setRevealedLogos] = useState(Array(generatedName.length).fill(false));
  const [flippedLogos, setFlippedLogos] = useState([]);

  // Show mainLogo by default
  const [showDefaultLogo, setShowDefaultLogo] = useState(true);

  const [isRedraw, setIsRedraw] = useState(false);
  
  const [flipDuration, setFlipDuration] = useState(5000);  // Duration for the rolling animation (modifiable later)

   // Function to handle animation and reveal logos
   const triggerLogoFlip = () => {
    setIsRolling(true); // Start the rolling animation
    setRevealedLogos(Array(generatedName.length).fill(false));

    // Load the spin sound and set it to loop
    const sound = new Audio(spinSound);
    sound.loop = true;
    sound.playbackRate = 2;
    sound.play();

    // Start at 500ms and gradually increase duration
    let animationDuration = 250;
    const maxDuration = flipDuration; // maxDuration is 80% of flipDuration
    const durationIncrement = 100;

    // Function to update the logo container with a new duration
    const cycleLogosInterval = setInterval(() => {
        // Update the animation duration
        document.querySelectorAll('.logo-container.rolling').forEach((el) => {
            el.style.animationDuration = `${animationDuration}ms`;
            el.classList.remove('rolling'); // Reset animation
            void el.offsetWidth; // Trigger reflow to restart the animation
            el.classList.add('rolling'); // Reapply animation
        });

        // Update logo images
        setLogoSrcs((prevLogos) => {
            return prevLogos.map(() => {
                const randomLogo = logos[Math.floor(Math.random() * logos.length)].src;
                return randomLogo;
            });
        });

        // Re-add visible class to make logos fade in smoothly
        setTimeout(() => {
            document.querySelectorAll('.logo-container img').forEach((img) => {
                img.classList.add('visible');
            });
        }, 30); // Small delay to trigger the fade-in effect

        // Increment duration until reaching the max
        animationDuration = Math.min(animationDuration + durationIncrement, maxDuration);

        // Stop if max duration is reached
        if (animationDuration >= maxDuration) {
            clearInterval(cycleLogosInterval);
            setIsRolling(false);
            sound.pause();
            sound.currentTime = 0;
        }
    }, animationDuration);

    // Delay to stop the animation and reveal each winner's logo sequentially
    setTimeout(() => { 
        clearInterval(cycleLogosInterval); // Stop cycling the logos
        sound.pause();  // Stop the sound effect when animation ends
        sound.currentTime = 0; // Reset sound position if replayed

        // Reveal each winner's logo with a delay
        generatedName.forEach((name, index) => {
            setTimeout(() => {
                // Extract the company name and find the logo
                const companyName = name.split('(')[1]?.replace(')', '').trim();
                
                // Set the winner's logo
                setLogoSrcs(prevLogos => {
                    const newLogos = [...prevLogos];
                    const winnerLogo = getLogoForCompany(companyName);
                    newLogos[index] = winnerLogo ? winnerLogo : mainlogo;
                    return newLogos;
                });

                // Mark as revealed for animation trigger
                setRevealedLogos(prev => {
                    const newRevealed = [...prev];
                    newRevealed[index] = true;
                    return newRevealed;
                });

                // Ensure rolling stops only after the last logo is revealed
                if (index === generatedName.length - 1) {
                    setIsRolling(false);
                }
            }, index * 500); // Adding 500ms delay for each winner reveal
        });
        }, flipDuration);
    };

    // Function to handle animation and reveal logo for a specific card
    const triggerLogoFlipForCard = (cardIndex) => {
        setIsRolling(true);
        
        // Reset revealed state for this specific card
        setRevealedLogos(prevRevealed => {
            const newRevealed = [...prevRevealed];
            newRevealed[cardIndex] = false;
            return newRevealed;
        });

        // Load the spin sound and set it to loop
        const sound = new Audio(spinSound);
        sound.loop = true;
        sound.playbackRate = 2;
        sound.play();

        // Cycle through random logos for the specific card only
        const cycleLogosInterval = setInterval(() => {
            setLogoSrcs(prevLogos => {
                const newLogos = [...prevLogos];
                // Only change the logo for the targeted cardIndex
                newLogos[cardIndex] = logos[Math.floor(Math.random() * logos.length)].src;
                return newLogos;
            });
        }, 300);

        setTimeout(() => { 
            // Stop cycling through logos for this card
            clearInterval(cycleLogosInterval);
            sound.pause();  // Stop the sound effect when animation ends
            sound.currentTime = 0; // Reset sound position if replayed

            // Set the winner's logo for this specific card
            const companyName = generatedName[cardIndex].split('(')[1]?.replace(')', '').trim();
            setLogoSrcs(prevLogos => {
                const newLogos = [...prevLogos];
                // Set only the target card to the winner's logo; other cards remain on mainlogo
                newLogos[cardIndex] = getLogoForCompany(companyName) || mainlogo;
                return newLogos;
            });

            // Mark this specific card as revealed
            setRevealedLogos(prevRevealed => {
                const newRevealed = [...prevRevealed];
                newRevealed[cardIndex] = true;
                return newRevealed;
            });

            // Stop the rolling animation for this individual card
            setIsRolling(false);
        }, flipDuration);
    };

    const heartbeatAudio = useRef(new Audio(heartbeatSound));

    const handleMouseEnter = () => {
        heartbeatAudio.current.loop = true; // Loop the sound for continuous heartbeat
        heartbeatAudio.current.play();
    };

    const handleMouseLeave = () => {
        heartbeatAudio.current.pause();
        heartbeatAudio.current.currentTime = 0; // Reset to start
    };
  
  const [triggerSpin, setTriggerSpin] = useState(false);
  const [triggerPull, setTriggerPull] = useState(false);
  const [generatedWinnerCompany, setGeneratedWinnerCompany] = useState('');
  const [showResult, setShowResult] = useState(false); // New state for controlling the message display
  const [showNextDrawPage, setShowNextDrawPage] = useState(false); // State to control visibility
  const [isAnimating, setIsAnimating] = useState(false); // Track animation state

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
        }, 0); // Add a delay to simulate the lever pull before the slot machine starts spinning

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
        setTimeout(() => {
          setShowNextDrawPage(false);  // Hide the page after the animation ends
          setIsAnimating(false);  // Reset the animation state
        }, 500); // Adjust to match your CSS animation duration

        const { winner, isRedraw, waivedWinnerName, prize, flipDuration: receivedDuration } = event.data;

        // Set the redraw state
        setIsRedraw(isRedraw);

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
         // Use the flipDuration for the animation

         // Update the flipDuration with the received value
        if (receivedDuration) {
            setFlipDuration(receivedDuration);
        }

        if (isRedraw && waivedWinnerName) {
            generatedName.forEach((name, index) => {
                setLogoSrcs(prevLogos => {
                    const newLogos = [...prevLogos];
                    const companyName = name.split('(')[1]?.replace(')', '').trim();
                    newLogos[index] = getLogoForCompany(companyName);
                    return newLogos;
                });
                setRevealedLogos(prev => {
                    const newRevealed = [...prev];
                    newRevealed[index] = true;  // Immediately reveal the logo
                    return newRevealed;
                });
            });
        }
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
            // Trigger hover effect
            const cardBack = document.querySelectorAll('.winner-card .card-back')[waivedWinnerIndex];
            if (cardBack) {
                cardBack.classList.add('hover'); // Add hover class
                setTimeout(() => {
                    cardBack.classList.remove('hover'); // Remove hover class after a short delay
                }, 1000); // Adjust duration as needed
            }

            // Introduce a delay for flipping the card so the hover effect is visible
            setTimeout(() => {
                // Flip only the card of the waived winner after hover
                setFlippedCards(prevState => {
                    const newState = [...prevState];
                    newState[waivedWinnerIndex] = false; // Reset the flip state for this card
                    return newState;
                });

                // Start rolling effect
                setIsRolling(true);

                // Randomize logos before setting the new winner’s logo
                const cycleLogosInterval = setInterval(() => {
                    setLogoSrcs(prevLogos => {
                        return prevLogos.map(() => {
                            const randomLogo = logos[Math.floor(Math.random() * logos.length)].src;
                            return randomLogo;
                        });
                    });
                }, 500); // Adjust the interval for faster cycling if desired

                // Stop the rolling effect and set the new winner's logo
                setTimeout((name, index) => {
                    clearInterval(cycleLogosInterval);

                    // Set the new winner's logo
                    const companyName = waivedPrize.name.split('(')[1]?.replace(')', '').trim();
                    const winnerLogo = getLogoForCompany(companyName) || mainlogo;

                    setLogoSrcs(prevLogos => {
                        const newLogos = [...prevLogos];
                        newLogos[waivedWinnerIndex] = winnerLogo;
                        return newLogos;
                    });

                    // Mark as revealed for animation trigger
                    setRevealedLogos(prev => {
                        const newRevealed = [...prev];
                        newRevealed[index] = true;
                        return newRevealed;
                    });

                    // Stop rolling after the logo is set
                    setIsRolling(false);
                }, flipDuration); // Duration for rolling effect before setting new logo

            }, 300); // Delay the flip action to occur slightly after hover is removed
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
      else if (event.data.type === 'SHOW_NEXT_DRAW_PAGE') 
      {
        setShowNextDrawPage(true);  // Show the temporary page
      } 
      else if (event.data.type === 'SPIN_ALL') {
        triggerLogoFlip(); // Start the logo flip animation when 'Spin All' is triggered
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

  const [newWinner, setNewWinner] = useState(null);

  const [flippedCards, setFlippedCards] = useState(new Array(generatedName.length).fill(false));

   // Reset flipped cards when a new draw starts
    useEffect(() => {
        if (Array.isArray(generatedName) && generatedName.length > 0 && !isRedraw) {
            setFlippedCards(new Array(generatedName.length).fill(false));
            setLogoSrcs(new Array(generatedName.length).fill(mainlogo));  // Initially show the mainLogo
            setFlippedLogos(new Array(generatedName.length).fill(false));
        }
    }, [generatedName, isRedraw]);

  const handleNewWinner = (winner) => {
      setNewWinner(winner);
  };

  const handleCardClick = (index, event) => {
    event.preventDefault();

    if (event.type === 'click') {
        // Left-click: Flip the card
        setFlippedCards(prevState => {
            const newState = [...prevState];
            newState[index] = !newState[index]; // Toggle the flipped state
            return newState;
        });
    } else if (event.type === 'contextmenu') {
        // Right-click: Trigger logo flip and prevent default context menu
        triggerLogoFlipForCard(index);
    }
  };

  return (
    <div className="rafflePage-container">
        <div className='rafflePage-body'>
            {showNextDrawPage ? (
                <div className={`next-draw-transition ${isAnimating ? 'exit-active' : 'enter-active'}`}>
                    <div className="next-draw-page">
                        <video autoPlay loop muted playsInline className="background-video">
                            <source src={videoSrc} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            ) : (
                <>
                    {welcomeMessage ? (
                        <p className='raffleMsg'>Welcome to the Raffle Page! Please press "Start Draw" to begin.</p>
                    ) : (
                        <>
                            {!showWinners && (
                                <>
                                    {showResult && Array.isArray(generatedName) && generatedName.length > 0 && (
                                        <div className="winners-overlay">
                                            <div className='winners-body'>
                                                <div className="congrats-banner">
                                                    <h2>🎉 Congratulations to Our Winners! 🎉</h2>
                                                    {selectedPrize && <p className="prize-won">You won {selectedPrize.RFLITEM}
                                                    </p>}
                                                </div>
                                                <div className="overlay-cards" >
                                                    {generatedName.map((name, index) => {
                                                        const companyName = name.split('(')[1]?.replace(')', '').trim();
                                                        const winnerName = name.split('(')[0].trim();
                                                        // Get the logo for the company or show mainlogo
                                                        const logoSrc = isRolling || !revealedLogos[index] ? logoSrcs[index] : logoSrcs[index];

                                                        return (
                                                            <div 
                                                                key={index} 
                                                                className="winner-card"
                                                                onClick={(event) => handleCardClick(index, event)}
                                                                onContextMenu={(event) => handleCardClick(index, event)}
                                                            >
                                                                <div className={`card ${flippedCards[index] ? 'is-flipped' : ''}`}>
                                                                    <div className="card-face card-front"
                                                                        onMouseEnter={handleMouseEnter} 
                                                                        onMouseLeave={handleMouseLeave}>
                                                                        <div className='card-front-container'>
                                                                            <div className={`logo-container ${!revealedLogos[index] && isRolling ? 'rolling' : ''}`}>
                                                                                <img 
                                                                                    src={logoSrc} 
                                                                                    alt={`logo-${index}`} 
                                                                                    className="company-logo"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="card-face card-back">
                                                                        <div className='card-back-container'>
                                                                            <p className="winner-name">
                                                                                {winnerName}
                                                                            </p>
                                                                        </div>

                                                                            {/* Add a transparent overlay */}
                                                                        <div className="waive-prize-overlay" 
                                                                        >
                                                                            <p>Waive Prize</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                            {showWinners && winners.length > 0 && (
                                <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center', flexDirection: "column", color: "white", height: "100vh" }}>
                                    <div className="winners-summary">
                                        <div className="winner-credits">
                                            <h1 style={{ display: "flex", width: "100%", textAlign: "center", justifyContent: "center", alignItems: "center", marginBottom: "2rem" }}>
                                                Congratulations!
                                            </h1>
                                
                                            <table className='enddraw-list'>
                                                <tbody>
                                                    {winners.map((winner, index) => {
                                                        const winnerName = winner.DRWNAME.split('(')[0].trim();
                                                        const companyName = winner.DRWNAME.split('(')[1]?.replace(')', '').trim();
                                
                                                        return (
                                                            <tr key={index} className="winner-row">
                                                                <td className="winner-summary-name">{winnerName}</td>
                                                                <td className="winner-summary-company">{companyName}</td>
                                                                <td className="winner-summary-prize">{winner.DRWPRICE}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    </div>
  );
}

export default RafflePage;