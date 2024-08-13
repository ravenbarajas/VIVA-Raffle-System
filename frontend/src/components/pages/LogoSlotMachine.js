import React, { useEffect, useState } from 'react';
import '../css/LogoSlotMachine.css';

const LogoSlotMachine = ({ logos, winnerCompany, onSpinComplete, triggerSpin }) => {
    const [spinning, setSpinning] = useState(false);
    const [currentLogos, setCurrentLogos] = useState([0, 1, 2]);

    useEffect(() => {
        if (spinning) {
            const interval = setInterval(() => {
                setCurrentLogos(currentLogos.map(logo => (logo + 1) % logos.length));
            }, 100);

            return () => clearInterval(interval);
        } else if (winnerCompany) {
            const winnerIndex = logos.findIndex(logo => logo.company === winnerCompany);
            setCurrentLogos([winnerIndex, winnerIndex, winnerIndex]);
            onSpinComplete && onSpinComplete(logos[winnerIndex]);
        }
    }, [spinning, winnerCompany]);

    useEffect(() => {
        if (triggerSpin) {
            startSpinning();
        }
    }, [triggerSpin]);

    const startSpinning = () => {
        setSpinning(true);
        setTimeout(() => setSpinning(false), 3000); // Spin for 3 seconds
    };

    return (
        <div className="slot-machine">
            <div className="slot">
                <img src={logos[currentLogos[0]].src} alt="logo1" />
            </div>
            <div className="slot">
                <img src={logos[currentLogos[1]].src} alt="logo2" />
            </div>
            <div className="slot">
                <img src={logos[currentLogos[2]].src} alt="logo3" />
            </div>
        </div>
    );
};

export default LogoSlotMachine;
