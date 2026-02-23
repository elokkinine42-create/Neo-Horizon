import { useBox } from '@react-three/cannon';
import { Html } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

interface CharacterProps {
  position: [number, number, number];
  name: string;
  color: string;
  gender: 'boy' | 'girl';
}

export const Character = ({ position, name, color, gender }: CharacterProps) => {
  const [ref] = useBox(() => ({
    mass: 1,
    position,
    args: [0.6, 1.8, 0.6],
    type: 'Dynamic',
  }));

  return (
    <group ref={ref as any}>
      {/* Body */}
      <mesh castShadow position={[0, 0, 0]}>
        <capsuleGeometry args={[0.3, 1.2, 4, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Head */}
      <mesh castShadow position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>

      {/* Hair/Distinction */}
      {gender === 'girl' ? (
        <mesh position={[0, 0.9, -0.1]}>
          <boxGeometry args={[0.4, 0.5, 0.2]} />
          <meshStandardMaterial color="#4b2c20" />
        </mesh>
      ) : (
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[0.3, 0.1, 0.3]} />
          <meshStandardMaterial color="#2c3e50" />
        </mesh>
      )}

      {/* Name Tag */}
      <Html position={[0, 1.5, 0]} center distanceFactor={10}>
        <div className="bg-black/80 text-white px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap border border-white/20 backdrop-blur-sm uppercase tracking-wider">
          {name}
        </div>
      </Html>
    </group>
  );
};
