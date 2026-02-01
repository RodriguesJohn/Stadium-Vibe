
import React, { useState, useRef, useEffect } from 'react';
import { ScoreState, Sticker } from '../types';

interface ResultPreviewProps {
  image: string;
  onDone: () => void;
  onShare: () => void;
}

const ResultPreview: React.FC<ResultPreviewProps> = ({ image, onDone, onShare }) => {
  const [score, setScore] = useState<ScoreState>({ 
    home: Math.floor(Math.random() * 4), 
    away: Math.floor(Math.random() * 3) 
  });
  const [showScoreboard, setShowScoreboard] = useState(true);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [particles, setParticles] = useState<{id: number, x: number, y: number, color: string}[]>([]);
  
  const nextId = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const defaultStickers: Sticker[] = [
      { id: 'def-1', type: 'text', value: 'GOAL', x: 25, y: 75, rotation: -12, scale: 1.6 },
      { id: 'def-2', type: 'text', value: 'LEGEND', x: 75, y: 82, rotation: 8, scale: 1.3 },
      { id: 'def-3', type: 'icon', value: '🔥', x: 85, y: 15, rotation: 15, scale: 2.0 }
    ];
    setStickers(defaultStickers);
  }, []);

  const triggerGoal = () => {
    setIsCelebrating(true);
    setScore(prev => ({ ...prev, home: prev.home + 1 }));
    setTimeout(() => setIsCelebrating(false), 3000);
  };

  const addSticker = (type: 'text' | 'icon' | 'hat', value: string) => {
    const newSticker: Sticker = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      value,
      x: 50,
      y: type === 'hat' ? 25 : 50,
      rotation: 0,
      scale: type === 'hat' ? 2.5 : 1.5,
    };
    setStickers([...stickers, newSticker]);
  };

  const updateSticker = (id: string, updates: Partial<Sticker>) => {
    setStickers(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let x, y;
    if ('touches' in e) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
    } else {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
    }

    const colors = ['#22c55e', '#ffffff', '#fbbf24'];
    const pId = nextId.current++;
    setParticles(prev => [...prev.slice(-15), { id: pId, x, y, color: colors[Math.floor(Math.random() * colors.length)] }]);
    setTimeout(() => setParticles(prev => prev.filter(p => p.id !== pId)), 800);
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col select-none overflow-hidden" ref={containerRef}>
      
      {/* IMMERSIVE FULL-SCREEN IMAGE */}
      <div 
        className="absolute inset-0 z-0 flex items-center justify-center bg-neutral-900"
        onMouseMove={handleInteraction}
        onTouchMove={handleInteraction}
      >
        <img 
          src={image} 
          alt="Transformed Moment" 
          className="w-full h-full object-cover pointer-events-none transition-all duration-700"
        />
        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50 pointer-events-none"></div>
      </div>

      {/* TOP HEADER CONTROLS */}
      <div className="relative z-50 flex justify-between items-center p-6 pointer-events-none">
        <button 
          onClick={onDone} 
          className="w-12 h-12 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center pointer-events-auto shadow-2xl active:scale-90 transition"
        >
          <i className="fa-solid fa-chevron-left text-xl"></i>
        </button>
        
        <div className="flex gap-2 pointer-events-auto">
          <button 
            onClick={() => setShowScoreboard(!showScoreboard)}
            className={`px-4 h-12 rounded-2xl flex items-center gap-2 transition border border-white/10 shadow-lg font-black text-[10px] uppercase tracking-widest ${showScoreboard ? 'bg-green-500 text-black' : 'bg-black/60 text-white backdrop-blur-xl'}`}
          >
            <i className="fa-solid fa-layer-group"></i> {showScoreboard ? 'HUD ON' : 'HUD OFF'}
          </button>
          <button 
            onClick={triggerGoal}
            className="px-6 h-12 rounded-2xl bg-orange-600 text-white font-black italic text-sm uppercase flex items-center gap-2 shadow-[0_0_40px_rgba(234,88,12,0.7)] active:scale-95 transition"
          >
            <i className="fa-solid fa-fire-flame-curved"></i> GOAL!
          </button>
        </div>
      </div>

      {/* INTERACTIVE OVERLAYS (STICKERS, HATS, LABELS) */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        {stickers.map(s => (
          <div 
            key={s.id}
            className="absolute pointer-events-auto cursor-grab active:cursor-grabbing group"
            style={{ 
              left: `${s.x}%`, 
              top: `${s.y}%`, 
              transform: `translate(-50%, -50%) rotate(${s.rotation}deg) scale(${s.scale})` 
            }}
            onMouseDown={(e) => {
                const moveHandler = (moveEvent: MouseEvent) => {
                    const rect = containerRef.current!.getBoundingClientRect();
                    updateSticker(s.id, {
                        x: Math.max(5, Math.min(95, ((moveEvent.clientX - rect.left) / rect.width) * 100)),
                        y: Math.max(5, Math.min(95, ((moveEvent.clientY - rect.top) / rect.height) * 100))
                    });
                };
                const upHandler = () => {
                    window.removeEventListener('mousemove', moveHandler);
                    window.removeEventListener('mouseup', upHandler);
                };
                window.addEventListener('mousemove', moveHandler);
                window.addEventListener('mouseup', upHandler);
            }}
            onTouchStart={(e) => {
                const moveHandler = (moveEvent: TouchEvent) => {
                    const rect = containerRef.current!.getBoundingClientRect();
                    updateSticker(s.id, {
                        x: Math.max(5, Math.min(95, ((moveEvent.touches[0].clientX - rect.left) / rect.width) * 100)),
                        y: Math.max(5, Math.min(95, ((moveEvent.touches[0].clientY - rect.top) / rect.height) * 100))
                    });
                };
                const upHandler = () => {
                    window.removeEventListener('touchmove', moveHandler);
                    window.removeEventListener('touchend', upHandler);
                };
                window.addEventListener('touchmove', moveHandler);
                window.addEventListener('touchend', upHandler);
            }}
          >
            {s.type === 'text' ? (
              <div className="bg-white text-black px-6 py-2 rounded-sm font-black italic border-4 border-black shadow-[10px_10px_0_rgba(34,197,94,1)] uppercase text-4xl whitespace-nowrap transition-transform">
                {s.value}
              </div>
            ) : s.type === 'hat' ? (
              <div className="text-9xl drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] filter transition-transform group-active:scale-110">
                {s.value}
              </div>
            ) : (
              <div className="text-7xl drop-shadow-2xl">{s.value}</div>
            )}
            
            <div className="absolute -top-10 -right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                <button onClick={(e) => { e.stopPropagation(); updateSticker(s.id, { scale: s.scale + 0.2 }); }} className="w-8 h-8 bg-white text-black rounded-lg shadow-lg flex items-center justify-center"><i className="fa-solid fa-plus text-xs"></i></button>
                <button onClick={(e) => { e.stopPropagation(); updateSticker(s.id, { rotation: s.rotation + 20 }); }} className="w-8 h-8 bg-blue-500 text-white rounded-lg shadow-lg flex items-center justify-center"><i className="fa-solid fa-rotate text-xs"></i></button>
                <button onClick={(e) => { e.stopPropagation(); setStickers(prev => prev.filter(st => st.id !== s.id)); }} className="w-8 h-8 bg-red-600 text-white rounded-lg shadow-lg flex items-center justify-center"><i className="fa-solid fa-trash-can text-xs"></i></button>
            </div>
          </div>
        ))}

        {particles.map(p => (
            <div 
                key={p.id}
                className="absolute pointer-events-none rounded-full animate-vibe-glow z-10"
                style={{ 
                    left: p.x, top: p.y, 
                    width: '6px', height: '6px', 
                    backgroundColor: p.color,
                    boxShadow: `0 0 20px ${p.color}`,
                    transform: 'translate(-50%, -50%)' 
                }}
            />
        ))}
      </div>

      {/* DYNAMIC BROADCAST SCOREBOARD */}
      {showScoreboard && (
        <div className="absolute top-[14%] left-6 right-6 z-40 pointer-events-none">
            <div className="flex bg-[#0a0a0a]/90 backdrop-blur-md border-b-4 border-green-500 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] rounded-sm overflow-hidden animate-slide-up-vibe mx-auto max-w-lg">
                <div className="bg-green-500 px-4 py-2 flex items-center justify-center">
                    <span className="text-black font-black italic text-sm tracking-tighter">FT</span>
                </div>
                <div className="flex-1 px-5 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <span className="text-white font-black text-xs tracking-widest">HOME</span>
                        <span className="text-5xl font-black italic text-green-500 tabular-nums">{score.home}</span>
                    </div>
                    <div className="w-px h-8 bg-white/10 mx-4"></div>
                    <div className="flex items-center gap-4">
                        <span className="text-5xl font-black italic text-white tabular-nums">{score.away}</span>
                        <span className="text-white font-black text-xs tracking-widest">AWAY</span>
                    </div>
                </div>
                <div className="bg-neutral-800 px-5 py-2 flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                     <span className="text-white/60 font-mono text-xs">MATCHDAY</span>
                </div>
            </div>
        </div>
      )}

      {/* BIG GOAL CELEBRATION */}
      {isCelebrating && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-lg pointer-events-none">
          <div className="text-center animate-goal-explosion">
            <h1 className="text-[14rem] font-black italic text-white uppercase tracking-tighter drop-shadow-[0_20px_50px_rgba(34,197,94,0.5)]">GOAL</h1>
            <div className="text-green-500 font-black tracking-[1em] mt-[-3rem] text-xl animate-pulse">MATCH WINNER!</div>
          </div>
        </div>
      )}

      {/* FOOTER: ASSET TRAY */}
      <div className="mt-auto relative z-50 p-6 space-y-4 bg-gradient-to-t from-black via-black/80 to-transparent">
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Drop items on face or background</span>
                <div className="flex-1 h-px bg-white/10"></div>
            </div>
            
            <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
              <div className="flex gap-2 pr-4 border-r border-white/20">
                  <button onClick={() => addSticker('hat', '👑')} className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-4xl hover:bg-white/20 transition active:scale-90">👑</button>
                  <button onClick={() => addSticker('hat', '🧢')} className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-4xl hover:bg-white/20 transition active:scale-90">🧢</button>
                  <button onClick={() => addSticker('hat', '⚽')} className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-4xl hover:bg-white/20 transition active:scale-90">⚽</button>
                  <button onClick={() => addSticker('hat', '🎩')} className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-4xl hover:bg-white/20 transition active:scale-90">🎩</button>
              </div>
              
              <button onClick={() => addSticker('text', 'MVP')} className="flex-shrink-0 px-6 py-2 rounded-2xl bg-white text-black font-black italic text-lg uppercase shadow-lg active:scale-90 transition">MVP</button>
              <button onClick={() => addSticker('text', 'ICON')} className="flex-shrink-0 px-6 py-2 rounded-2xl bg-yellow-400 text-black font-black italic text-lg uppercase shadow-lg active:scale-90 transition">ICON</button>
              <button onClick={() => addSticker('text', 'VIBE')} className="flex-shrink-0 px-6 py-2 rounded-2xl bg-green-500 text-black font-black italic text-lg uppercase shadow-lg active:scale-90 transition">VIBE</button>
              <button onClick={() => addSticker('icon', '🔥')} className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-3xl hover:bg-white/20 transition active:scale-90">🔥</button>
              <button onClick={() => addSticker('icon', '🏆')} className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-3xl hover:bg-white/20 transition active:scale-90">🏆</button>
            </div>
        </div>

        <div className="flex gap-3">
            <button
              onClick={onShare}
              className="flex-1 py-6 rounded-2xl bg-white text-black font-black text-2xl flex items-center justify-center gap-4 active:scale-95 transition shadow-[0_15px_60px_rgba(255,255,255,0.3)]"
            >
              <i className="fa-solid fa-paper-plane"></i>
              SHARE THE MOMENT
            </button>
        </div>
      </div>

      <style>{`
        @keyframes vibe-glow {
            0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(4); opacity: 0; }
        }
        @keyframes goal-explosion {
            0% { transform: scale(0.2); opacity: 0; filter: blur(50px); }
            50% { transform: scale(1.1); opacity: 1; filter: blur(0px); }
            70% { transform: scale(0.95); }
            100% { transform: scale(1); }
        }
        @keyframes slide-up-vibe {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .animate-vibe-glow { animation: vibe-glow 0.8s cubic-bezier(0, 0, 0.2, 1) forwards; }
        .animate-goal-explosion { animation: goal-explosion 0.6s cubic-bezier(.17,.67,.26,.99) forwards; }
        .animate-slide-up-vibe { animation: slide-up-vibe 0.6s cubic-bezier(.17,.67,.26,.99) forwards; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ResultPreview;
