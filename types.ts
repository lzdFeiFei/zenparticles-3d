export enum ShapeType {
  HEART = 'Heart',
  FLOWER = 'Flower',
  SATURN = 'Saturn',
  SPIRAL = 'Spiral', // Replacing Buddha with a complex mathematical spiral for procedural generation
  FIREWORKS = 'Fireworks',
  SPHERE = 'Sphere'
}

export interface ParticleConfig {
  count: number;
  size: number;
  color: string;
}

export interface HandData {
  detected: boolean;
  pinchDistance: number; // 0 (closed) to 1 (open)
  position: { x: number; y: number }; // Normalized -1 to 1
}