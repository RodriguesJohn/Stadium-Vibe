
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { UserPhoto } from '../types';

interface CameraViewProps {
  onCapture: (photo: UserPhoto) => void;
  onCancel: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        setError("Camera access denied.");
      }
    };
    startCamera();
    return () => stream?.getTracks().forEach(t => t.stop());
  }, []);

  const handleCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      onCapture({ dataUrl: canvas.toDataURL('image/jpeg', 0.9), mimeType: 'image/jpeg' });
    }
  }, [onCapture]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col z-50 overflow-hidden">
      <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
      <canvas ref={canvasRef} className="hidden" />
      
      {/* UI Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
        <div className="p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-auto">
          <button onClick={onCancel} className="text-white text-xl"><i className="fa-solid fa-xmark"></i></button>
          <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
              <span className="text-white font-black italic uppercase tracking-widest text-sm">REC</span>
          </div>
          <div className="w-6"></div>
        </div>

        {/* Viewfinder corner marks */}
        <div className="flex-1 flex items-center justify-center p-12">
            <div className="w-full h-full border border-white/20 relative">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-green-500"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-green-500"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-green-500"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-green-500"></div>
            </div>
        </div>

        <div className="p-10 flex items-center justify-center bg-gradient-to-t from-black/80 to-transparent pointer-events-auto">
           <button
            onClick={handleCapture}
            className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition active:scale-90"
          >
            <div className="w-16 h-16 bg-white rounded-full"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraView;
