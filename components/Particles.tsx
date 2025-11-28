import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ShapeType } from '../types';
import { generateParticles } from '../utils/geometry';

interface ParticlesProps {
  shape: ShapeType;
  color: string;
  handState: { detected: boolean; pinch: number; x: number; y: number };
}

const COUNT = 5000;
const DAMPING = 0.05;

const Particles: React.FC<ParticlesProps> = ({ shape, color, handState }) => {
  const meshRef = useRef<THREE.Points>(null);
  
  // Target positions based on the selected shape
  const targetPositions = useMemo(() => generateParticles(shape, COUNT), [shape]);
  
  // Current positions array (mutable)
  const currentPositions = useMemo(() => new Float32Array(targetPositions), [targetPositions]);
  
  // Velocities for physics feel
  const velocities = useMemo(() => new Float32Array(COUNT * 3), []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
    return geo;
  }, [currentPositions]);

  // Update logic loop
  useFrame((state) => {
    if (!meshRef.current) return;

    // determine expansion factor based on hand pinch
    // Default pulse if no hand, otherwise track hand pinch
    const time = state.clock.getElapsedTime();
    
    let expansionFactor = 0;
    let rotationSpeed = 0.1;

    if (handState.detected) {
      // Map pinch (0=closed, 1=open) to expansion
      // Closed = tight (0), Open = exploded (1)
      expansionFactor = handState.pinch * 3; 
      rotationSpeed = 0.2 + handState.pinch;
    } else {
      // Idle animation: breathing
      expansionFactor = Math.sin(time) * 0.2; 
    }

    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      
      // Target coordinates
      const tx = targetPositions[i3];
      const ty = targetPositions[i3 + 1];
      const tz = targetPositions[i3 + 2];

      // Interactive Force: if hand detected, repel or attract?
      // Let's make "Pinch" control Scale/Explosion from center.
      
      const distFromCenter = Math.sqrt(tx*tx + ty*ty + tz*tz);
      const scale = 1 + expansionFactor * (Math.random() * 0.5 + 0.5); // Add some noise
      
      const targetX = tx * scale;
      const targetY = ty * scale;
      const targetZ = tz * scale;

      // Simple Lerp towards target
      positions[i3] += (targetX - positions[i3]) * DAMPING;
      positions[i3 + 1] += (targetY - positions[i3 + 1]) * DAMPING;
      positions[i3 + 2] += (targetZ - positions[i3 + 2]) * DAMPING;
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Rotate entire system slowly, faster if active
    meshRef.current.rotation.y += rotationSpeed * 0.01;
    
    // Tilt based on hand position if detected
    if (handState.detected) {
      const targetRotX = handState.y * 0.5;
      const targetRotZ = -handState.x * 0.5;
      meshRef.current.rotation.x += (targetRotX - meshRef.current.rotation.x) * 0.05;
      meshRef.current.rotation.z += (targetRotZ - meshRef.current.rotation.z) * 0.05;
    }
  });

  return (
    <points ref={meshRef} geometry={geometry}>
      <pointsMaterial
        size={0.06}
        color={color}
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default Particles;