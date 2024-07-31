import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RaffleDashboard from './components/pages/RaffleDashboard';
import RafflePage from './components/pages/RafflePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RaffleDashboard />} />
        <Route path="/rafflePage" element={<RafflePage />} />
      </Routes>
    </Router>
  );
}

export default App;
