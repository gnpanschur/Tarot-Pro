import React, { createContext, useState, useEffect } from 'react';

export const TarotContext = createContext();

export const TarotProvider = ({ children }) => {
  // Settings State
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('tarot_apiKey') || import.meta.env.VITE_OPENAI_API_KEY || '';
  });
  const [cardBackIndex, setCardBackIndex] = useState(() => parseInt(localStorage.getItem('tarot_cardBack')) || 1);
  const [isLexiconOpen, setIsLexiconOpen] = useState(false);
  
  // Journal State
  const [journal, setJournal] = useState(() => {
    const saved = localStorage.getItem('tarot_journal');
    return saved ? JSON.parse(saved) : [];
  });

  // Current Reading State stored in Session Storage
  const [currentSpread, setCurrentSpread] = useState(() => sessionStorage.getItem('tarot_currentSpread') || null);
  const [currentCards, setCurrentCards] = useState(() => {
    const saved = sessionStorage.getItem('tarot_currentCards');
    return saved ? JSON.parse(saved) : [];
  });
  const [question, setQuestion] = useState(() => sessionStorage.getItem('tarot_question') || '');

  // Persist session state
  useEffect(() => {
    if (currentSpread) sessionStorage.setItem('tarot_currentSpread', currentSpread);
    else sessionStorage.removeItem('tarot_currentSpread');
  }, [currentSpread]);

  useEffect(() => {
    sessionStorage.setItem('tarot_currentCards', JSON.stringify(currentCards));
  }, [currentCards]);

  useEffect(() => {
    sessionStorage.setItem('tarot_question', question);
  }, [question]);

  // Persist settings
  useEffect(() => {
    localStorage.setItem('tarot_apiKey', apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('tarot_cardBack', cardBackIndex);
  }, [cardBackIndex]);

  useEffect(() => {
    localStorage.setItem('tarot_journal', JSON.stringify(journal));
  }, [journal]);

  const saveToJournal = (reading) => {
    setJournal(prev => [{ id: Date.now(), date: new Date().toISOString(), ...reading }, ...prev]);
  };

  const getCardBackImage = () => {
    return `/Tarot_webp/back0${cardBackIndex}.webp`;
  };

  return (
    <TarotContext.Provider value={{
      apiKey, setApiKey,
      cardBackIndex, setCardBackIndex, getCardBackImage,
      journal, saveToJournal,
      currentSpread, setCurrentSpread,
      currentCards, setCurrentCards,
      question, setQuestion,
      isLexiconOpen, setIsLexiconOpen
    }}>
      {children}
    </TarotContext.Provider>
  );
};
