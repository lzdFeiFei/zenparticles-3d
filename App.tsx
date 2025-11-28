import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Particles from './components/Particles';
import Controls from './components/Controls';
import { ShapeType } from './types';
import { initializeHandDetection, detectHands } from './services/handTracking';

const App: React.FC = () => {
  const [shape, setShape] = useState<ShapeType>(ShapeType.HEART);
  const [color, setColor] = useState<string>('#00ffff');
  const [handState, setHandState] = useState({ detected: false, pinch: 0, x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const requestRef = useRef<number>();

  // Initialize Hand Tracking
  useEffect(() => {
    const startCamera = async () => {
      try {
        await initializeHandDetection();
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Use onloadeddata to avoid stacking listeners in React Strict Mode
          videoRef.current.onloadeddata = () => {
            setLoading(false);
            predict();
          };
        }
      } catch (err) {
        console.error("Camera access denied or error:", err);
        setLoading(false); 
      }
    };

    startCamera();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const predict = () => {
    if (videoRef.current && videoRef.current.readyState === 4) {
      const result = detectHands(videoRef.current);
      setHandState(result);
    }
    requestRef.current = requestAnimationFrame(predict);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Video Feed Preview - Visible to user */}
      <div className={`absolute top-20 right-4 md:top-auto md:bottom-6 md:right-6 z-40 w-32 md:w-52 aspect-video rounded-xl overflow-hidden border-2 shadow-2xl bg-zinc-900/50 backdrop-blur-sm transition-colors duration-300 ${handState.detected ? 'border-cyan-400/50 shadow-cyan-400/20' : 'border-white/10'}`}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover transform -scale-x-100 opacity-90"
          playsInline
          autoPlay
          muted
          width="640"
          height="480"
        />
        {/* Status Dot */}
        <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${handState.detected ? 'bg-green-400' : 'bg-red-500'} shadow-[0_0_8px_currentColor] transition-colors duration-300`} />
      </div>

      <Controls 
        currentShape={shape} 
        setShape={setShape} 
        color={color} 
        setColor={setColor}
        handDetected={handState.detected}
        onToggleFullscreen={toggleFullscreen}
      />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center text-white z-50 bg-black">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-cyan-500 font-mono tracking-widest">INITIALIZING VISION...</p>
          </div>
        </div>
      )}

      <Canvas 
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 2]} 
        gl={{ antialias: false, alpha: false }} 
      >
        <color attach="background" args={['#050505']} />
        <ambientLight intensity={0.5} />
        
        <Particles 
          shape={shape} 
          color={color} 
          handState={handState}
        />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate={!handState.detected} 
          autoRotateSpeed={0.5}
        />
        
        <fog attach="fog" args={['#000', 5, 12]} />
      </Canvas>
    </div>
  );
};

export default App;