import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import EndDrawModal from '../modals/EndDrawModal.js'; // Import the modal
import WaivePrizeModal from '../modals/WaivePrizeModal.js';
import '../css/RaffleDashboard.css';

// Table Pages //
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

    // Fetch winners from the API
    const fetchWinners = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/winners');
            setWinners(response.data);
        } catch (error) {
            console.error('Fetch winners error:', error);
        }
    };

    useEffect(() => {
        fetchWinners();
    }, []);

    return (
        <div>
            <h2>Raffle Winners</h2>
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
    const [selectedPrize, setSelectedPrize] = useState(null);
    const [prizes, setPrizes] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [winners, setWinners] = useState(() => {
        const savedWinners = localStorage.getItem('winners');
        return savedWinners ? JSON.parse(savedWinners) : [];
    });

    const raffleTabRef = useRef(null);
    const [isDrawDisabled, setIsDrawDisabled] = useState(true);
    const [isPrizeRevealed, setIsPrizeRevealed] = useState(false);
    
    const fetchPrizes = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/prizes');
            setPrizes(response.data); // Update state with fetched prizes
        } catch (error) {
            console.error('Failed to fetch prizes:', error);
        }
    };
    const fetchParticipants = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/participants');
            setParticipants(response.data); // Update state with fetched participants
        } catch (error) {
            console.error('Failed to fetch participants:', error);
        }
    };

    useEffect(() => {
        fetchPrizes();
        fetchParticipants();

        const handleMessage = (event) => {
            if (event.data.type === 'NAME_GENERATED') {
                setGeneratedName(event.data.name);
                localStorage.setItem('generatedName', event.data.name);
            } else if (event.data.type === 'RESTART_DRAW') {
                setGeneratedName('');
                setSelectedPrize(null);
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

    // Raffle Button Controls //
    const openRafflePage  = () => {
        const raffleTab = window.open('/rafflePage', '_blank');
        raffleTabRef.current = raffleTab;

        // Send a message to the RafflePage to show the welcome message
        if (raffleTab) {
            raffleTab.postMessage({ type: 'SHOW_WELCOME' }, '*');
        }
    };

    const startDraw = () => {
        if (raffleTabRef.current) {
          raffleTabRef.current.postMessage({ type: 'START_DRAW' }, '*');
        }
    };

    const fetchWinners = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/winners');
            setWinners(response.data);
        } catch (error) {
            console.error('Fetch winners error:', error);
        }
    };

    useEffect(() => {
        fetchWinners();
    }, []);

    const generateName = async () => {
        if (!selectedPrize || selectedPrize.RFLITEMQTY <= 0) {
            console.error('No valid prize selected or prize quantity is zero');
            return;
        }
    
        const randomParticipant = participants[Math.floor(Math.random() * participants.length)];
        if (!randomParticipant) {
            console.error('No participants available for drawing');
            return;
        }
    
        const randomName = randomParticipant.EMPNAME;
        const companyName = randomParticipant.EMPCOMP;
        setGeneratedName(`${randomName} (${companyName})`);
        localStorage.setItem('generatedName', `${randomName} (${companyName})`);
    
        const newWinner = { 
            DRWNUM: 1, 
            DRWNAME: `${randomName} (${companyName})`, 
            DRWPRICE: selectedPrize.RFLITEM };
    
        try {
            // Save to the database
            const response = await axios.post('http://localhost:8000/api/winners', newWinner);
    
            if (response.status === 201) {
                // Update prize quantity in the database
                const updatedPrize = { ...selectedPrize, RFLITEMQTY: selectedPrize.RFLITEMQTY - 1 };
                await axios.patch(`http://localhost:8000/api/prizes/${selectedPrize.RFLID}`, updatedPrize);
    
                // Update prize quantity
                const updatedPrizes = prizes.map(prize =>
                    prize.RFLID === selectedPrize.RFLID ? { ...prize, RFLITEMQTY: prize.RFLITEMQTY - 1 } : prize
                );
                setPrizes(updatedPrizes);
                setSelectedPrize(prevSelectedPrize =>
                    updatedPrizes.find(prize => prize.RFLID === prevSelectedPrize.RFLID)
                );
                localStorage.setItem('prizes', JSON.stringify(updatedPrizes));
    
                // Add winner to the state
                const winnerData = response.data;
                setWinners(prevWinners => [...prevWinners, winnerData]);
                localStorage.setItem('winners', JSON.stringify([...winners, winnerData]));
                
                 // Fetch winners to update the summary table
                fetchWinners();
    
                setIsDrawDisabled(true);
                setIsPrizeRevealed(true);
                raffleTabRef.current.postMessage({ type: 'NAME_GENERATED', name: `${randomName} (${companyName})` }, '*');
                raffleTabRef.current.postMessage({ type: 'PRIZE_REVEALED', prize: selectedPrize }, '*');
                raffleTabRef.current.postMessage({ type: 'UPDATE_PRIZES', prizes: updatedPrizes }, '*');
                raffleTabRef.current.postMessage({ type: 'WINNER_ADDED', winner: newWinner }, '*');
            }
        } catch (error) {
            console.error('Error saving winner or updating prize:', error);
        }
    
        setIsDrawDisabled(true);
        setIsPrizeRevealed(true);
    };
    
    const restartDraw = () => {
        setGeneratedName('');
        setSelectedPrize(null);
        setIsDrawDisabled(true); // Disable the "Draw Winner" button after restarting
        setIsPrizeRevealed(false);
        localStorage.removeItem('generatedName');
        localStorage.removeItem('prizes');

        // Fetch updated prizes and participants from the database
        fetchPrizes();
        fetchParticipants();

        if (raffleTabRef.current) {
            raffleTabRef.current.postMessage({ type: 'RESTART_DRAW' }, '*');
        }
    };

    const selectPrize = (prize) => {
        setSelectedPrize(prize);
        setIsDrawDisabled(prize.RFLITEMQTY <= 0); // Enable or disable the "Draw Winner" button based on prize quantity
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

    // Modal Functions //
    
    // Waive Prize Modal
    const [isWaivePrizeModalOpen, setIsWaivePrizeModalOpen] = useState(false);
    const [waivedWinner, setWaivedWinner] = useState(null);
    const [waivedPrizes, setWaivedPrizes] = useState([]);
    const [waivedWinners, setWaivedWinners] = useState([]);

    const handleWaive = async (option) => {
        if (!selectedPrize || selectedPrize.RFLITEMQTY <= 0) {
            console.error('No valid prize selected or prize quantity is zero');
            return;
        }
    
        const updatedPrizes = prizes.map((prize) =>
            prize.RFLID === selectedPrize.RFLID
                ? { ...prize, RFLITEMQTY: prize.RFLITEMQTY + 1 }
                : prize
        );
        setPrizes(updatedPrizes);
    
        const winnerToUpdate = winners.find(
            (winner) => winner.DRWNAME === generatedName && winner.DRWPRICE === selectedPrize.RFLITEM
        );
    
        if (!winnerToUpdate) {
            console.error('Winner not found');
            return;
        }
    
        const updatedWinners = winners.filter(winner => winner.DRWID !== winnerToUpdate.DRWID);
        setWinners(updatedWinners);
        setWaivedWinners(prev => [...prev, { ...winnerToUpdate, DRWNUM: 0 }]);
        localStorage.setItem('winners', JSON.stringify(updatedWinners));
        localStorage.setItem('waivedWinners', JSON.stringify([...waivedWinners, { ...winnerToUpdate, DRWNUM: 0 }]));
    
        try {
            await axios.patch(`http://localhost:8000/api/winners/${winnerToUpdate.DRWID}`, {
                DRWNUM: 0 // Indicating a waived draw
            });
    
            await axios.patch(`http://localhost:8000/api/prizes/${selectedPrize.RFLID}`, {
                RFLITEMQTY: selectedPrize.RFLITEMQTY + 1
            });
    
            raffleTabRef.current.postMessage({ type: 'WAIVE_NOTICE', name: winnerToUpdate.DRWNAME, prize: selectedPrize.RFLITEM }, '*');
        } catch (error) {
            console.error('Save waived prize error:', error);
        }
    
        if (option === 'redraw_same') {
            const filteredParticipants = participants.filter(
                participant => !updatedWinners.some(winner => winner.DRWNAME === participant.EMPNAME)
            );
            setParticipants(filteredParticipants);
            setGeneratedName('');
            setIsDrawDisabled(false);
            generateName();
        } else if (option === 'choose_new') {
            setSelectedPrize(null);
            setGeneratedName('');
            setIsDrawDisabled(true);
        }
    
        setIsWaivePrizeModalOpen(false); // Close the modal after waiving
    };
    
    const waivePrize = (winner) => {
        setSelectedPrize(prizes.find(prize => prize.RFLITEM === winner.DRWPRICE));
        setGeneratedName(winner.DRWNAME);
        setWaivedWinner(winner);
        setIsWaivePrizeModalOpen(true);
    };

    // End Draw Modal
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
                            <th>Company</th>
                            <th>Prize</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                            {winners.map((winner, index) => (
                                <tr key={index}>
                                    <td>{winner.DRWNAME}</td>
                                    <td>{winner.DRWNAME.split('(')[1].split(')')[0]}</td>
                                    <td>{winner.DRWPRICE}</td>
                                    <td>
                                        <button onClick={() => waivePrize(winner)}>Waive Prize</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className='summary-container-footer'>
                    
                </div>
                
                <div className='summary-container-header'>
                    <h3>Waived Prizes</h3>
                </div>
                <div className='summary-container-body'>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Company</th>
                                <th>Prize</th>
                            </tr>
                        </thead>
                        <tbody>
                            {waivedWinners.map((winner, index) => (
                                <tr key={index}>
                                    <td>{winner.DRWNAME}</td>
                                    <td>{winner.DRWNAME.split('(')[1].split(')')[0]}</td>
                                    <td>{winner.DRWPRICE}</td>
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
                    <p>Winner: {generatedName} </p>
                    {isPrizeRevealed && selectedPrize && <p>Selected Prize: {selectedPrize.RFLITEM}</p>}
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
                            <button onClick={startDraw}>
                                Start Draw
                            </button>
                        </div>
                        <div className='ctrl-body-mid'>
                            <button 
                                onClick={generateName} 
                                disabled={isDrawDisabled}>
                                    Draw Winner
                            </button>
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
                                {prizes.map((prize) => (
                                    <tr key={prize.RFLID}> {/* Use a unique identifier */}
                                        <td>{prize.RFLITEM}</td> {/* Adjust field names as needed */}
                                        <td>{prize.RFLITEMQTY}</td>
                                        <td>
                                            <button
                                                onClick={() => selectPrize(prize)}
                                                disabled={prize.RFLITEMQTY <= 0} // Disable if quantity is 0 or less
                                            >
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
            
            <WaivePrizeModal
                isOpen={isWaivePrizeModalOpen}
                onClose={() => setIsWaivePrizeModalOpen(false)}
                onWaive={handleWaive}
                selectedPrize={selectedPrize}
            />
            </div>
            );
        }

export default RaffleDashboard;
