import React, { useState, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axios from 'axios';
import EndDrawModal from '../modals/EndDrawModal.js'; // Import the modal
import WaivePrizeModal from '../modals/WaivePrizeModal.js';
import '../css/RaffleDashboard.css';
import { FaGripLines } from 'react-icons/fa'; // Import a hamburger icon from react-icons (or use any other icon library)

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
            <table className='raffle-participants-tbl'>
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
            <table className='raffle-items-tbl'>
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
            <table className='raffle-winners-tbl'>
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

    // State to manage the reordered prizes
    const [reorderedPrizes, setReorderedPrizes] = useState(prizes);
    
    const raffleTabRef = useRef(null);
    const [isStartDrawDisabled, setIsStartDrawDisabled] = useState(true);
    const [isEndDrawDisabled, setIsEndDrawDisabled] = useState(true);
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
        setIsStartDrawDisabled(true);
        fetchPrizes();
        fetchParticipants();

        const handleMessage = (event) => {
            if (event.data.type === 'NAME_GENERATED') {
                setGeneratedName(event.data.name);
                localStorage.setItem('generatedName', event.data.name);
                setIsDrawDisabled(false);
            } else if (event.data.type === 'RESTART_DRAW') {
                setGeneratedName('');
                setSelectedPrize(null);
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
    const openRafflePage = () => {
        setIsStartDrawDisabled(false);
        setIsEndDrawDisabled(false);

        const raffleTab = window.open('/rafflePage', '_blank');
        raffleTabRef.current = raffleTab;

        // Send a message to show the welcome message
        if (raffleTab) {
            raffleTab.postMessage({ type: 'WELCOME_MESSAGE' }, '*');
        }
    };

    // Function to handle drag and drop
    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        // If there is no destination (dropped outside the list) or the position hasn't changed
        if (!destination || (source.index === destination.index)) {
            return;
        }

        // Reorder the prizes based on drag and drop
        const reorderedPrizes = Array.from(prizes);
        const [movedPrize] = reorderedPrizes.splice(source.index, 1);
        reorderedPrizes.splice(destination.index, 0, movedPrize);

        // Update the state with reordered prizes
        setPrizes(reorderedPrizes);

        // Automatically select the prize at the bottom of the list
        const newSelectedPrize = reorderedPrizes[reorderedPrizes.length - 1];
        setSelectedPrize(newSelectedPrize);

        // Optional: You might want to save the reordered list to the server here
    };
    
    const startDraw = () => {
        setIsDrawDisabled(false); // Enable the select buttons
        if (raffleTabRef.current) {
            // Send a message to start the draw
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

     // Function to draw winners
    const drawPrize = async () => {
        // Clear previous winners and notify RafflePage
        raffleTabRef.current.postMessage({ type: 'RESET_WINNERS' }, '*');
        setGeneratedName([]);
        setIsPrizeRevealed(false);
        setSelectedPrize(null);

        // Ensure there are prizes available for selection
        if (prizes.length === 0) {
            console.error('No prizes available');
            return;
        }
    
        // Find the prize with the lowest RFLNUM (sequence number) that has a quantity > 0
        const selectedPrize = prizes.reduce((lowest, prize) => 
            (prize.RFLITEMQTY > 0 && (!lowest || prize.RFLNUM < lowest.RFLNUM)) ? prize : lowest
        , null);
    
        // Check if a valid prize was found
        if (!selectedPrize) {
            console.error('No valid prize available with quantity greater than 0');
            return;
        }
    
        // Determine the number of winners to draw based on the selected prize or default to 1
        const winnersCount = selectedPrize.winnersCount || 1;
        const winners = [];
        const usedParticipants = new Set();
    
        // Trigger slot machine spin animation
        raffleTabRef.current.postMessage({ type: 'TRIGGER_SPIN' }, '*');
    
        // Delay for the spin animation to complete before announcing winners
        setTimeout(async () => {
            for (let i = 0; i < winnersCount; i++) {
                let randomParticipant;
                do {
                    randomParticipant = participants[Math.floor(Math.random() * participants.length)];
                } while (randomParticipant && usedParticipants.has(randomParticipant.EMPNAME));
    
                if (!randomParticipant) {
                    console.error('No more unique participants available for drawing');
                    break;
                }
    
                usedParticipants.add(randomParticipant.EMPNAME);
    
                const randomName = randomParticipant.EMPNAME;
                const companyName = randomParticipant.EMPCOMP;
                const winnerName = `${randomName} (${companyName})`;
    
                winners.push(winnerName);
    
                const newWinner = { 
                    DRWNUM: winners.length, 
                    DRWNAME: winnerName, 
                    DRWPRICE: selectedPrize.RFLITEM 
                };
    
                try {
                    // Save the winner to the database
                    const response = await axios.post('http://localhost:8000/api/winners', newWinner);
    
                    if (response.status === 201) {
                        const winnerData = response.data;
                        setWinners(prevWinners => [...prevWinners, winnerData]);
    
                        // Notify with the generated name and winner added
                        raffleTabRef.current.postMessage({ 
                            type: 'WINNER_ADDED', 
                            winner: newWinner,
                            isRedraw: false }, '*');
                    } else {
                        console.error('Failed to save winner: ', response.status);
                    }
                } catch (error) {
                    console.error('Error saving winner:', error);
                }
            }
    
            // Send the winners array as a JSON string
            raffleTabRef.current.postMessage({ type: 'NAME_GENERATED', name: JSON.stringify(winners) }, '*');
    
            setGeneratedName(winners);
            setIsPrizeRevealed(true);
            localStorage.setItem('generatedName', JSON.stringify(winners));
    
            try {
                // Update the prize quantity in the database
                const updatedPrize = { ...selectedPrize, RFLITEMQTY: selectedPrize.RFLITEMQTY - winnersCount };
                const response = await axios.patch(`http://localhost:8000/api/prizes/${selectedPrize.RFLID}`, updatedPrize);
    
                if (response.status === 200) {
                    // Update prize quantity in state
                    const updatedPrizes = prizes.map(prize =>
                        prize.RFLID === selectedPrize.RFLID ? { ...prize, RFLITEMQTY: prize.RFLITEMQTY - winnersCount } : prize
                    );
                    setPrizes(updatedPrizes);
                    setSelectedPrize(updatedPrizes.find(prize => prize.RFLID === selectedPrize.RFLID) || null);
                    localStorage.setItem('prizes', JSON.stringify(updatedPrizes));
    
                    // Fetch winners to update the summary table
                    fetchWinners();
    
                    raffleTabRef.current.postMessage({ type: 'PRIZE_REVEALED', prize: selectedPrize }, '*');
                    raffleTabRef.current.postMessage({ type: 'UPDATE_PRIZES', prizes: updatedPrizes }, '*');
                } else {
                    console.error('Failed to update prize: ', response.status);
                }
            } catch (error) {
                console.error('Error updating prize:', error);
            }
        }, 3000); // Adjust delay based on slot machine animation duration
    };

    const [flippedCards, setFlippedCards] = useState([]);
    
    const redrawPrize = async () => {
        try {
            /// Exclude the waived winner from the list of participants
            const filteredParticipants = participants.filter(
                participant => !waivedWinners.some(waived => waived.DRWNAME === participant.EMPNAME)
            );

            if (filteredParticipants.length === 0) {
                console.error('No participants available for drawing');
                return;
            }
    
             // Randomly select a new participant
            const randomParticipant = filteredParticipants[Math.floor(Math.random() * filteredParticipants.length)];
            const newWinner = {
                DRWNUM: winners.length + 1,
                DRWNAME: `${randomParticipant.EMPNAME} (${randomParticipant.EMPCOMP})`,
                DRWPRICE: selectedPrize.RFLITEM,
                DRWPRICEID: selectedPrize.RFLID
            };
    
            // Save the new winner to the database
            const response = await axios.post('http://localhost:8000/api/winners', newWinner);
    
            if (response.status === 201) {
                const winnerData = response.data;
                setWinners(prevWinners => [...prevWinners, winnerData]);
                setGeneratedName([newWinner.DRWNAME]); // Set the new winner's name
                setIsPrizeRevealed(true); // Reveal the prize
                localStorage.setItem('winners', JSON.stringify([...winners, winnerData]));
                localStorage.setItem('generatedName', JSON.stringify([newWinner.DRWNAME]));

                // Notify Raffle Page about the new winner
                raffleTabRef.current.postMessage({
                    type: 'WINNER_ADDED',
                    winner: newWinner,
                    prize: selectedPrize,
                    isRedraw: true
                }, '*');

                // Deduct the prize quantity again after the redraw
                const updatedPrizes = prizes.map(prize =>
                    prize.RFLID === selectedPrize.RFLID
                        ? { ...prize, RFLITEMQTY: prize.RFLITEMQTY}
                        : prize
                );
                setPrizes(updatedPrizes);

                await axios.patch(`http://localhost:8000/api/prizes/${selectedPrize.RFLID}`, {
                    RFLITEMQTY: selectedPrize.RFLITEMQTY
                });

            } else {
                console.error('Failed to save new winner:', response.status);
            }
        } catch (error) {
            console.error('Error saving new winner:', error);
        }
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
        setIsDrawDisabled(prize.RFLITEMQTY <= 0);
        setGeneratedName(null);
        setIsPrizeRevealed(false);
    };
    
    const endDraw = () => {
        // Filter out winners with DRWNUM = 0
        const validWinners = winners.filter(winner => winner.DRWNUM === 1);

        // Clear local storage and current state
        localStorage.removeItem('winners');
        localStorage.removeItem('waivedWinners');
        setWinners(validWinners); // Set winners to only those with DRWNUM = 1
        setWaivedWinners([]);
        setGeneratedName('');
        setSelectedPrize(null);
        
        // Send the complete winners list to the new tab
        if (raffleTabRef.current) {
            raffleTabRef.current.postMessage({ type: 'END_DRAW', winners: validWinners }, '*');
        }
    }; 

    // Modal Functions //
    
    // Waive Prize Modal
    const [isWaivePrizeModalOpen, setIsWaivePrizeModalOpen] = useState(false);
    const [waivedWinner, setWaivedWinner] = useState(null);
    const [waivedPrizes, setWaivedPrizes] = useState([]);
    const [waivedWinners, setWaivedWinners] = useState([]);

    const handleWaive = async (option) => {
        if (!selectedPrize) { // Remove the check for prize quantity
            console.error('No valid prize selected');
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
    
            // Send a message to the Raffle Page
            raffleTabRef.current.postMessage({
                type: 'PRIZE_WAIVED',
                waivedPrize: {
                    name: winnerToUpdate.DRWNAME,
                    prize: selectedPrize.RFLITEM,
                    company: 'Company Name' // Adjust as needed
                }
            }, '*');
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
            redrawPrize();
        } else if (option === 'choose_new') {
            setSelectedPrize(null);
            setGeneratedName('');
        }
    
        setIsWaivePrizeModalOpen(false); // Close the modal after waiving
    };
    
    const waivePrize = (winner) => {
        setSelectedPrize(prizes.find(prize => prize.RFLITEM === winner.DRWPRICE));
        setGeneratedName(winner.DRWNAME);
        setWaivedWinner(winner);
        setIsWaivePrizeModalOpen(true);
        // Enable the select buttons for new prizes
        setIsDrawDisabled(false);
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

    const [winnerCount, setWinnerCount] = useState(1); // Default to 1 winner per draw

    // Handle change in the dropdown for selecting number of winners
    const handleWinnerCountChange = (event) => {
        setWinnerCount(parseInt(event.target.value, 10)); // Update winner count based on selection
    };

    const updatePrizeWinnersCount = (prizeId, count) => {
        setPrizes(prevPrizes =>
            prevPrizes.map(prize =>
                prize.RFLID === prizeId
                    ? { ...prize, winnersCount: count }
                    : prize
            )
        );
    };
    
    const updatePrizeSequence = (prizes) => {
        // Update the RFLNUM based on the new order
        const updatedPrizes = prizes.map((prize, index) => ({
            ...prize,
            RFLNUM: index + 1
        }));
        setPrizes(updatedPrizes); // Update the state with the new sequence
    };

  return (
    <div className="raffleDashboard-container">
        <div className="summary-grid-item">
            <div className='summary-container'>
                <div className='summary-container-header'>
                    <h3>Winners</h3>
                </div>
                <div className='summary-container-body'>
                    <table className='summary-winner-tbl'>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Company</th>
                            <th>Prize</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                            {winners
                                .filter(winner => winner.DRWNUM !== 0) // Filter out winners with DRWNUM = 0
                                .map((winner, index) => (
                                    <tr key={index}>
                                        <td>{winner.DRWNAME.split('(')[0].trim()}</td> 
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
                    <table className='summary-waived-winner-tbl'>
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
                                    <td>{winner.DRWNAME.split('(')[0].trim()}</td> 
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
                    <ul>
                        {generatedName && (
                            <p>
                                {Array.isArray(generatedName) ? generatedName.join(', ') : generatedName}
                            </p>
                        )}
                        {isPrizeRevealed && selectedPrize && <p>{selectedPrize.RFLITEM}</p>}
                    </ul>
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
                            <button 
                                onClick={openRafflePage}>
                                Open Raffle
                            </button>
                            <button 
                                onClick={startDraw}
                                disabled={isStartDrawDisabled}>
                                Start Draw
                            </button>
                        </div>
                        <div className='ctrl-body-mid'>
                            <button 
                                onClick={() => drawPrize(winnerCount)} 
                                disabled={!prizes.some(prize => prize.RFLITEMQTY > 0)}>
                                Draw Winners
                            </button>
                            <button
                                onClick={() => raffleTabRef.current.postMessage({ type: 'FLIP_ALL_CARDS' }, '*')}>
                                Flip All
                            </button>

                        </div>
                        <div className='ctrl-body-end'>
                            <button onClick={openEndDrawModal}
                                disabled={isEndDrawDisabled}>
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
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="prizeList">
                                {(provided) => (
                                    <table className="prize-tbl" ref={provided.innerRef} {...provided.droppableProps}>
                                        <thead>
                                            <tr>
                                                <th></th> {/* Empty header for drag handle */}
                                                <th>Prize</th>
                                                <th>Quantity</th>
                                                <th>Select</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {prizes.map((prize, index) => (
                                                <Draggable key={prize.RFLID} draggableId={prize.RFLID.toString()} index={index}>
                                                    {(provided) => (
                                                        <tr
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <td>
                                                                <FaGripLines style={{ cursor: 'grab' }} />
                                                            </td>
                                                            <td>{prize.RFLITEM}</td>
                                                            <td>{prize.RFLITEMQTY}</td>
                                                            <td>
                                                                <select 
                                                                    value={prize.winnersCount || 1} 
                                                                    onChange={(e) => updatePrizeWinnersCount(prize.RFLID, parseInt(e.target.value))}
                                                                    disabled={prize.RFLITEMQTY <= 0}
                                                                >
                                                                    {[...Array(Math.min(prize.RFLITEMQTY, 10)).keys()].map(i => (
                                                                        <option key={i + 1} value={i + 1}>
                                                                            {i + 1}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </tbody>
                                    </table>
                                )}
                            </Droppable>
                        </DragDropContext>
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