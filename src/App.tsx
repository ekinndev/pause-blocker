import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OptionsPage from './components/OptionsPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<OptionsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
