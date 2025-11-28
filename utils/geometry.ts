import * as THREE from 'three';
import { ShapeType } from '../types';

export const generateParticles = (shape: ShapeType, count: number): Float32Array => {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    let x = 0, y = 0, z = 0;

    switch (shape) {
      case ShapeType.SPHERE: {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 2;
        x = r * Math.sin(phi) * Math.cos(theta);
        y = r * Math.sin(phi) * Math.sin(theta);
        z = r * Math.cos(phi);
        break;
      }

      case ShapeType.HEART: {
        // Parametric heart equation
        const t = Math.random() * Math.PI * 2;
        // Distribute points inside volume slightly
        const r = Math.pow(Math.random(), 1/3); 
        // 2D slice expanded to 3D
        const xBase = 16 * Math.pow(Math.sin(t), 3);
        const yBase = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        
        const scale = 0.15;
        x = xBase * scale * r;
        y = yBase * scale * r;
        // Add thickness
        z = (Math.random() - 0.5) * 1.5 * r;
        break;
      }

      case ShapeType.FLOWER: {
        // Rose curve inspired 3D shape
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI;
        const k = 3; // Petals
        const r = 1.5 + 0.5 * Math.sin(k * u) * Math.sin(v);
        
        x = r * Math.sin(v) * Math.cos(u);
        y = r * Math.sin(v) * Math.sin(u);
        z = r * Math.cos(v);
        break;
      }

      case ShapeType.SATURN: {
        // Mix of Sphere and Ring
        const isRing = Math.random() > 0.6;
        if (isRing) {
          const theta = Math.random() * Math.PI * 2;
          const r = 3 + Math.random() * 1.5; // Ring radius
          x = r * Math.cos(theta);
          z = r * Math.sin(theta);
          y = (Math.random() - 0.5) * 0.1; // Flat ring
          
          // Tilt the ring
          const tilt = Math.PI / 6;
          const yTemp = y * Math.cos(tilt) - z * Math.sin(tilt);
          const zTemp = y * Math.sin(tilt) + z * Math.cos(tilt);
          y = yTemp;
          z = zTemp;
        } else {
          // Planet
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const r = 1.8;
          x = r * Math.sin(phi) * Math.cos(theta);
          y = r * Math.sin(phi) * Math.sin(theta);
          z = r * Math.cos(phi);
        }
        break;
      }

      case ShapeType.SPIRAL: {
        // Logarithmic spiral / Galaxy
        const angle = Math.random() * Math.PI * 8; // Multiple turns
        const distance = 0.2 * angle; // Radius grows with angle
        const fuzz = (Math.random() - 0.5) * 1; 
        
        x = (distance + fuzz) * Math.cos(angle);
        y = (Math.random() - 0.5) * 2; // Height thickness
        z = (distance + fuzz) * Math.sin(angle);
        break;
      }

      case ShapeType.FIREWORKS: {
        // Explosion burst
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        // Concentrate points at different radii to simulate explosion trails
        const rBase = Math.random();
        const r = Math.pow(rBase, 0.5) * 4;
        
        x = r * Math.sin(phi) * Math.cos(theta);
        y = r * Math.sin(phi) * Math.sin(theta);
        z = r * Math.cos(phi);
        break;
      }
    }

    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;
  }

  return positions;
};