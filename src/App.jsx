import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TarotContext, TarotProvider } from './context/TarotContext';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Reading from './pages/Reading';
import ManualSelection from './pages/ManualSelection';
import Lexicon from './pages/Lexicon';

const LexiconOverlay = () => {
  const { isLexiconOpen } = React.useContext(TarotContext);
  if (!isLexiconOpen) return null;
  return <Lexicon />;
};

const Journal = () => (
  <div style={{ textAlign: 'center', padding: '4rem' }}>
    <h2 style={{ fontSize: '2rem', color: 'var(--accent-gold)' }}>Dein Journal</h2>
    <p style={{ color: 'var(--text-secondary)' }}>Hier werden bald deine vergangenen Legungen gespeichert.</p>
  </div>
);

function App() {
  return (
    <TarotProvider>
      <Router>
        <NavBar />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reading" element={<Reading />} />
            <Route path="/manual-selection" element={<ManualSelection />} />
            <Route path="/journal" element={<Journal />} />
          </Routes>
          <LexiconOverlay />
        </main>
      </Router>
    </TarotProvider>
  );
}

export default App;
