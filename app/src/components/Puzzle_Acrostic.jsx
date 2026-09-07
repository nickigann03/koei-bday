import { useState, useRef } from 'react';
import { CONFIG } from '../config';

export function PuzzleAcrostic({ onComplete }) {
  const { clues, targetWord, revealMessage } = CONFIG.stageA.acrostic;

  // Initialize state for each clue's input word
  const [inputs, setInputs] = useState(
    clues.map(c => Array(c.answer.length).fill(''))
  );
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRefs = useRef([]);

  const handleInput = (clueIndex, charIndex, val) => {
    if (isSuccess) return;

    // Only A-Z
    const char = val.toUpperCase().replace(/[^A-Z]/g, '').slice(-1);

    const newInputs = [...inputs];
    newInputs[clueIndex] = [...newInputs[clueIndex]];
    newInputs[clueIndex][charIndex] = char;
    setInputs(newInputs);

    if (char) {
      // Focus next if it exists
      if (charIndex < clues[clueIndex].answer.length - 1) {
        inputRefs.current[clueIndex][charIndex + 1]?.focus();
      }
    }

    // Check if everything matches the answers
    let won = true;
    for (let i = 0; i < clues.length; i++) {
      const currentWord = newInputs[i].join('');
      if (currentWord !== clues[i].answer) {
        won = false;
        break;
      }
    }

    if (won) {
      setIsSuccess(true);
    }
  };

  const handleKeyDown = (clueIndex, charIndex, e) => {
    if (e.key === 'Backspace' && !inputs[clueIndex][charIndex]) {
      // If empty and backspace is pressed, focus previous
      if (charIndex > 0) {
        inputRefs.current[clueIndex][charIndex - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && charIndex > 0) {
      inputRefs.current[clueIndex][charIndex - 1]?.focus();
    } else if (e.key === 'ArrowRight' && charIndex < clues[clueIndex].answer.length - 1) {
      inputRefs.current[clueIndex][charIndex + 1]?.focus();
    }
  };

  const isRowCorrect = (clueIndex) => {
    return inputs[clueIndex].join('') === clues[clueIndex].answer;
  };

  return (
    <div className={`mission-card ${isSuccess ? 'success' : ''}`}>
      <h2 className="text-center text-rocket">Part 2: The Final Clue</h2>
      <p className="text-center mb-4">Fill in the blanks to reveal your activity!</p>
      <p className="text-center mb-4">The first letter of every word will be your next clue! </p>
      <div className="acrostic-container">
        {clues.map((clueObj, clueIndex) => {
          const rowCorrect = isRowCorrect(clueIndex);
          return (
            <div key={clueIndex} className={`acrostic-row ${rowCorrect ? 'correct-row-container' : ''}`}>
              <div className="acrostic-word">
                {Array.from({ length: clueObj.answer.length }).map((_, charIndex) => {
                  // The first letter is the "target letter" for BRACELET
                  const isTargetLetter = charIndex === 0;
                  const char = inputs[clueIndex][charIndex];

                  let cellClass = 'acrostic-cell';
                  if (isTargetLetter) cellClass += ' target-letter';
                  if (rowCorrect && !isTargetLetter) cellClass += ' correct-row-cell';
                  if (isSuccess && isTargetLetter) cellClass += ' correct';

                  return (
                    <input
                      key={charIndex}
                      ref={el => {
                        if (!inputRefs.current[clueIndex]) inputRefs.current[clueIndex] = [];
                        inputRefs.current[clueIndex][charIndex] = el;
                      }}
                      type="text"
                      className={cellClass}
                      value={char}
                      onChange={e => handleInput(clueIndex, charIndex, e.target.value)}
                      onKeyDown={e => handleKeyDown(clueIndex, charIndex, e)}
                      disabled={isSuccess || rowCorrect}
                    />
                  );
                })}
              </div>
              <div className="acrostic-clue">
                {clueObj.clue}
                {rowCorrect && <span style={{ marginLeft: '8px', color: 'var(--mint)' }}>✔</span>}
              </div>
            </div>
          )
        })}
      </div>

      {isSuccess && (
        <div className="hint-box mt-8 text-center" style={{ borderColor: 'var(--mint)' }}>
          <h2 className="text-mint mb-4">Crystal {CONFIG.stageA.crystalDigit} Charged!</h2>
          <p style={{ fontSize: '18px' }}><strong>{revealMessage}</strong></p>
          <div className="mt-8">
            <button className="btn-primary" onClick={onComplete}>Next Mission</button>
          </div>
        </div>
      )}
    </div>
  );
}
