import React from 'react';
import '../css/RaffleDashboard.css';

function RaffleDashboard() {
  return (
    <div className="raffleDashboard-container">
        <div className="grid-item">
            <div className='ctrl-container'>
                <div className='ctrl-container-header'>

                </div>
                <div className='ctrl-container-body'>
                    <a href="/raffle-page" target="_blank" rel="noopener noreferrer">
                        <button>Open Raffle Page</button>
                    </a>
                    <button>Draw Winner</button>
                    <button>Cancel Draw</button>
                    <button>Waive Prize</button>
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
                    <p>Item 2</p>
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
                    <p>Item 3</p>
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
                    <p>Item 4</p>
                </div>
                <div className='prize-container-footer'>
                    
                </div>
            </div>
        </div>
    </div>
    );
}

export default RaffleDashboard;
