import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import EndDrawModal from '../modals/EndDrawModal.js'; // Import the modal
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

function RaffleParticipants() {
    const [participants, setParticipants] = useState([]);
    const [uploadStatus, setUploadStatus] = useState('');

    // Fetch participants from the API
    const fetchParticipants = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/participants');
            setParticipants(response.data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    // Handle file upload
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post('http://localhost:8000/api/participants/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setUploadStatus('File uploaded successfully!');
            fetchParticipants(); // Refresh the list after upload
        } catch (error) {
            console.error('Upload error:', error);
            setUploadStatus('Failed to upload file.');
        }
    };

    useEffect(() => {
        fetchParticipants();
    }, []);

    return (
        <div>
            <h2>Raffle Participants</h2>
            <input type="file" onChange={handleFileUpload} />
            <p>{uploadStatus}</p>
            <table>
                <thead>
                    <tr>
                        <th>EMPID</th>
                        <th>EMPNAME</th>
                        <th>EMPCOMP</th>
                        <th>EMPCOMPID</th>
                    </tr>
                </thead>
                <tbody>
                    {participants.map((participant) => (
                        <tr key={participant.EMPID}>
                            <td>{participant.EMPID}</td>
                            <td>{participant.EMPNAME}</td>
                            <td>{participant.EMPCOMP}</td>
                            <td>{participant.EMPCOMPID}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function RaffleItems() {
    const [prizes, setPrizes] = useState([]);
    const [uploadStatus, setUploadStatus] = useState('');

    // Fetch prizes from the API
    const fetchPrizes = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/prizes');
            setPrizes(response.data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    // Handle file upload
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post('http://localhost:8000/api/prizes/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setUploadStatus('File uploaded successfully!');
            fetchPrizes(); // Refresh the list after upload
        } catch (error) {
            console.error('Upload error:', error);
            setUploadStatus('Failed to upload file.');
        }
    };

    useEffect(() => {
        fetchPrizes();
    }, []);

    return (
        <div>
            <h2>Raffle Items</h2>
            <input type="file" onChange={handleFileUpload} />
            <p>{uploadStatus}</p>
            <table>
                <thead>
                    <tr>
                        <th>RFLID</th>
                        <th>RFLNUM</th>
                        <th>RFLITEM</th>
                        <th>RFLITEMQTY</th>
                    </tr>
                </thead>
                <tbody>
                    {prizes.map((prize) => (
                        <tr key={prize.RFLID}>
                            <td>{prize.RFLID}</td>
                            <td>{prize.RFLNUM}</td>
                            <td>{prize.RFLITEM}</td>
                            <td>{prize.RFLITEMQTY}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function RaffleWinners() {
    const [winners, setWinners] = useState([]);

    const fetchWinners = async () => {
        const response = await fetch('/api/winners');
        const data = await response.json();
        setWinners(data);
    };

    useEffect(() => {
        fetchWinners();
    }, []);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        await fetch('/api/winners/upload', {
            method: 'POST',
            body: formData,
        });

        fetchWinners(); // Refresh the list after upload
    };

    return (
        <div>
            <h2>Raffle Winners</h2>
            <input type="file" onChange={handleFileUpload} />
            <table>
                <thead>
                    <tr>
                        <th>DRWID</th>
                        <th>DRWNUM</th>
                        <th>DRWNAME</th>
                        <th>DRWPRICE</th>
                    </tr>
                </thead>
                <tbody>
                    {winners.map((winner) => (
                        <tr key={winner.DRWID}>
                            <td>{winner.DRWID}</td>
                            <td>{winner.DRWNUM}</td>
                            <td>{winner.DRWNAME}</td>
                            <td>{winner.DRWPRICE}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
  
function RaffleDashboard() {
    const [currentPage, setCurrentPage] = useState('participants');

    const [generatedName, setGeneratedName] = useState('');
    const raffleTabRef = useRef(null);

    const [selectedPrize, setSelectedPrize] = useState(null);
    const [prizes, setPrizes] = useState(INITIAL_PRIZES);

    const [winners, setWinners] = useState(() => {
        const savedWinners = localStorage.getItem('winners');
        return savedWinners ? JSON.parse(savedWinners) : [];
    });

    const [isDrawDisabled, setIsDrawDisabled] = useState(true);
    const [isPrizeRevealed, setIsPrizeRevealed] = useState(false);

    const [isEndDrawModalOpen, setIsEndDrawModalOpen] = useState(false);

    const openEndDrawModal = () => {
        console.log("Opening End Draw Modal");
        setIsEndDrawModalOpen(true);
      };
      
      const handleConfirmEndDraw = () => {
        console.log("Confirm End Draw clicked");
        endDraw(); // Proceed with ending the draw
        setIsEndDrawModalOpen(false); // Close the modal
      };
      
      const handleCancelEndDraw = () => {
        console.log("Cancel End Draw clicked");
        setIsEndDrawModalOpen(false); // Close the modal without ending the draw
      };
      

    useEffect(() => {
        const handleMessage = (event) => {
          if (event.data.type === 'NAME_GENERATED') {
            setGeneratedName(event.data.name);
            localStorage.setItem('generatedName', event.data.name);
          } else if (event.data.type === 'RESTART_DRAW') {
            setGeneratedName('');
            setSelectedPrize(null);
            setPrizes(INITIAL_PRIZES);
            setIsDrawDisabled(true);
            setIsPrizeRevealed(false);
            localStorage.removeItem('generatedName');
            localStorage.removeItem('prizes');
          } else if (event.data.type === 'END_DRAW') {
            setWinners(event.data.winners);
            setIsEndDrawModalOpen(true); // Open the modal
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
        if (!selectedPrize || selectedPrize.quantity <= 0) return; // Ensure a prize is selected and quantity > 0 before generating a name

        const randomName = NAMES[Math.floor(Math.random() * NAMES.length)];
        setGeneratedName(randomName);
        localStorage.setItem('generatedName', randomName);

        if (raffleTabRef.current) {
          raffleTabRef.current.postMessage({ type: 'NAME_GENERATED', name: randomName }, '*');
          raffleTabRef.current.postMessage({ type: 'PRIZE_REVEALED', prize: selectedPrize }, '*');
        }

        const updatedPrizes = prizes.map(prize => 
            prize.name === selectedPrize.name ? { ...prize, quantity: prize.quantity - 1 } : prize
        );
        setPrizes(updatedPrizes);
        setSelectedPrize(prevSelectedPrize =>
            updatedPrizes.find(prize => prize.name === prevSelectedPrize.name)
          );
        localStorage.setItem('prizes', JSON.stringify(updatedPrizes));

        const newWinner = { name: randomName, prize: selectedPrize.name };
        const updatedWinners = [...winners, newWinner];
        setWinners(updatedWinners);
        localStorage.setItem('winners', JSON.stringify(updatedWinners));

        setIsDrawDisabled(true); // Disable the "Draw Winner" button after drawing
        setIsPrizeRevealed(true); // Reveal the prize after drawing

        if (raffleTabRef.current) {
            raffleTabRef.current.postMessage({ type: 'PRIZE_SELECTED', prize: selectedPrize }, '*');
            raffleTabRef.current.postMessage({ type: 'UPDATE_PRIZES', prizes: updatedPrizes }, '*');
            raffleTabRef.current.postMessage({ type: 'WINNER_ADDED', winner: newWinner }, '*');
        }
      };

      const restartDraw = () => {
        setGeneratedName('');
        setSelectedPrize(null);
        setPrizes(INITIAL_PRIZES);
        setIsDrawDisabled(true); // Disable the "Draw Winner" button after restarting
        setIsPrizeRevealed(false);
        localStorage.removeItem('generatedName');
        localStorage.removeItem('prizes');
        if (raffleTabRef.current) {
          raffleTabRef.current.postMessage({ type: 'RESTART_DRAW' }, '*');
        }
      };

    const selectPrize = (prize) => {
        setSelectedPrize(prize);
        setIsDrawDisabled(false); // Enable the "Draw Winner" button when a new prize is selected
        setIsPrizeRevealed(false); // Hide the prize when a new prize is selected
      };

      const endDraw = () => {
        // Clear local storage and current state
        localStorage.removeItem('winners');
        setWinners([]);
        
        // Send the complete winners list to the new tab
        if (raffleTabRef.current) {
            raffleTabRef.current.postMessage({ type: 'END_DRAW', winners: winners }, '*');
        }
    };    
    
    const renderContent = () => {
        switch (currentPage) {
          case 'participants':
            return <RaffleParticipants/>
          case 'items':
            return <RaffleItems/>
            case 'winners':
            return <RaffleWinners/>
          default:
            return <p>Welcome</p>;
        }
      };

  return (
    <div className="raffleDashboard-container">
        <div className="summary-grid-item">
            <div className='summary-container'>
                <div className='summary-container-header'>
                    <h3>Winners</h3>
                </div>
                <div className='summary-container-body'>
                    <table>
                    <thead>
                        <tr>
                        <th>Name</th>
                        <th>Prize</th>
                        </tr>
                    </thead>
                    <tbody>
                        {winners.map((winner, index) => (
                        <tr key={index}>
                            <td>{winner.name}</td>
                            <td>{winner.prize}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                <div className='summary-container-footer'>
                    
                </div>
            </div>
        </div>
        <div className="winner-grid-item">
            <div className='winner-container'>
                <div className='winner-container-header'>

                </div>
                <div className='winner-container-body'>
                    <p>Winner: {generatedName}</p>
                    {isPrizeRevealed && selectedPrize && <p>Selected Prize: {selectedPrize.name}</p>}
                </div>
                <div className='winner-container-footer'>
                    
                </div>
            </div>
        </div>
        <div className="tbl-grid-item">
            <div className='tbl-container'>
                <div className='tbl-container-header'>

                </div>
                <div className='tbl-container-body'>
                    <div className="navigation-buttons">
                        <button onClick={() => setCurrentPage('participants')}>
                            Raffle Participants
                        </button>
                        <button onClick={() => setCurrentPage('items')}>
                            Raffle Items
                        </button>
                        <button onClick={() => setCurrentPage('winners')}>
                            Raffle Winners
                        </button>
                    </div>
                    {renderContent()}
                </div>
                <div className='tbl-container-footer'>
                    
                </div>
            </div>
        </div>
        <div className="ctrl-grid-item">
            <div className='raffle-ctrl-container'>
                <div className='ctrl-container'>
                    <div className='ctrl-container-header'>

                    </div>
                    <div className='ctrl-container-body'>
                        <div className='ctrl-body-start'>
                            <button onClick={openRafflePage}>
                                Open Raffle
                            </button>
                            <button>Start Draw</button>
                        </div>
                        <div className='ctrl-body-mid'>
                            <button 
                                onClick={generateName} 
                                disabled={isDrawDisabled}>
                                    Draw Winner
                            </button>
                            <button onClick={restartDraw}>Waive Draw</button>
                        </div>
                        <div className='ctrl-body-end'>
                            <button onClick={openEndDrawModal}>
                                End Draw
                            </button>
                        </div>
                    </div>
                    <div className='ctrl-container-footer'>
                        
                    </div>
                </div>
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
        {isEndDrawModalOpen && (
                <EndDrawModal
                    winners={winners}
                    onConfirm={handleConfirmEndDraw}
                    onCancel={handleCancelEndDraw}
                />
            )}
    </div>
    );
}

export default RaffleDashboard;
