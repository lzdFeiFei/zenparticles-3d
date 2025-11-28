import React from 'react';
import { ShapeType } from '../types';

interface ControlsProps {
  currentShape: ShapeType;
  setShape: (s: ShapeType) => void;
  color: string;
  setColor: (c: string) => void;
  handDetected: boolean;
  onToggleFullscreen: () => void;
}

const Controls: React.FC<ControlsProps> = ({ 
  currentShape, 
  setShape, 
  color, 
  setColor,
  handDetected,
  onToggleFullscreen
}) => {
  
  const shapes = Object.values(ShapeType);
  const colors = ['#00ffff', '#ff00ff', '#ffff00', '#ff4444', '#ffffff', '#44ff44'];

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col justify-between p-6 z-10">
      {/* Header */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tighter drop-shadow-lg">
            ZEN<span className="text-cyan-400">PARTICLES</span>
          </h1>
          <div className="flex items-center mt-2 space-x-2">
            <div className={`w-3 h-3 rounded-full ${handDetected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-xs text-gray-300 uppercase tracking-widest">
              {handDetected ? 'Hand Tracking Active' : 'Waiting for Hand...'}
            </span>
          </div>
          <p className="text-gray-400 text-xs mt-1 max-w-xs">
            Pinch fingers to condense, open hand to explode.
          </p>
        </div>
        
        <button 
          onClick={onToggleFullscreen}
          className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all border border-white/10 text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
          </svg>
        </button>
      </div>

      {/* Control Panel - Bottom */}
      <div className="pointer-events-auto bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-2xl max-w-2xl mx-auto w-full">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          
          {/* Shapes */}
          <div className="flex flex-wrap gap-2 justify-center">
            {shapes.map((shape) => (
              <button
                key={shape}
                onClick={() => setShape(shape)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  currentShape === shape 
                    ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.5)]' 
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {shape}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-10 bg-white/10"></div>

          {/* Colors */}
          <div className="flex gap-3">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                style={{ backgroundColor: c }}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  color === c ? 'border-white scale-110 shadow-[0_0_10px_currentColor]' : 'border-transparent opacity-70'
                }`}
                aria-label={`Select color ${c}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;