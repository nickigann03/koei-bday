import { useState, useEffect, useRef } from 'react';
import { Target, Trophy } from 'lucide-react';

const WIN_SCORE = 15;
const GAME_TIME = 15;

export function StageGelBlasters({ onComplete }) {
  const [gameState, setGameState] = useState('idle'); // idle, playing, won, lost
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [targets, setTargets] = useState([]);
  const [splats, setSplats] = useState([]); // for visual feedback
  
  const gameAreaRef = useRef(null);

  // Timer countdown
  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState(score >= WIN_SCORE ? 'won' : 'lost');
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, score]);

  // Target spawner & despawner
  useEffect(() => {
    let spawner, despawner;
    if (gameState === 'playing') {
      spawner = setInterval(() => {
        setTargets(prev => {
          if (prev.length >= 6) return prev;
          const isBad = Math.random() > 0.7; // 30% chance of bomb
          return [...prev, {
            id: Date.now() + Math.random(),
            x: Math.random() * 80 + 10,
            y: Math.random() * 70 + 10,
            type: isBad ? 'bad' : 'good',
            spawnedAt: Date.now()
          }];
        });
      }, 500);

      despawner = setInterval(() => {
        const now = Date.now();
        setTargets(prev => prev.filter(t => now - t.spawnedAt < 1200));
      }, 100);
    }
    return () => {
      clearInterval(spawner);
      clearInterval(despawner);
    };
  }, [gameState]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_TIME);
    setTargets([]);
    setSplats([]);
    setGameState('playing');
  };

  const hitTarget = (e, id) => {
    e.stopPropagation(); // prevent clicking behind
    if (gameState !== 'playing') return;
    
    const targetEl = targets.find(t => t.id === id);
    if (!targetEl) return;

    if (targetEl.type === 'bad') {
      // Penalty for hitting bomb
      setScore(prev => Math.max(0, prev - 2));
      
      // Explosion splat
      setSplats(prev => [...prev, { id, x: targetEl.x, y: targetEl.y, icon: '💥' }]);
    } else {
      // Score for good target
      const newScore = score + 1;
      setScore(newScore);
      if (newScore >= WIN_SCORE) setGameState('won');
      
      // Normal splat
      setSplats(prev => [...prev, { id, x: targetEl.x, y: targetEl.y, icon: '💦' }]);
    }

    setTimeout(() => {
      setSplats(prev => prev.filter(s => s.id !== id));
    }, 800);

    setTargets(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="mission-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="text-center text-rocket mb-2">Gel Blaster Practice!</h2>
      
      {gameState === 'idle' && (
        <div className="text-center">
          <p className="mb-6">
            Get ready for Bomb Battle! You have <strong>{GAME_TIME} seconds</strong> to hit <strong>{WIN_SCORE} targets</strong>.<br/>
            Watch out for bombs 💣 (-2 points)! Targets disappear quickly.
          </p>
          <button className="btn-primary" style={{ marginTop: '24px' }} onClick={startGame}>
            Start Training 🔫
          </button>
        </div>
      )}

      {(gameState === 'playing' || gameState === 'lost') && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '18px', fontWeight: 'bold' }}>
            <span style={{ color: timeLeft <= 5 ? 'var(--lilac)' : 'var(--ink)' }}>Time: {timeLeft}s</span>
            <span style={{ color: 'var(--mint)' }}>Score: {score} / {WIN_SCORE}</span>
          </div>

          <div 
            ref={gameAreaRef}
            style={{ 
              position: 'relative', 
              width: '100%', 
              height: '350px', 
              backgroundColor: 'var(--code-bg)', 
              borderRadius: '12px',
              border: '2px dashed var(--border)',
              cursor: 'crosshair',
              overflow: 'hidden'
            }}
          >
            {targets.map(t => (
              <div 
                key={t.id}
                onClick={(e) => hitTarget(e, t.id)}
                style={{
                  position: 'absolute',
                  left: `${t.x}%`,
                  top: `${t.y}%`,
                  transform: 'translate(-50%, -50%)',
                  cursor: 'crosshair',
                  animation: 'popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
              >
                {t.type === 'bad' ? (
                  <div style={{ fontSize: '32px', filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.2))' }}>
                    💣
                  </div>
                ) : (
                  <div style={{
                    width: '40px', height: '40px', 
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}>
                    <Target size={24} color="var(--rocket)" />
                  </div>
                )}
              </div>
            ))}

            {splats.map(s => (
              <div
                key={`splat-${s.id}`}
                style={{
                  position: 'absolute',
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  transform: 'translate(-50%, -50%)',
                  fontSize: '32px',
                  pointerEvents: 'none',
                  animation: 'fadeOut 0.8s forwards'
                }}
              >
                {s.icon}
              </div>
            ))}

            {gameState === 'lost' && (
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(255,255,255,0.8)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
              }}>
                <h3 className="text-rocket mb-4">Time's Up!</h3>
                <button className="btn-primary" onClick={startGame}>Try Again</button>
              </div>
            )}
          </div>
        </>
      )}

      {gameState === 'won' && (
        <div className="text-center success" style={{ padding: '20px', animation: 'popIn 0.5s ease-out' }}>
          <Trophy size={48} color="var(--mint)" style={{ margin: '0 auto', marginBottom: '16px' }} />
          <h2 className="text-mint mb-4">Sharp Shooter!</h2>
          <p className="mb-6" style={{ fontSize: '18px' }}>You're fully loaded and ready for Bomb Battle! Here is your second crystal.</p>
          <button className="btn-primary" style={{ marginTop: '24px' }} onClick={onComplete}>
            Claim Crystal 💎
          </button>
        </div>
      )}
    </div>
  );
}
