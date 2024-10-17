import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useRef, useEffect } from 'react';
import { WAIVE_PRIZE_EVENT } from '../../constants/events';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axios from 'axios';
import EndDrawModal from '../modals/EndDrawModal.js'; // Import the modal
import WaivePrizeModal from '../modals/WaivePrizeModal.js';
import '../css/RaffleDashboard.css';
import { FaGripLines, FaInfoCircle  } from 'react-icons/fa'; // Import a hamburger icon from react-icons (or use any other icon library)

// Table Pages //
function Participants() {
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

function Prizes() {
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

function Winners() {
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

function PrizeForm({ fetchPrizes }) {
    const [prizeName, setPrizeName] = React.useState('');
    const [prizeQty, setPrizeQty] = React.useState(0);
    const [prizeOrder, setPrizeOrder] = React.useState(1);

    async function handleSavePrize() {
        try {
            // Fetch the highest RFLID and RFLNUM from the prize table
            const response = await axios.get('http://localhost:8000/api/prizes');
            let prizes = response.data;

            // Adjust the order of the prizes if needed
            const updatedPrizes = prizes.map(prize => {
                if (prize.RFLNUM >= prizeOrder) {
                    return {
                        ...prize,
                        RFLNUM: prize.RFLNUM + 1 // Shift the order of prizes with the same or higher order
                    };
                }
                return prize;
            });
            
             // Update the existing prizes' RFLNUM in the database
            for (const prize of updatedPrizes) {
                await axios.patch(`http://localhost:8000/api/prizes/${prize.RFLID}`, { RFLNUM: prize.RFLNUM });
            }
            
            // Prepare the new prize data
            const newPrize = {
                RFLID: prizes.length > 0 ? Math.max(...prizes.map(prize => prize.RFLID)) + 1 : 1,
                RFLNUM: prizeOrder, // Set the new prize order to the selected value
                RFLITEM: prizeName,
                RFLITEMQTY: prizeQty
            };

            // Save the new prize to the database
            await axios.post('http://localhost:8000/api/prizes', newPrize);

            // Re-fetch prizes to include the newly added prize
            const updatedResponse = await axios.get('http://localhost:8000/api/prizes');
            let refreshedPrizes = updatedResponse.data;

            // Sort the prizes by RFLNUM in descending order (lowest RFLNUM at the bottom)
            refreshedPrizes.sort((a, b) => b.RFLNUM - a.RFLNUM);

            // Clear form fields after successful save
            setPrizeName('');
            setPrizeQty(0);
            setPrizeOrder(1); // Reset the prize order to default

            // Call fetchPrizes to update the prize table
            fetchPrizes(refreshedPrizes);

            console.log("Prize added successfully");
        } catch (error) {
            console.error('Error adding prize:', error);
        }
    }

    return (
        <div>
            <div className='prize-dropdown'>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'center', width:"100%", marginBottom:"8px" }}>
                    <p
                    style={{ width:"50%", height: "24px", display: "flex", justifyContent: 'start', alignItems: 'center', padding: "0px", margin:"0px", fontWeight:"700"}}
                    >
                        Prize:  
                    </p>
                    <p
                    style={{ width:"25%", height: "24px", display: "flex", justifyContent: 'start', alignItems: 'center', padding: "0px", margin:"0px", fontWeight:"700"}}
                    >Quantity:   
                    </p>
                    <p
                    style={{ width:"25%", height: "24px", display: "flex", justifyContent: 'start', alignItems: 'center', padding: "0px", margin:"0px", fontWeight:"700"}}
                    >Order:   
                    </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'center', width:"100%", gap:'.5rem' }}>
                    <input
                        type="text"
                        placeholder="Prize Name"
                        value={prizeName}
                        onChange={(e) => setPrizeName(e.target.value)}
                        style={{ width:"50%" , height: "24px", display: "flex", justifyContent: 'end', alignItems: 'center', padding: "2px"}}
                    />
                    <input
                        type="number"
                        placeholder="Prize Quantity"
                        value={prizeQty}
                        onChange={(e) => setPrizeQty(parseInt(e.target.value, 10))}
                        style={{ width:"25%" , height: "24px", display: "flex", justifyContent: 'end', alignItems: 'center', padding: "2px"}}
                    />
                    <input
                        type="number"
                        placeholder="Order"
                        value={prizeOrder}
                        onChange={(e) => setPrizeOrder(parseInt(e.target.value, 10))}
                        style={{ width:"25%" , height: "24px", display: "flex", justifyContent: 'end', alignItems: 'center', padding: "2px"}}
                    />
                </div>
            </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <button 
                        onClick={handleSavePrize}
                        style={{ width: '150px', height: "32px", display: "flex", justifyContent: 'center', alignItems: 'center', margin:".5rem 0rem 0rem 0rem", fontSize:"16px", fontWeight:"700"}}
                        >
                        Add prize
                    </button>
                </div>
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

    // State for flip duration
    const [flipDuration, setFlipDuration] = useState(3000); // Default 3 seconds

    // Function to handle duration change from dropdown
    const handleDurationChange = (event) => {
        const newDuration = Number(event.target.value);
        setFlipDuration(newDuration);
    };
    
    const fetchPrizes = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/prizes');
            // Sort the prizes based on RFLNUM in ascending order
            const sortedPrizes = response.data.sort((a, b) => a.RFLNUM - b.RFLNUM);

            setPrizes(sortedPrizes); // Update state with sorted prizes
        } catch (error) {
            console.error('Failed to fetch prizes:', error);
        }
    };

    React.useEffect(() => {
        // Initial fetch for prizes when the component mounts
        fetchPrizes();
    }, []);
    
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

    // For drawing random winners
    const randomParticipants = (participants, winners, waivedWinners) => {
        // Step 1: Create a pool of participants excluding waived and already drawn winners
        const filteredParticipants = participants.filter(
            participant => 
                !waivedWinners.some(waived => waived.DRWNAME === participant.EMPNAME) && 
                !winners.some(winner => winner.DRWNAME === participant.EMPNAME)
        );
    
        if (filteredParticipants.length === 0) {
            console.error('No participants available for drawing');
            return null; // No valid participants
        }
    
        // Step 2: Create a weighted list based on past wins
        const weightedParticipants = filteredParticipants.map(participant => {
            const pastWins = winners.filter(winner => winner.DRWNAME === participant.EMPNAME).length;
    
            // Weight could be inversely proportional to the number of past wins
            return {
                participant,
                weight: Math.max(1, 10 - pastWins) // Adjust the weights as needed
            };
        });
    
        // Step 3: Normalize weights for selection
        const totalWeight = weightedParticipants.reduce((sum, wp) => sum + wp.weight, 0);
        
        // Generate a random number between 0 and total weight
        const randomValue = Math.random() * totalWeight;
    
        // Step 4: Select participant based on weighted probability
        let cumulativeWeight = 0;
        for (const { participant, weight } of weightedParticipants) {
            cumulativeWeight += weight;
            if (randomValue <= cumulativeWeight) {
                return participant; // Selected participant
            }
        }
    
        return null; // Fallback in case no participant is selected
    };

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
        const winnersCount = selectedPrize.RFLITEMQTY; 
        const winners = [];
        const usedParticipants = new Set();
    
        // Trigger slot machine spin animation
        raffleTabRef.current.postMessage({ type: 'TRIGGER_DRAW' }, '*');
    
        // Delay for the spin animation to complete before announcing winners
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

        // Notify about all winners added
        winners.forEach((winner, index) => {
            raffleTabRef.current.postMessage({ 
                type: 'WINNER_ADDED', 
                winner: { DRWNUM: index + 1, DRWNAME: winner, DRWPRICE: selectedPrize.RFLITEM },
                isRedraw: false ,
                flipDuration: flipDuration 
            }, '*');
        });

        try {
            // Update the prize quantity in the database
            const updatedPrize = { ...selectedPrize, RFLITEMQTY: 0 };
            const response = await axios.patch(`http://localhost:8000/api/prizes/${selectedPrize.RFLID}`, updatedPrize);

            if (response.status === 200) {
                // Update prize quantity in state
                const updatedPrizes = prizes.map(prize =>
                    prize.RFLID === selectedPrize.RFLID ? { ...prize, RFLITEMQTY: 0 } : prize
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
    };

    const [flippedCards, setFlippedCards] = useState([]);
    
    const redrawPrize = async () => {
        try {
            const randomParticipant = randomParticipants(participants, winners, waivedWinners);
           
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
                    isRedraw: true,
                    waivedWinnerName: waivedWinner.DRWNAME
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
        const validWinners = winners.filter(winner => winner.DRWNUM !== 0);

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

        // Send message to rafflePage to trigger hover effect
        const dashboardWindow = window.opener || window.parent;
            if (dashboardWindow) {
                dashboardWindow.postMessage({
                    type: 'PRIZE_WAIVED',
                    waivedPrizeName: winner.DRWNAME, // Send winner's name
                }, '*');
            }
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
            return <Participants/>
          case 'items':
            return <Prizes/>
            case 'winners':
            return <Winners/>
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

    const handleDeletePrize = async (RFLID, RFLNUM) => {
        try {
            // Delete the selected prize
            await axios.delete(`http://localhost:8000/api/prizes/${RFLID}`);
    
            // Fetch the remaining prizes and reorder them
            const response = await axios.get('http://localhost:8000/api/prizes');
            let updatedPrizes = response.data;
    
            // Reorder prizes by decrementing RFLNUM for those that have RFLNUM > the deleted prize's RFLNUM
            updatedPrizes = updatedPrizes.map(prize => {
                if (prize.RFLNUM > RFLNUM) {
                    return {
                        ...prize,
                        RFLNUM: prize.RFLNUM - 1
                    };
                }
                return prize;
            });
    
            // Update the RFLNUM of remaining prizes in the database
            for (const prize of updatedPrizes) {
                await axios.patch(`http://localhost:8000/api/prizes/${prize.RFLID}`, { RFLNUM: prize.RFLNUM });
            }
    
            // Update the state to reflect the changes in the UI
            fetchPrizes(); // Re-fetch the updated prizes and update the state
            console.log("Prize deleted and order updated successfully");
        } catch (error) {
            console.error('Error deleting prize:', error);
        }
    };    

    // Page Rendering
    const [activeTab, setActiveTab] = useState('ctrlGrid');

    // Function to render content based on active tab
    const renderActivePage = () => {
        switch (activeTab) {
            case 'ctrlGrid':
                return (
                    <div className="ctrl-grid-item" style={{ backgroundColor:'#D3D3D3'}}>
                        <div className='ctrl-grid-body'>
                            <div className='raffle-ctrl-container'>
                                <div className='ctrl-container'>
                                    <div className='ctrl-container-body'>
                                        <div className='ctrl-body-start'>
                                            <div className='button-wrapper'>
                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                    <button 
                                                        onClick={openRafflePage}
                                                        style={{ width: '150px', height: "32px", display: "flex", justifyContent: 'center', alignItems: 'center'}}>
                                                        Open Raffle
                                                    </button>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                    <button 
                                                        onClick={startDraw}
                                                        disabled={isStartDrawDisabled}
                                                        style={{ width: '150px', height: "32px", display: "flex", justifyContent: 'center', alignItems: 'center'}}>
                                                        Start Draw
                                                    </button>
                                                </div>
                                                
                                            </div>
                                            <div className='button-wrapper'>
                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width:"100%" }}>
                                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                        <label htmlFor="duration-select"
                                                            style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: "24px" }}>Set Flip Duration:&nbsp;</label>
                                                        <select
                                                            id="duration-select"
                                                            value={flipDuration}
                                                            onChange={handleDurationChange} // Update the flip duration
                                                            style={{ width: '150px', height: "24px", display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                                                            >
                                                            <option value={2000}>2 seconds</option>
                                                            <option value={3000}>3 seconds</option>
                                                            <option value={5000}>5 seconds</option>
                                                            <option value={10000}>10 seconds</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='button-wrapper'>
                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                    <button 
                                                        onClick={() => drawPrize(winnerCount)} 
                                                        style={{ width: '150px', height: "64px", display: "flex", justifyContent: 'center', alignItems: 'center'}}
                                                        disabled={!prizes.some(prize => prize.RFLITEMQTY > 0)}>
                                                        Draw Winners
                                                    </button>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                    <button
                                                        style={{ width: '150px', height: "64px", display: "flex", justifyContent: 'center', alignItems: 'center'}}
                                                        onClick={() => raffleTabRef.current.postMessage({ type: 'FLIP_ALL_CARDS' }, '*')}>
                                                        &nbsp;Flip All
                                                    </button>
                                                </div>
                                            </div>
                                            <div className='button-wrapper'>
                                                <div className='button-info-wrapper'>
                                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                        <button 
                                                            onClick={openEndDrawModal}
                                                            style={{ width: '150px', height: "32px", display: "flex", justifyContent: 'center', alignItems: 'center'}}
                                                            disabled={isEndDrawDisabled}>
                                                            End Draw
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='ctrl-container-footer'>
                                        
                                    </div>
                                </div>
                                <div className='prize-container'>
                                    <div className='prize-container-header'>

                                    </div>
                                    <div className='prize-container-body'>
                                        <div style={{ border:"3px solid #000", padding:".5rem"}}> 
                                            <table className="prize-tbl">
                                                <thead>
                                                    <tr>
                                                        <th>Prize</th>
                                                        <th>QTY</th>
                                                        <th>Order</th>
                                                        <th>Action</th> {/* Column for Delete button */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {prizes.map((prize, index) => (
                                                        <tr key={index}>
                                                            <td>{prize.RFLITEM}</td>
                                                            <td>{prize.RFLITEMQTY}</td>
                                                            <td>{prize.RFLNUM}</td>
                                                            <td>
                                                                <button onClick={() => handleDeletePrize(prize.RFLID, prize.RFLNUM)}>
                                                                    Delete
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className='prize-container-footer'>
                                        
                                    </div>
                                </div>
                            </div>

                            <div className="summary-grid-item">
                                <div className='summary-container'>
                                    
                                    <div className='summary-container-body'>
                                        <div className='summary-container-header'>
                                            <h3>Winners</h3>
                                        </div>
                                        <table className='summary-winner-tbl'>
                                            <thead>
                                            <tr>
                                                <th>Actions</th>
                                                <th>Name</th>
                                                <th>Company</th>
                                                <th>Prize</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                                {winners
                                                    .filter(winner => winner.DRWNUM !== 0) // Filter out winners with DRWNUM = 0
                                                    .map((winner, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                <button 
                                                                style={{ padding:".25rem"}}
                                                                onClick={() => {
                                                                        waivePrize(winner); // This will still waive the prize
                                                                        // Send a message to the rafflePage to trigger hover effect
                                                                        const dashboardWindow = window.opener || window.parent;
                                                                        if (dashboardWindow) {
                                                                            dashboardWindow.postMessage({
                                                                                type: 'TRIGGER_HOVER_EFFECT',
                                                                                winnerName: winner.DRWNAME // Assuming DRWID is a unique identifier for the winner
                                                                            }, '*');
                                                                        }
                                                                    }}
                                                                >
                                                                    Waive Prize
                                                                </button>
                                                            </td>
                                                            <td style={{ padding:".25rem .5rem"}}>{winner.DRWNAME.split('(')[0].trim()}</td> 
                                                            <td style={{ padding:".25rem .5rem", maxWidth: "150px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textAlign: "start" }}>{winner.DRWNAME.split('(')[1].split(')')[0]}</td>
                                                            <td style={{ padding:".25rem .5rem"}}>{winner.DRWPRICE}</td>
                                                            
                                                        </tr>
                                                    ))}
                                            </tbody>

                                        </table>
                                    </div>
                                    
                                    <div className='summary-container-body'>
                                        <div className='summary-container-header'>
                                            <h3>Waived Prizes</h3>
                                        </div>
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

                                </div>
                            </div>      
                        </div>         
                     </div>
                );
            case 'tblGrid':
                return (
                    <div className="tbl-grid-item">
                        <div className="winner-grid-item">
                                <div className='winner-container'>
                                    <div className='winner-container-header'>

                                    </div>
                                    <div className='winner-container-body'>
                                        <ul>
                                            {generatedName && (
                                                Array.isArray(generatedName) ? 
                                                generatedName.map((name, index) => (
                                                    <li key={index}>{name}</li> // Display each name as a separate list item
                                                )) : (
                                                    <li>{generatedName}</li> // Display a single name if it's not an array
                                                )
                                            )}
                                            
                                        </ul>
                                    </div>
                                    <div className='winner-container-footer'>
                                        {isPrizeRevealed && selectedPrize && <p className="prize-item">{selectedPrize.RFLITEM}</p>}
                                    </div>
                                </div>
                        </div>
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
                );
            default:
                return <p>Welcome to the Raffle Dashboard</p>;
        }
    };

  return (
    <div className="raffleDashboard-container">

         {/* Tabs at the top */}
         <div className="tab-bar">
            <button onClick={() => setActiveTab('ctrlGrid')} className={activeTab === 'ctrlGrid' ? 'active' : ''}>
                Control Panel
            </button>
            <button onClick={() => setActiveTab('tblGrid')} className={activeTab === 'tblGrid' ? 'active' : ''}>
                Table View
            </button>
        </div>

        {/* Content area based on active tab */}
        <div className="content-area">
            {renderActivePage()}
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