import { useState, useRef, useEffect } from 'react';
import '../css/RaffleDashboard.css';

const NAMES = ['Alice', 'Bob', 'Charlie', 'Diana', 'Edward'];

const INITIAL_PRIZES = [
    { name: 'Mug', quantity: 5 },
    { name: 'Jacket', quantity: 3 },
    { name: '1000php', quantity: 2 },
    { name: '3000php', quantity: 2 },
    { name: '1000 GC', quantity: 2 },
    { name: '3000 GC', quantity: 2 },
  ];

function Page1() {
    return (
    <div>
        <h2>Page 1</h2>
        <p>This is the content of Page 1.</p>
        {/* Add more content for Page 1 here */}
    </div>
    );
}
  
function Page2() {
return (
    <div>
    <h2>Page 2</h2>
    <p>This is the content of Page 2.</p>
    {/* Add more content for Page 2 here */}
    </div>
);
}
  
function RaffleDashboard() {
    const [currentPage, setCurrentPage] = useState('page1');

    const [generatedName, setGeneratedName] = useState('');
    const raffleTabRef = useRef(null);

    const [selectedPrize, setSelectedPrize] = useState(null);
    const [prizes, setPrizes] = useState(INITIAL_PRIZES);

    useEffect(() => {
        const storedName = localStorage.getItem('generatedName');
            if (storedName) {
            setGeneratedName(storedName);
        }
        const handleMessage = (event) => {
          if (event.data.type === 'NAME_GENERATED') {
            setGeneratedName(event.data.name);
            localStorage.setItem('generatedName', event.data.name);
          }
          else if (event.data.type === 'RESTART_DRAW') {
            setGeneratedName('');
            setSelectedPrize(null);
            setPrizes(INITIAL_PRIZES);
            localStorage.removeItem('generatedName');
          }
        };
        window.addEventListener('message', handleMessage);
    
        return () => window.removeEventListener('message', handleMessage);
      }, []);    

    const openRafflePage  = () => {
        const raffleTab = window.open('/rafflePage', '_blank');
        raffleTabRef.current = raffleTab;
    };

    const generateName = () => {
        const randomName = NAMES[Math.floor(Math.random() * NAMES.length)];
        setGeneratedName(randomName);
        localStorage.setItem('generatedName', randomName);
        if (raffleTabRef.current) {
          raffleTabRef.current.postMessage({ type: 'NAME_GENERATED', name: randomName }, '*');
        }
        if (selectedPrize) {
            const updatedPrizes = prizes.map(prize => 
              prize.name === selectedPrize.name ? { ...prize, quantity: prize.quantity - 1 } : prize
            );
            setPrizes(updatedPrizes);
            if (raffleTabRef.current) {
              raffleTabRef.current.postMessage({ type: 'PRIZE_SELECTED', prize: selectedPrize }, '*');
            }
          }
      };

    const restartDraw = () => {
        setGeneratedName('');
        setSelectedPrize(null);
        setPrizes(INITIAL_PRIZES);
        localStorage.removeItem('generatedName');
        if (raffleTabRef.current) {
            raffleTabRef.current.postMessage({ type: 'RESTART_DRAW' }, '*');
        }
    };
    const selectPrize = (prize) => {
        setSelectedPrize(prize);
        if (raffleTabRef.current) {
            raffleTabRef.current.postMessage({ type: 'PRIZE_SELECTED', prize }, '*');
        }
      };
    const renderContent = () => {
        switch (currentPage) {
          case 'page1':
            return <Page1/>
          case 'page2':
            return <Page2/>
          default:
            return <p>Welcome</p>;
        }
      };

  return (
    <div className="raffleDashboard-container">
        <div className="grid-item">
            <div className='ctrl-container'>
                <div className='ctrl-container-header'>

                </div>
                <div className='ctrl-container-body'>
                    <div className='ctrl-body-start'>
                        <button onClick={openRafflePage}>Open Raffle</button>
                        <button>Start Draw</button>
                    </div>
                    <div className='ctrl-body-mid'>
                        <button onClick={generateName}>Draw Winner</button>
                        <button>Waive Prize</button>
                    </div>
                    <div className='ctrl-body-end'>
                        <button onClick={restartDraw}>Restart Draw</button>
                        <button>End Draw</button>
                    </div>
                </div>
                <div className='ctrl-container-footer'>
                    
                </div>
            </div>
        </div>
        <div className="grid-item">
            <div className='winner-container'>
                <div className='winner-container-header'>

                </div>
                <div className='winner-container-body'>
                    <p>Winner: {generatedName}</p>
                    {selectedPrize && <p>Selected Prize: {selectedPrize.name}</p>}
                </div>
                <div className='winner-container-footer'>
                    
                </div>
            </div>
        </div>
        <div className="grid-item">
            <div className='tbl-container'>
                <div className='tbl-container-header'>

                </div>
                <div className='tbl-container-body'>
                    <div className="navigation-buttons">
                        <button onClick={() => setCurrentPage('page1')}>
                            Go to Page 1
                        </button>
                        <button onClick={() => setCurrentPage('page2')}>
                            Go to Page 2
                        </button>
                    </div>
                    {renderContent()}
                </div>
                <div className='tbl-container-footer'>
                    
                </div>
            </div>
        </div>
        <div className="grid-item">
            <div className='prize-container'>
                <div className='prize-container-header'>

                </div>
                <div className='prize-container-body'>
                    <table>
                        <thead>
                            <tr>
                            <th>Prize</th>
                            <th>Quantity</th>
                            <th>Select</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prizes.map((prize, index) => (
                            <tr key={index}>
                                <td>{prize.name}</td>
                                <td>{prize.quantity}</td>
                                <td>
                                <button onClick={() => selectPrize(prize)} disabled={prize.quantity === 0}>
                                    Select
                                </button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className='prize-container-footer'>
                    
                </div>
            </div>
        </div>
    </div>
    );
}

export default RaffleDashboard;
