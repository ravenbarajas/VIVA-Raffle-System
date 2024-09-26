import React, { useEffect, useState } from 'react';
import '../css/LogoSlotMachine.css';

const LogoSlotMachine = ({ logos, winnerCompany, onSpinComplete, triggerSpin }) => {
    const [spinning, setSpinning] = useState(false);
    const [middleRow, setMiddleRow] = useState([0, 1, 2]); // Only middle row
    const [middleRowBorders, setMiddleRowBorders] = useState([
        '#9ea19e', // Default border color
        '#9ea19e', // Default border color
        '#9ea19e', // Default border color
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
                setMiddleRow(getRandomLogos()); // Only update the middle row
            }, 100);

            return () => clearInterval(interval);
        } else if (winnerCompany) {
            const winnerIndex = logos.findIndex(logo => logo.company === winnerCompany);
            const winnerRow = [winnerIndex, winnerIndex, winnerIndex]; // Middle row is all winner logos
            setMiddleRow(winnerRow); // Update only the middle row
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
        setTimeout(() => setSpinning(false), 2000); // Spin for 3 seconds
    };

    return (
        <div className="slot-machine">
            <div className="row-wrapper row-1">
                <div className="slot-row middle-row">
                    {middleRow.map((logoIndex, colIndex) => (
                        <div 
                            key={colIndex} 
                            className="slot"
                            style={{ borderColor: middleRowBorders[colIndex] }} // Apply border color dynamically
                        >
                            {logos[logoIndex] && (
                                <img src={logos[logoIndex].src} alt={`logo-${colIndex}`} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LogoSlotMachine;
