import React, { useEffect, useState } from 'react';
import '../css/LogoSlotMachine.css';

const LogoSlotMachine = ({ logos, winnerCompany, onSpinComplete }) => {
    const [spinning, setSpinning] = useState(false);
    const [currentLogos, setCurrentLogos] = useState([0, 1, 2]);

    useEffect(() => {
        if (spinning) {
            const interval = setInterval(() => {
                setCurrentLogos(currentLogos.map(logo => (logo + 1) % logos.length));
            }, 100);

            return () => clearInterval(interval);
        } else if (winnerCompany) {
            // Stop at the winner's logo
            const winnerIndex = logos.findIndex(logo => logo.company === winnerCompany);
            setCurrentLogos([winnerIndex, winnerIndex, winnerIndex]);
            onSpinComplete && onSpinComplete(logos[winnerIndex]);
        }
    }, [spinning, winnerCompany]);

    useEffect(() => {
        if (winnerCompany) {
            setSpinning(false);
        }
    }, [winnerCompany]);

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
            <button onClick={startSpinning} disabled={spinning}>Spin</button>
        </div>
    );
};

export default LogoSlotMachine;
