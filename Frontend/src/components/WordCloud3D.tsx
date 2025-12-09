// Frontend/src/components/WordCloud3D.tsx
import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import type { WordScore } from "../types";
import * as THREE from "three";

interface WordCloud3DProps {
  words: WordScore[];
}

interface PositionedWord extends WordScore {
  position: [number, number, number];
  color: string;
  size: number;
}

function generatePositions(words: WordScore[]): PositionedWord[] {
  const baseRadius = 6; // bigger sphere

  const seedRandom = (seed: number) => {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  return words.map((w, idx) => {
    const hash = [...w.word].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const u = seedRandom(hash);
    const v = seedRandom(hash * 2);

    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);

    // spacing based on word weight
    const spacing = 1 + w.weight * 0.5; // 1.0 to 1.5
    const radius = baseRadius * spacing;

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    const size = 0.6 + w.weight * 1.2;
    const hue = 220 - w.weight * 220;
    const color = `hsl(${hue}, 80%, 60%)`;

    return {
      ...w,
      position: [x, y, z],
      color,
      size,
    };
  });
}


const WordCloudInner: React.FC<WordCloud3DProps> = ({ words }) => {
  const groupRef = useRef<THREE.Group>(null!);

  const positioned = useMemo(() => generatePositions(words), [words]);

  // Slow rotation for "floating" effect
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0015;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {positioned.map((w) => (
        <Text
          key={w.word}
          position={w.position}
          fontSize={w.size}
          color={w.color}
          anchorX="center"
          anchorY="middle"
        >
          {w.word}
        </Text>
      ))}
    </group>
  );
};

export const WordCloud3D: React.FC<WordCloud3DProps> = ({ words }) => {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <OrbitControls enablePan={false} />
        <WordCloudInner words={words} />
      </Canvas>
    </div>
  );
};
