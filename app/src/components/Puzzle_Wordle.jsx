import { useState, useEffect } from 'react';
import { CONFIG } from '../config';

export function PuzzleWordle({ onComplete }) {
  const targetWord = CONFIG.stageA.wordle.word.toUpperCase();
  const wordLength = targetWord.length;
  const maxGuesses = 6;

  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isSuccess || guesses.length >= maxGuesses) return;

      if (e.key === 'Enter') {
        if (currentGuess.length === wordLength) {
          const newGuesses = [...guesses, currentGuess];
          setGuesses(newGuesses);
          setCurrentGuess('');

          if (currentGuess === targetWord) {
            setIsSuccess(true);
          }
        }
      } else if (e.key === 'Backspace') {
        setCurrentGuess(prev => prev.slice(0, -1));
      } else if (/^[A-Za-z]$/.test(e.key)) {
        if (currentGuess.length < wordLength) {
          setCurrentGuess(prev => prev + e.key.toUpperCase());
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, guesses, isSuccess, targetWord, wordLength]);

  // Virtual keyboard handler
  const handleKeyClick = (key) => {
    if (isSuccess || guesses.length >= maxGuesses) return;

    if (key === 'ENTER') {
      if (currentGuess.length === wordLength) {
        const newGuesses = [...guesses, currentGuess];
        setGuesses(newGuesses);
        setCurrentGuess('');

        if (currentGuess === targetWord) {
          setIsSuccess(true);
        }
      }
    } else if (key === 'DEL') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else {
      if (currentGuess.length < wordLength) {
        setCurrentGuess(prev => prev + key);
      }
    }
  };

  const getCellClass = (guess, i) => {
    if (!guess) return '';
    const char = guess[i];
    if (targetWord[i] === char) return 'correct';
    if (targetWord.includes(char)) return 'present';
    return 'absent';
  };

  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DEL']
  ];

  // Compute keyboard letter statuses
  const letterStatuses = {};
  guesses.forEach(guess => {
    for (let i = 0; i < wordLength; i++) {
      const char = guess[i];
      if (targetWord[i] === char) {
        letterStatuses[char] = 'correct';
      } else if (targetWord.includes(char) && letterStatuses[char] !== 'correct') {
        letterStatuses[char] = 'present';
      } else if (!targetWord.includes(char) && !letterStatuses[char]) {
        letterStatuses[char] = 'absent';
      }
    }
  });

  const getKeyStyle = (key) => {
    const status = letterStatuses[key];
    let bgColor = '#E5E5EA'; // default
    let color = 'var(--ink)';
    if (status === 'correct') { bgColor = 'var(--mint)'; color = 'white'; }
    else if (status === 'present') { bgColor = 'var(--sun)'; color = 'white'; }
    else if (status === 'absent') { bgColor = '#787C7E'; color = 'white'; }
    
    return {
      padding: key.length > 1 ? '12px 10px' : '12px 14px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: bgColor,
      color: color,
      fontWeight: 'bold',
      fontSize: '16px',
      fontFamily: 'var(--font-heading)'
    };
  };

  return (
    <div className={`mission-card ${isSuccess ? 'success' : ''}`}>
      <h2 className="text-center text-rocket">Mission: Finding Birthday Activity #1</h2>
      <p className="text-center mb-4">To get hints about the activity of your very first birthday adventure, you have to solve this WORDLE.</p>

      <div className="wordle-grid mb-4">
        {Array.from({ length: maxGuesses }).map((_, rowIndex) => {
          const isCurrentRow = rowIndex === guesses.length;
          const guess = guesses[rowIndex] || (isCurrentRow ? currentGuess : '');

          return (
            <div key={rowIndex} className="wordle-row">
              {Array.from({ length: wordLength }).map((_, colIndex) => {
                const char = guess[colIndex] || '';
                const stateClass = guesses[rowIndex] ? getCellClass(guess, colIndex) : (char ? 'filled' : '');

                return (
                  <div key={colIndex} className={`wordle-cell ${stateClass}`}>
                    {char}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {!isSuccess && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
          {keyboardRows.map((row, i) => (
            <div key={i} style={{ display: 'flex', gap: '6px' }}>
              {row.map(key => (
                <button
                  key={key}
                  onClick={() => handleKeyClick(key)}
                  style={getKeyStyle(key)}
                >
                  {key}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {isSuccess && (
        <div className="hint-box mt-4" style={{ borderColor: 'var(--mint)' }}>
          <h3 className="text-mint mb-4 text-center">Great Job!</h3>
          <p className="text-center"><strong>{CONFIG.stageA.wordle.successMessage}</strong></p>
          <div className="mt-8 text-center">
            <button className="btn-primary" onClick={onComplete}>Next Puzzle</button>
          </div>
        </div>
      )}
    </div>
  );
}
