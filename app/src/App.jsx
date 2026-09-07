import { useState, useRef } from 'react';
import { PuzzleWordle } from './components/Puzzle_Wordle';
import { PuzzleAcrostic } from './components/Puzzle_Acrostic';
import { StageBMurdle } from './components/StageB_Murdle';
import { VaultUnlock } from './components/VaultUnlock';
import { StageGelBlasters } from './components/Stage_GelBlasters';
import { Rocket } from 'lucide-react';
import './styles.css';

function App() {
  // Stages: 'intro' -> 'wordle' -> 'acrostic' -> 'stageB' -> 'vault'
  const [stage, setStage] = useState('intro');
  const [crystals, setCrystals] = useState(0); // 0 to 3
  const [isLaunching, setIsLaunching] = useState(false);
  const pressTimer = useRef(null);

  // Hidden override: long press on Rocket for 3 seconds
  const handleRocketPressStart = () => {
    pressTimer.current = setTimeout(() => {
      // Cycle through stages for testing/override
      if (stage === 'intro') setStage('wordle');
      else if (stage === 'wordle') setStage('acrostic');
      else if (stage === 'acrostic') setStage('gelblasters');
      else if (stage === 'gelblasters') setStage('stageB');
      else if (stage === 'stageB') setStage('vault');
      else setStage('intro');
      
      // Give full crystals if we jump to vault
      if (stage === 'stageB') setCrystals(3);
    }, 3000);
  };

  const handleRocketPressEnd = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };

  const advanceTo = (nextStage, crystalsEarned) => {
    setStage(nextStage);
    // Don't downgrade crystals if they jump around
    if (crystalsEarned > crystals) {
      setCrystals(crystalsEarned);
    }
  };

  const handleLaunch = () => {
    setIsLaunching(true);
  };

  return (
    <div className="app-container">
      <header className="header">
        <div 
          className={`rocket-icon ${isLaunching ? 'rocket-launch-anim' : ''}`}
          onPointerDown={handleRocketPressStart}
          onPointerUp={handleRocketPressEnd}
          onPointerLeave={handleRocketPressEnd}
        >
          <Rocket size={48} fill="currentColor" strokeWidth={1.5} />
        </div>
        
        <div className="crystal-slots">
          {[1, 2, 3].map(num => (
            <div 
              key={num} 
              className={`crystal ${num <= crystals ? 'charged' : 'uncharged'}`}
              onClick={() => {
                if (num === 1) setStage('wordle');
                if (num === 2) setStage('gelblasters');
                if (num === 3) setStage('stageB');
              }}
              style={{ cursor: 'pointer' }}
            >
              {num <= crystals ? '✦' : '✧'}
            </div>
          ))}
        </div>
      </header>

      <main className="main-content">
        {stage === 'intro' && (
          <div className="mission-card">
            <h1 className="text-center text-rocket">Rocket's Birthday Mission</h1>
            <p className="text-center" style={{ fontSize: '20px', lineHeight: '1.6' }}>
              Mission Control calling Rocket! We need your help to reach the final destination.<br/><br/>
              Your ship requires <strong>three power crystals</strong> to fly. Solve the puzzles to find them!
            </p>
            <div className="text-center mt-8">
              <button className="btn-primary" onClick={() => setStage('wordle')}>
                Blast Off! 🚀
              </button>
            </div>
          </div>
        )}

        {stage === 'wordle' && (
          <PuzzleWordle onComplete={() => advanceTo('acrostic', 0)} />
        )}

        {stage === 'acrostic' && (
          <PuzzleAcrostic onComplete={() => advanceTo('gelblasters', 1)} />
        )}

        {stage === 'gelblasters' && (
          <StageGelBlasters onComplete={() => advanceTo('stageB', 2)} />
        )}

        {stage === 'stageB' && (
          <StageBMurdle onComplete={() => advanceTo('vault', 3)} />
        )}

        {stage === 'vault' && (
          <VaultUnlock onLaunch={handleLaunch} />
        )}
      </main>
    </div>
  );
}

export default App;
