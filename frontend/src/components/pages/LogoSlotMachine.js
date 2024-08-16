import React, { useEffect, useState } from 'react';
import '../css/LogoSlotMachine.css';

const LogoSlotMachine = ({ logos, winnerCompany, onSpinComplete, triggerSpin }) => {
    const [spinning, setSpinning] = useState(false);
    const [currentLogos, setCurrentLogos] = useState([
        [0, 1, 2], // Top row
        [3, 4, 5], // Middle row (this will be replaced with winner logos)
        [6, 7, 8], // Bottom row
    ]);

    const [middleRowBorders, setMiddleRowBorders] = useState([
        '#344099', // Default border color
        '#344099', // Default border color
        '#344099', // Default border color
    ]);

    // Generate random indices for logos
    const getRandomLogos = () => {
        return Array(3)
            .fill(null)
            .map(() => Math.floor(Math.random() * logos.length));
    };

    useEffect(() => {
        if (spinning) {
            const interval = setInterval(() => {
                setCurrentLogos([
                    getRandomLogos(), // Top row
                    getRandomLogos(), // Keep middle row static for now
                    getRandomLogos(), // Bottom row
                ]);
            }, 100);

            return () => clearInterval(interval);
        } else if (winnerCompany) {
            const winnerIndex = logos.findIndex(logo => logo.company === winnerCompany);
            const winnerRow = [winnerIndex, winnerIndex, winnerIndex]; // Middle row is all winner logos
            setCurrentLogos([
                getRandomLogos(), // Top row random logos
                winnerRow,        // Middle row is the winner
                getRandomLogos(), // Bottom row random logos
            ]);
            setMiddleRowBorders([
                '#FFA500', // Change color for middle row slots
                '#FFA500',
                '#FFA500',
            ]);
            onSpinComplete && onSpinComplete(logos[winnerIndex]);
        }
    }, [spinning, winnerCompany]);

    useEffect(() => {
        if (triggerSpin) {
            startSpinning();
        }
    }, [triggerSpin]);

    const startSpinning = () => {
        setMiddleRowBorders([
            '#344099', // Default color for all slots
            '#344099',
            '#344099',
        ]);
        setSpinning(true);
        setTimeout(() => setSpinning(false), 3000); // Spin for 3 seconds
    };

    return (
        <div className="slot-machine">
            <div className="row-wrapper row-0">
                <div className="slot-row">
                    {currentLogos[0].map((logoIndex, colIndex) => (
                        <div key={colIndex} className="slot">
                            <img src={logos[logoIndex].src} alt={`logo-${0}-${colIndex}`} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="row-wrapper row-1">
                <div className="slot-row middle-row">
                    {currentLogos[1].map((logoIndex, colIndex) => (
                        <div 
                            key={colIndex} 
                            className="slot"
                            style={{ borderColor: middleRowBorders[colIndex] }} // Apply border color dynamically
                        >
                            <img src={logos[logoIndex].src} alt={`logo-${1}-${colIndex}`} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="row-wrapper row-2">
                <div className="slot-row">
                    {currentLogos[2].map((logoIndex, colIndex) => (
                        <div key={colIndex} className="slot">
                            <img src={logos[logoIndex].src} alt={`logo-${2}-${colIndex}`} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


export default LogoSlotMachine;
