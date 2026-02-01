
import React, { useState } from 'react';
import { AppState, UserPhoto, MomentFilter } from './types';
import { transformImage } from './services/geminiService';
import CameraView from './components/CameraView';
import FilterSelection from './components/FilterSelection';
import ResultPreview from './components/ResultPreview';
import PenaltyGame from './components/PenaltyGame';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [photo, setPhoto] = useState<UserPhoto | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<MomentFilter | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>('');

  const handleStart = () => setState(AppState.CAPTURE);

  const handleCapture = (capturedPhoto: UserPhoto) => {
    setPhoto(capturedPhoto);
    setState(AppState.SELECT_FILTER);
  };

  const handleFilterSelect = async (filter: MomentFilter) => {
    if (!photo) return;
    
    setSelectedFilter(filter);
    setState(AppState.PROCESSING);
    
    const messages = [
      'Analyzing pitch lighting...',
      'Capturing match energy...',
      'Applying cinematic grades...',
      'Polishing the moment...'
    ];
    
    let msgIdx = 0;
    setLoadingStep(messages[msgIdx]);
    const msgInterval = setInterval(() => {
      msgIdx = (msgIdx + 1) % messages.length;
      setLoadingStep(messages[msgIdx]);
    }, 2500);

    try {
      const result = await transformImage(photo, filter);
      setResultImage(result);
      setState(AppState.PREVIEW);
    } catch (error) {
      console.error("Failed to process image:", error);
      alert("Something went wrong processing your photo. Please try again.");
      setState(AppState.SELECT_FILTER);
    } finally {
      clearInterval(msgInterval);
    }
  };

  const handleShare = async () => {
    if (!resultImage) return;
    
    try {
      const response = await fetch(resultImage);
      const blob = await response.blob();
      const file = new File([blob], 'stadium-vibe-moment.jpg', { type: 'image/jpeg' });
      
      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: 'Check out this match moment!',
          text: 'Captured live with StadiumVibe.',
        });
      } else {
        const link = document.createElement('a');
        link.href = resultImage;
        link.download = 'stadium-vibe-moment.jpg';
        link.click();
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const handleReset = () => {
    setPhoto(null);
    setResultImage(null);
    setSelectedFilter(null);
    setState(AppState.IDLE);
  };

  const renderContent = () => {
    switch (state) {
      case AppState.IDLE:
        return (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-black overflow-hidden relative h-full">
            <div className="absolute inset-0 opacity-40">
              <img 
                src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1000" 
                alt="Stadium Crowd" 
                className="w-full h-full object-cover grayscale"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black"></div>
            </div>

            <div className="relative z-10 space-y-12 w-full max-w-2xl">
              <div className="flex flex-col items-center space-y-4">
                <div className="inline-block p-6 bg-green-500 rounded-[3rem] shadow-[0_0_80px_rgba(34,197,94,0.4)] animate-bounce-slow">
                  <i className="fa-solid fa-futbol text-8xl text-black"></i>
                </div>
                <h1 className="text-8xl md:text-9xl font-black italic tracking-tighter text-white uppercase leading-none">
                  Stadium<br/><span className="text-green-500">Vibe</span>
                </h1>
                <p className="text-neutral-400 text-xl max-w-md mx-auto font-medium">
                  The world's first context-aware soccer photo engine.
                </p>
              </div>

              <div className="space-y-4 px-4 max-w-md mx-auto">
                <button
                  onClick={handleStart}
                  className="w-full py-6 px-10 bg-white text-black font-black text-2xl rounded-full shadow-[0_20px_50px_rgba(255,255,255,0.2)] active:scale-95 transition flex items-center justify-center gap-4"
                >
                  <i className="fa-solid fa-camera-retro"></i>
                  START CAPTURING
                </button>
                <p className="text-[12px] text-neutral-600 uppercase tracking-widest font-black">Soccer v1.2 Early Access</p>
              </div>
            </div>
          </div>
        );

      case AppState.CAPTURE:
        return <CameraView onCapture={handleCapture} onCancel={handleReset} />;

      case AppState.SELECT_FILTER:
        return (
          <FilterSelection 
            photo={photo?.dataUrl || ''} 
            onSelect={handleFilterSelect} 
            onBack={() => setState(AppState.CAPTURE)} 
          />
        );

      case AppState.PROCESSING:
        return (
          <div className="flex-1 flex flex-col items-center justify-center bg-neutral-950 p-8 text-center overflow-hidden h-full">
            <div className="space-y-4 max-w-xl w-full">
              <h2 className="text-4xl font-black italic uppercase text-white leading-none">Applying Filter</h2>
              <p className="text-green-500 font-mono text-sm tracking-[0.4em] uppercase animate-pulse">{loadingStep}</p>
            </div>

            {/* Interactive Penalty Game during wait */}
            <div className="w-full max-w-2xl">
               <PenaltyGame onScore={() => {}} />
               <p className="mt-6 text-neutral-500 text-xs font-bold uppercase tracking-widest">
                 Score goals while you wait
               </p>
            </div>

            <div className="mt-16 flex gap-1 h-2 w-48 bg-neutral-900 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 animate-[loading_2s_ease-in-out_infinite]"></div>
            </div>
          </div>
        );

      case AppState.PREVIEW:
        return (
          <ResultPreview 
            image={resultImage || ''} 
            onDone={handleReset} 
            onShare={handleShare} 
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-full bg-black text-white relative overflow-hidden flex flex-col">
      {renderContent()}
      <style>{`
          @keyframes loading {
              0% { width: 0%; transform: translateX(-100%); }
              50% { width: 100%; transform: translateX(0); }
              100% { width: 0%; transform: translateX(100%); }
          }
          @keyframes bounce-slow {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-20px); }
          }
          .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default App;
