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
                '#F98C02', // Change color for middle row slots
                '#F98C02',
                '#F98C02',
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
            {currentLogos.map((row, rowIndex) => (
                <div key={rowIndex} className="slot-row">
                    {row.map((logoIndex, colIndex) => (
                        <div
                            key={colIndex}
                            className={`slot ${rowIndex === 1 ? 'middle-row' : ''}`}
                            style={{
                                borderColor: rowIndex === 1 ? middleRowBorders[colIndex] : '#344099'
                            }}
                        >
                            <img src={logos[logoIndex].src} alt={`logo-${rowIndex}-${colIndex}`} />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default LogoSlotMachine;
