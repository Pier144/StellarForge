// src/renderer/components/planet-editor/PlanetPreview.tsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

interface Props {
  surfaceColor: string;
  atmosphereColor: string;
  atmosphereIntensity: number;
  atmosphereWidth: number;
  cloudOpacity: number;
  cloudEnabled: boolean;
  previewMode: 'day' | 'night' | 'orbit' | 'colony';
  textureUrl?: string;
}

function Planet({ surfaceColor, atmosphereColor, atmosphereIntensity, atmosphereWidth, cloudOpacity, cloudEnabled, previewMode }: Props) {
  const meshRef = useRef<THREE.Mesh>(null);

  const lightPosition = useMemo((): [number, number, number] => {
    switch (previewMode) {
      case 'day': return [5, 2, 5];
      case 'night': return [-5, -2, -5];
      case 'orbit': return [3, 5, 3];
      case 'colony': return [2, 4, 1];
      default: return [5, 2, 5];
    }
  }, [previewMode]);

  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={lightPosition} intensity={1.2} />

      {/* Planet sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color={surfaceColor} roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Atmosphere glow */}
      {atmosphereIntensity > 0 && (
        <mesh scale={[1 + atmosphereWidth * 0.1, 1 + atmosphereWidth * 0.1, 1 + atmosphereWidth * 0.1]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color={atmosphereColor} transparent opacity={atmosphereIntensity * 0.15} side={THREE.BackSide} />
        </mesh>
      )}

      {/* Cloud layer */}
      {cloudEnabled && (
        <mesh scale={[1.02, 1.02, 1.02]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={cloudOpacity * 0.5} roughness={1} />
        </mesh>
      )}

      <OrbitControls enablePan={false} minDistance={2} maxDistance={8} autoRotate autoRotateSpeed={0.5} />
    </>
  );
}

export function PlanetPreview(props: Props) {
  return (
    <div className="w-full h-full bg-black rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
        <color attach="background" args={['#0a0a0a']} />
        <Planet {...props} />
      </Canvas>
    </div>
  );
}
