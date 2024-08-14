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
                setCurrentLogos(currentLogos.map(logo => (logo + 1) % logos.length));
            }, 100);

            return () => clearInterval(interval);
        } else if (winnerCompany) {
            const winnerIndex = logos.findIndex(logo => logo.company === winnerCompany);
            setWinnerIndex(winnerIndex);
            setCurrentLogos([winnerIndex, winnerIndex, winnerIndex]);
            onSpinComplete && onSpinComplete(logos[winnerIndex]);
        }
    }, [spinning, winnerCompany]);

    const startSpinning = () => {
        setSpinning(true);
        setTimeout(() => setSpinning(false), 3000); // Spin for 3 seconds
    };

    return (
        <div className="slot-machine">
            {currentLogos.map((logoIndex, i) => (
                <div key={i} className={`slot ${spinning ? 'spinning' : ''}`}>
                    <img src={logos[logoIndex].src} alt={`logo${i + 1}`} />
                </div>
            ))}
        </div>
    );
};

export default LogoSlotMachine;
