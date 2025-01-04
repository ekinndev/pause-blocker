import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import OptionsPage from './components/OptionsPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<OptionsPage />} />
        <Route path='/index.html' element={<OptionsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
