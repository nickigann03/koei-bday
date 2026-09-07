import { useState } from 'react';
import { User, Package, MapPin, ArrowRight } from 'lucide-react';
import { CONFIG } from '../config';

export function StageBMurdle({ onComplete }) {
  const { categories, clues, solution, story } = CONFIG.stageB;
  
  // Grid state tracking
  const [gridState, setGridState] = useState({});
  const [finalWho, setFinalWho] = useState('');
  const [finalWhat, setFinalWhat] = useState('');
  const [finalWhere, setFinalWhere] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorShake, setErrorShake] = useState(false);
  
  // Card UI State
  const [activeCategory, setActiveCategory] = useState('who'); // 'who', 'what', 'where'
  const [selectedCard, setSelectedCard] = useState(null);

  const suspects = categories.who;
  const weapons = categories.what;
  const locations = categories.where;

  const getItemsForCategory = (cat) => {
    if (cat === 'who') return suspects;
    if (cat === 'what') return weapons;
    return locations;
  };

  const getIconForCategory = (cat, size = 48) => {
    if (cat === 'who') return <User size={size} />;
    if (cat === 'what') return <Package size={size} />;
    return <MapPin size={size} />;
  };

  const getColorForCategory = (cat) => {
    if (cat === 'who') return 'var(--rocket)';
    if (cat === 'what') return 'var(--sun-shadow)';
    return 'var(--mint)';
  };

  const cycleCard = () => {
    const items = getItemsForCategory(activeCategory);
    const currentIndex = items.indexOf(selectedCard);
    const nextIndex = (currentIndex + 1) % items.length;
    setSelectedCard(items[nextIndex]);
  };

  const toggleCell = (key) => {
    if (isSuccess) return;
    const current = gridState[key];
    let next = null;
    if (current === null || current === undefined) next = 'X';
    else if (current === 'X') next = 'O';
    else next = null;
    
    setGridState(prev => {
      const newState = { ...prev, [key]: next };
      
      // Auto-cross out logic: if a tick (O) is placed, all other cells in the same row/col of that block become X
      if (next === 'O') {
        const [prefix, cIdxStr, rIdxStr] = key.split('-');
        const cIdx = parseInt(cIdxStr);
        const rIdx = parseInt(rIdxStr);
        
        for (let i = 0; i < 3; i++) {
          if (i !== cIdx) newState[`${prefix}-${i}-${rIdx}`] = 'X';
          if (i !== rIdx) newState[`${prefix}-${cIdx}-${i}`] = 'X';
        }
      }
      return newState;
    });
  };

  const getCellDisplay = (key) => {
    const val = gridState[key];
    if (val === 'X') return '✗';
    if (val === 'O') return '✓';
    return '';
  };

  const getCellClass = (key) => {
    const val = gridState[key];
    if (val === 'X') return 'marked-x';
    if (val === 'O') return 'marked-o';
    return '';
  };

  const checkSolution = () => {
    if (finalWho === solution.who && finalWhat === solution.what && finalWhere === solution.where) {
      setIsSuccess(true);
    } else {
      setErrorShake(true);
      setTimeout(() => setErrorShake(false), 500);
    }
  };

  return (
    <div className={`mission-card ${isSuccess ? 'success' : ''}`}>
      <h2 className="text-center text-rocket">Part 3: The Missing Cake</h2>
      <p className="text-center mb-6">{story}</p>

      {!isSuccess && (
        <div className="murdle-container">
          
          {/* THE CARDS UI */}
          <div className="murdle-cards-wrapper mb-6">
            {!selectedCard ? (
              // GRID VIEW
              <div className="murdle-grid-view">
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
                  {getItemsForCategory(activeCategory).map(item => (
                    <div 
                      key={item} 
                      className="murdle-inv-card"
                      onClick={() => setSelectedCard(item)}
                    >
                      <div style={{ color: getColorForCategory(activeCategory), marginBottom: '16px' }}>
                        {getIconForCategory(activeCategory, 64)}
                      </div>
                      <h4 style={{ color: getColorForCategory(activeCategory), textTransform: 'uppercase', textAlign: 'center', letterSpacing: '1px' }}>
                        {item}
                      </h4>
                    </div>
                  ))}
                </div>
                
                {/* TABS */}
                <div className="murdle-tabs">
                  <span className={activeCategory === 'who' ? 'active' : ''} onClick={() => setActiveCategory('who')}>SUSPECTS</span>
                  <span> • </span>
                  <span className={activeCategory === 'what' ? 'active' : ''} onClick={() => setActiveCategory('what')}>WEAPONS</span>
                  <span> • </span>
                  <span className={activeCategory === 'where' ? 'active' : ''} onClick={() => setActiveCategory('where')}>LOCATIONS</span>
                </div>
                <p className="text-center text-sm mt-2" style={{ letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.6 }}>Pick up cards to learn more</p>
              </div>
            ) : (
              // DETAIL VIEW
              <div className="murdle-detail-view">
                <div className="murdle-detail-card">
                  <div style={{ color: 'var(--ink)', marginBottom: '24px', textAlign: 'center' }}>
                    {getIconForCategory(activeCategory, 80)}
                  </div>
                  <h2 style={{ textAlign: 'center', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '32px' }}>
                    {selectedCard}
                  </h2>
                  <p style={{ fontSize: '18px', lineHeight: '1.6', marginBottom: '32px', fontFamily: 'monospace' }}>
                    {CONFIG.stageB.descriptions[activeCategory][selectedCard].text}
                  </p>
                  <div style={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center', borderTop: '2px dashed #ccc', paddingTop: '16px', marginBottom: '32px' }}>
                    {CONFIG.stageB.descriptions[activeCategory][selectedCard].traits}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="murdle-btn black flex-grow" onClick={() => setSelectedCard(null)}>
                      SET CARD DOWN
                    </button>
                    <button className="murdle-btn black" style={{ padding: '0 24px' }} onClick={cycleCard}>
                      <ArrowRight size={24} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* THE LOGIC GRID */}
          <div className="murdle-grid-wrapper mb-8">
            <table className="murdle-grid">
              <thead>
                <tr>
                  <th className="empty-header"></th>
                  <th className="empty-header"></th>
                  <th className="category-header" colSpan={3}>SUSPECTS</th>
                  <th className="category-header" colSpan={3}>LOCATIONS</th>
                </tr>
                <tr>
                  <th className="empty-header"></th>
                  <th className="empty-header"></th>
                  {suspects.map(s => <th key={s} className="item-header-top"><span>{s}</span></th>)}
                  {locations.map(l => <th key={l} className="item-header-top"><span>{l}</span></th>)}
                </tr>
              </thead>
              <tbody>
                {/* WEAPONS ROWS */}
                {weapons.map((w, rIdx) => (
                  <tr key={w}>
                    {rIdx === 0 && <th className="category-header-side" rowSpan={3}><span>WEAPONS</span></th>}
                    <th className="item-header-side">{w}</th>
                    {/* Suspects x Weapons */}
                    {suspects.map((s, cIdx) => (
                      <td key={`SW-${cIdx}-${rIdx}`} className={`murdle-cell ${getCellClass(`SW-${cIdx}-${rIdx}`)}`} onClick={() => toggleCell(`SW-${cIdx}-${rIdx}`)}>
                        {getCellDisplay(`SW-${cIdx}-${rIdx}`)}
                      </td>
                    ))}
                    {/* Locations x Weapons */}
                    {locations.map((l, cIdx) => (
                      <td key={`LW-${cIdx}-${rIdx}`} className={`murdle-cell ${getCellClass(`LW-${cIdx}-${rIdx}`)}`} onClick={() => toggleCell(`LW-${cIdx}-${rIdx}`)}>
                        {getCellDisplay(`LW-${cIdx}-${rIdx}`)}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* LOCATIONS ROWS */}
                {locations.map((loc, rIdx) => (
                  <tr key={loc}>
                    {rIdx === 0 && <th className="category-header-side" rowSpan={3}><span>LOCATIONS</span></th>}
                    <th className="item-header-side">{loc}</th>
                    {/* Suspects x Locations */}
                    {suspects.map((s, cIdx) => (
                      <td key={`SL-${cIdx}-${rIdx}`} className={`murdle-cell ${getCellClass(`SL-${cIdx}-${rIdx}`)}`} onClick={() => toggleCell(`SL-${cIdx}-${rIdx}`)}>
                        {getCellDisplay(`SL-${cIdx}-${rIdx}`)}
                      </td>
                    ))}
                    {/* Empty Bottom Right block */}
                    <td colSpan={3} className="empty-block"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CLUES SECTION */}
          <div className="murdle-clues-section mb-8">
            <h3 className="murdle-clues-title">CLUES & EVIDENCE</h3>
            <ul className="murdle-clues-list">
              {clues.map((clue, idx) => (
                <li key={idx}><strong>{clue}</strong></li>
              ))}
            </ul>
          </div>

          {/* ACCUSATION SECTION */}
          <div className="murdle-accusation-section">
            <p className="text-center text-rocket font-bold mb-4">
              Do not make your accusation until you are confident you know the answer.
            </p>

            <select className="murdle-select" value={finalWho} onChange={e => setFinalWho(e.target.value)}>
              <option value="">WHO?</option>
              {suspects.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select className="murdle-select" value={finalWhat} onChange={e => setFinalWhat(e.target.value)}>
              <option value="">HOW?</option>
              {weapons.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select className="murdle-select" value={finalWhere} onChange={e => setFinalWhere(e.target.value)}>
              <option value="">WHERE?</option>
              {locations.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <button 
              className={`murdle-accuse-btn ${errorShake ? 'shake' : ''}`} 
              onClick={checkSolution}
            >
              MAKE YOUR ACCUSATION
            </button>
          </div>
        </div>
      )}

      {isSuccess && (
        <div className="hint-box mt-4" style={{ borderColor: 'var(--mint)' }}>
          <h3 className="text-mint mb-4 text-center">Crystal {CONFIG.stageB.crystalDigit} Charged!</h3>
          <p className="text-center"><strong>{CONFIG.stageB.revealMessage}</strong></p>
          <div className="mt-8 text-center">
            <button className="btn-primary" onClick={onComplete}>Unlock the Vault</button>
          </div>
        </div>
      )}
    </div>
  );
}
