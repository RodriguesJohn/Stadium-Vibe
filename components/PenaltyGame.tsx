
import React, { useState, useEffect } from 'react';

interface PenaltyGameProps {
  onScore: () => void;
}

const PenaltyGame: React.FC<PenaltyGameProps> = ({ onScore }) => {
  const [ballPos, setBallPos] = useState({ x: 50, y: 80 });
  const [isKicking, setIsKicking] = useState(false);
  const [goaliePos, setGoaliePos] = useState(50);
  const [message, setMessage] = useState('TAP TO KICK!');
  const [scoreCount, setScoreCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setGoaliePos(50 + Math.sin(Date.now() / 400) * 30);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const handleKick = () => {
    if (isKicking) return;
    setIsKicking(true);
    
    // Random target in goal area
    const targetX = 30 + Math.random() * 40;
    const targetY = 20 + Math.random() * 20;
    
    setBallPos({ x: targetX, y: targetY });

    setTimeout(() => {
      const isGoal = Math.abs(targetX - goaliePos) > 15;
      if (isGoal) {
        setMessage('GOAL!!!');
        setScoreCount(s => s + 1);
        onScore();
      } else {
        setMessage('SAVED!');
      }

      setTimeout(() => {
        setIsKicking(false);
        setBallPos({ x: 50, y: 80 });
        setMessage('KICK AGAIN!');
      }, 1000);
    }, 600);
  };

  return (
    <div className="relative w-full h-64 bg-green-900/20 rounded-3xl overflow-hidden border border-white/10 mt-8 cursor-pointer" onClick={handleKick}>
      {/* Goal Post */}
      <div className="absolute top-10 left-[20%] right-[20%] h-32 border-4 border-b-0 border-white rounded-t-lg z-0">
         <div className="absolute inset-0 bg-white/5 grid grid-cols-6 grid-rows-4 opacity-20">
           {Array.from({length: 24}).map((_, i) => <div key={i} className="border border-white/20"></div>)}
         </div>
      </div>

      {/* Goalie */}
      <div 
        className="absolute top-28 w-12 h-16 transition-all duration-75 flex flex-col items-center z-10"
        style={{ left: `${goaliePos}%`, transform: 'translateX(-50%)' }}
      >
        <div className="w-6 h-6 bg-red-500 rounded-full mb-1 shadow-lg"></div>
        <div className="w-8 h-10 bg-blue-600 rounded-lg"></div>
        <div className="flex gap-4 -mt-8">
           <div className="w-2 h-8 bg-blue-600 origin-top rotate-45"></div>
           <div className="w-2 h-8 bg-blue-600 origin-top -rotate-45"></div>
        </div>
      </div>

      {/* Ball */}
      <div 
        className={`absolute w-8 h-8 transition-all duration-500 ease-out z-20 flex items-center justify-center`}
        style={{ 
            left: `${ballPos.x}%`, 
            top: `${ballPos.y}%`, 
            transform: `translateX(-50%) ${isKicking ? 'scale(0.6) rotate(360deg)' : 'scale(1)'}` 
        }}
      >
        <i className="fa-solid fa-futbol text-white text-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"></i>
      </div>

      {/* Score UI */}
      <div className="absolute top-4 right-6 text-white font-black italic">
        GOALS: {scoreCount}
      </div>
      
      <div className="absolute bottom-4 left-0 right-0 text-center text-white/60 font-bold uppercase tracking-widest text-xs animate-pulse">
        {message}
      </div>
    </div>
  );
};

export default PenaltyGame;
