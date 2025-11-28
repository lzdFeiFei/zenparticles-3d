import { FilesetResolver, HandLandmarker, HandLandmarkerResult } from '@mediapipe/tasks-vision';

let handLandmarker: HandLandmarker | null = null;
let runningMode: 'IMAGE' | 'VIDEO' = 'VIDEO';

export const initializeHandDetection = async (): Promise<void> => {
  try {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
    );
    
    handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        delegate: "GPU"
      },
      runningMode: runningMode,
      numHands: 1
    });
  } catch (error) {
    console.error("Failed to initialize hand tracking:", error);
  }
};

export const detectHands = (video: HTMLVideoElement): { detected: boolean, pinch: number, x: number, y: number } => {
  if (!handLandmarker || !video.videoWidth) {
    return { detected: false, pinch: 0, x: 0, y: 0 };
  }

  const startTimeMs = performance.now();
  const results: HandLandmarkerResult = handLandmarker.detectForVideo(video, startTimeMs);

  if (results.landmarks && results.landmarks.length > 0) {
    const landmarks = results.landmarks[0];
    
    // Index 4 is thumb tip, Index 8 is index finger tip
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const wrist = landmarks[0];

    // Calculate distance between thumb and index
    const distance = Math.sqrt(
      Math.pow(thumbTip.x - indexTip.x, 2) +
      Math.pow(thumbTip.y - indexTip.y, 2) +
      Math.pow(thumbTip.z - indexTip.z, 2)
    );

    // Normalize distance. Typical range is 0.02 (closed) to 0.15 (open) depending on z-depth
    // We adjust roughly based on hand scale (wrist to index base roughly)
    const pinch = Math.min(Math.max((distance - 0.02) * 5, 0), 1);
    
    // Center point
    const x = (thumbTip.x + indexTip.x) / 2;
    const y = (thumbTip.y + indexTip.y) / 2;

    return { 
      detected: true, 
      pinch: pinch, 
      x: (x - 0.5) * 2, // -1 to 1
      y: -(y - 0.5) * 2 // -1 to 1 (inverted Y for screen coords)
    };
  }

  return { detected: false, pinch: 0, x: 0, y: 0 };
};