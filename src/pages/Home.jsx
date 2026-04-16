import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TarotContext } from '../context/TarotContext';
import { BookOpen, Heart, Compass, Eye, Map, Briefcase, Zap, Sun, Shield, UserX, Infinity } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { setCurrentSpread, setCurrentCards, setQuestion, question } = useContext(TarotContext);
  
  const [showModal, setShowModal] = useState(false);
  const [pendingSpread, setPendingSpread] = useState(null);
  const [isPendingManual, setIsPendingManual] = useState(false);
  const [localInput, setLocalInput] = useState('');

  const initiateReading = (spreadId, isManual = false) => {
    // We always show the modal to allow optional context, but we tailor the placeholder
    setPendingSpread(spreadId);
    setIsPendingManual(isManual);
    setLocalInput('');
    setShowModal(true);
  };

  const confirmStartReading = () => {
    setQuestion(localInput);
    setCurrentSpread(pendingSpread);
    setCurrentCards([]);
    setShowModal(false);
    if (isPendingManual) {
      navigate('/manual-selection');
    } else {
      navigate('/reading');
    }
  };

  const categories = [
    {
      title: "Schnelle Orientierung",
      icon: <Zap size={24} />,
      color: "var(--accent-gold)",
      spreads: [
        { id: "1-card", name: "Tageskarte / Fokus", count: 1, desc: "Eine schnelle Antwort oder das Kernthema des Tages." },
        { id: "yes-no-3", name: "Ja / Nein (Präzise)", count: 3, desc: "Energie, Einfluss und klare Tendenz zur Frage." },
        { id: "problem-solution", name: "Problem & Lösung", count: 3, desc: "Problem, Ursache und direkt ein Lösungsweg." },
        { id: "daily-energy", name: "Tagesenergie", count: 3, desc: "Der Verlauf für Morgen, Nachmittag und Abend." }
      ]
    },
    {
      title: "Entwicklung & Wege",
      icon: <Compass size={24} />,
      color: "#4a9ebf",
      spreads: [
        { id: "3-cards", name: "Verlauf der Dinge", count: 3, desc: "Klassisch: Vergangenheit, Gegenwart, Zukunft." },
        { id: "decision", name: "Entscheidung (2 Wege)", count: 7, desc: "Ausgangssituation und der Verlauf von Weg A vs Weg B." },
        { id: "career", name: "Beruf & Karriere", count: 5, desc: "Hindernisse, Talente und Deine berufliche Entwicklung." },
        { id: "simple-cross", name: "Einfaches Kreuz", count: 4, desc: "Wo du stehst, was hilft, was blockiert und wohin es führt." }
      ]
    },
    {
      title: "Liebe & Beziehungen",
      icon: <Heart size={24} />,
      color: "#bf4a76",
      spreads: [
        { id: "love", name: "Liebes-Samen", count: 7, desc: "Wie eine Partnerschaft wächst und was euch blüht." },
        { id: "relationship-deep", name: "Beziehung Tiefgehend", count: 7, desc: "Du, dein Partner, das Problemfeld und der Rat der Karten." }
      ]
    },
    {
      title: "Große Analysen",
      icon: <Eye size={24} />,
      color: "#9f4abf",
      spreads: [
        { id: "celtic-cross", name: "Das Keltische Kreuz", count: 10, desc: "DER Klassiker. Ganzheitlicher Blick auf alle facetten." },
        { id: "year", name: "Jahreslegung", count: 12, desc: "Die tiefgreifende Energie für jeden Monat des Jahres." },
        { id: "shadow", name: "Schatten & Blockaden", count: 5, desc: "Ursprung der Blockaden und der Weg zur Entwirrung." },
        { id: "spiritual", name: "Spiritueller Weg", count: 7, desc: "Lernaufgaben, innere Stärke und dein nächster Schritt." }
      ]
    }
  ];

  const getModalPlaceholder = () => {
    if (pendingSpread === 'decision') return "z.B. Weg A ist neuer Job annehmen, Weg B ist beim jetzigen Arbeitgeber bleiben...";
    if (pendingSpread === 'relationship-deep') return "z.B. Beschreibe kurz eure aktuelle Dynamik oder um wen es konkret geht...";
    if (pendingSpread === 'yes-no-3') return "Stelle hier deine exakte Ja/Nein Frage...";
    return "Optional: Möchtest du dem Orakel vorab eine Frage oder ein Thema mitgeben?";
  };

  const getModalTitle = () => {
    if (pendingSpread === 'decision') return "Welche zwei Wege?";
    if (pendingSpread === 'relationship-deep') return "Wer ist involviert?";
    if (pendingSpread === 'yes-no-3') return "Deine Frage";
    return "Fokus der Legung";
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ paddingBottom: '4rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', textShadow: '0 0 20px var(--accent-gold-glow)' }}>
          Wähle dein Orakel
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.2rem', lineHeight: '1.6' }}>
          Jede Fragestellung verlangt ein anderes Muster. Wähle die Legetechnik, die am besten zu deiner aktuellen Situation passt.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        {categories.map((cat, idx) => (
          <div key={idx} style={{ 
            background: 'var(--card-bg)', 
            border: '1px solid var(--card-border)', 
            borderRadius: '24px', 
            padding: '2rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
              <div style={{ color: cat.color }}>{cat.icon}</div>
              <h2 style={{ fontSize: '1.8rem', color: cat.color }}>{cat.title}</h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {cat.spreads.map(spread => (
                <div key={spread.id} className="glass-panel hover-glow" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                      <h3 style={{ fontSize: '1.3rem', color: 'var(--accent-gold)' }}>{spread.name}</h3>
                      <span style={{ fontSize: '0.8rem', background: 'rgba(0,0,0,0.5)', padding: '0.2rem 0.6rem', borderRadius: '12px', color: 'var(--text-secondary)', border: '1px solid var(--card-border)' }}>
                        {spread.count} Karten
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.5', minHeight: '3rem' }}>
                      {spread.desc}
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn-mystic" style={{ flex: 2, padding: '0.8rem', fontSize: '1rem' }} onClick={() => initiateReading(spread.id, false)}>
                      Karten ziehen
                    </button>
                    <button className="btn-mystic" style={{ flex: 1, padding: '0.8rem', fontSize: '0.9rem', background: 'rgba(204,153,51,0.1)' }} onClick={() => initiateReading(spread.id, true)}>
                      Manuell
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Input Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
              background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <motion.div 
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="glass-panel"
              style={{ padding: '3rem', maxWidth: '600px', width: '90%', textAlign: 'center' }}
            >
              <h2 style={{ fontSize: '2rem', color: 'var(--accent-gold)', marginBottom: '1rem' }}>{getModalTitle()}</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.5' }}>
                Du kannst der KI hier noch Kontext mitgeben, der intensiv in die Karteninterpretation miteinfließen wird.
              </p>
              
              <textarea
                value={localInput}
                onChange={(e) => setLocalInput(e.target.value)}
                placeholder={getModalPlaceholder()}
                style={{
                  width: '100%', height: '120px', padding: '1rem', borderRadius: '12px',
                  background: 'rgba(0,0,0,0.5)', border: '1px solid var(--accent-gold)',
                  color: 'white', fontFamily: 'var(--font-body)', fontSize: '1rem',
                  resize: 'none', marginBottom: '2rem'
                }}
              />
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button className="btn-mystic" onClick={() => setShowModal(false)} style={{ background: 'transparent', border: '1px solid var(--card-border)' }}>
                  Abbrechen
                </button>
                <button className="btn-mystic" onClick={confirmStartReading}>
                  {localInput.trim() ? 'Mit Kontext fortfahren' : 'Ohne Kontext fortfahren'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default Home;
