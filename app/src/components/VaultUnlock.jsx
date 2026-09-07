import { useState, useEffect } from 'react';
import { CONFIG } from '../config';

export function VaultUnlock({ onLaunch }) {
  const [code, setCode] = useState(['', '', '', '', '', '', '', '']);
  const [shake, setShake] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInput = (index, val) => {
    if (isSuccess) return;
    
    // Only allow numbers
    const digit = val.replace(/[^0-9]/g, '').slice(-1);
    
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);
    setShake(false); // Reset shake if they're typing
  };

  const attemptUnlock = () => {
    const entered = code.join('');
    if (entered === CONFIG.vaultCode) {
      setIsSuccess(true);
      if (onLaunch) onLaunch();
    } else {
      // Trigger shake animation
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className={`mission-card ${isSuccess ? 'success' : ''}`}>
      <h2 className="text-center text-rocket">The Final Vault</h2>
      <p className="text-center mb-4">You've collected all the crystals to activate the keypad!<br/>To unlock the final surprise, enter the date our journey began (DDMMYYYY).</p>

      {!isSuccess && (
        <>
          <div className={`keypad-display ${shake ? 'shake' : ''}`} style={{ flexWrap: 'wrap', gap: '8px' }}>
            {[0, 1, 2, 3, 4, 5, 6, 7].map(idx => (
              <input
                key={idx}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className={`digit-slot ${code[idx] ? 'active' : ''}`}
                value={code[idx]}
                onChange={e => handleInput(idx, e.target.value)}
                maxLength={1}
                style={{ textAlign: 'center', width: '32px', height: '40px', fontSize: '20px' }}
              />
            ))}
          </div>

          <div className="keypad-grid" style={{ maxWidth: '280px', margin: '0 auto' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button key={num} className="keypad-btn" onClick={() => {
                const emptyIdx = code.findIndex(d => d === '');
                if (emptyIdx !== -1) handleInput(emptyIdx, num.toString());
              }}>
                {num}
              </button>
            ))}
            <button className="keypad-btn" style={{ gridColumn: 2 }} onClick={() => {
              const emptyIdx = code.findIndex(d => d === '');
              if (emptyIdx !== -1) handleInput(emptyIdx, '0');
            }}>0</button>
            <button className="keypad-btn" style={{ backgroundColor: 'var(--sky)', color: 'var(--rocket)', fontSize: '16px' }} onClick={() => {
              // clear last digit
              const filledIdx = code.map(d => d !== '').lastIndexOf(true);
              if (filledIdx !== -1) {
                const newCode = [...code];
                newCode[filledIdx] = '';
                setCode(newCode);
              }
            }}>DEL</button>
          </div>
          
          {shake && <p className="text-center text-rocket mt-4">Incorrect code — try again!</p>}

          <div className="mt-8 text-center">
            <button className="btn-primary" onClick={attemptUnlock} disabled={code.join('').length !== 8}>
              Unlock
            </button>
          </div>
        </>
      )}

      {isSuccess && (
        <div className="mission-card success text-center mt-4" style={{ animation: 'popIn 0.5s ease-out' }}>
          <img 
            src="/mission_complete.jpg" 
            alt="Mission Complete" 
            style={{ width: '100%', borderRadius: '12px', marginBottom: '20px', boxShadow: 'var(--shadow)' }}
          />
          <h2 className="text-rocket mb-4">Mission Completion!</h2>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--ink)' }}>
            We've got the mission! We've got the mission!
            <br />
            Mission completion! 🎶
          </p>
          <p className="mt-4" style={{ fontStyle: 'italic', color: 'var(--text)' }}>
            *pat pat pat pat pat pat...* 🚀
          </p>
        </div>
      )}
    </div>
  );
}
