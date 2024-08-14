import React, { useEffect, useState } from 'react';
import '../css/LogoSlotMachine.css';

const LogoSlotMachine = ({ logos, winnerCompany, onSpinComplete, triggerSpin }) => {
    const [spinning, setSpinning] = useState(false);
    const [currentLogos, setCurrentLogos] = useState([0, 1, 2]);
    const [winnerIndex, setWinnerIndex] = useState(null);

    useEffect(() => {
        if (triggerSpin) {
            startSpinning();
        }
    }, [triggerSpin]);

    useEffect(() => {
        if (spinning) {
            const interval = setInterval(() => {
                setCurrentLogos(prevLogos => prevLogos.map(index => (index + 1) % logos.length));
            }, 100);

            return () => clearInterval(interval);
        } else if (winnerIndex !== null) {
            const newLogos = [winnerIndex, winnerIndex, winnerIndex];
            setCurrentLogos(newLogos);
            onSpinComplete && onSpinComplete(logos[winnerIndex]);
        }
    }, [spinning, winnerIndex]);

    useEffect(() => {
        if (winnerCompany) {
            const index = logos.findIndex(logo => logo.company === winnerCompany);
            setWinnerIndex(index);
        }
    }, [winnerCompany, logos]);

    const startSpinning = () => {
        setSpinning(true);
        setTimeout(() => setSpinning(false), 3000); // Spin for 3 seconds
    };

    return (
        <div className="slot-machine">
            {[0, 1, 2].map(col => (
                <div key={col} className="column">
                    {[0, 1, 2].map(row => {
                        // Calculate index with offset for different rows
                        const logoIndex = (currentLogos[col] + row) % logos.length;
                        return (
                            <div key={row} className={`slot ${row === 1 ? 'middle' : 'top-bottom'}`}>
                                <img src={logos[logoIndex].src} alt={`logo-${col}-${row}`} />
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default LogoSlotMachine;
