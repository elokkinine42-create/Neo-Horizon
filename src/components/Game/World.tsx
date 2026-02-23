import { useBox, usePlane } from '@react-three/cannon';
import { Sky, Stars, useHelper } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { Character } from './Character';

const Building = ({ position, args, color }: { position: [number, number, number], args: [number, number, number], color: string }) => {
  const [ref] = useBox(() => ({
    type: 'Static',
    position,
    args,
  }));

  return (
    <mesh ref={ref as any} castShadow receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} roughness={0.1} metalness={0.9} />
    </mesh>
  );
};

const Debris = ({ position }: { position: [number, number, number] }) => {
  const [ref] = useBox(() => ({
    mass: 1,
    position,
    args: [0.5, 0.5, 0.5],
  }));

  return (
    <mesh ref={ref as any} castShadow>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#95a5a6" />
    </mesh>
  );
};

const Road = ({ position, args }: { position: [number, number, number], args: [number, number] }) => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position,
  }));

  return (
    <mesh ref={ref as any} receiveShadow>
      <planeGeometry args={[args[0], args[1]]} />
      <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
    </mesh>
  );
};

export const World = () => {
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const [sunPos, setSunPos] = useState<[number, number, number]>([100, 20, 100]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.1;
    const x = Math.cos(t) * 100;
    const y = Math.sin(t) * 100;
    setSunPos([x, y, 50]);
  });

  return (
    <>
      <Sky sunPosition={sunPos} />
      {sunPos[1] < 0 && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />}
      
      <ambientLight intensity={sunPos[1] > 0 ? 0.4 : 0.05} />
      
      <directionalLight 
        ref={sunRef}
        position={sunPos} 
        castShadow 
        intensity={sunPos[1] > 0 ? 1.5 : 0}
        shadow-mapSize={[4096, 4096]}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />

      {/* Ground */}
      <Road position={[0, 0, 0]} args={[1000, 1000]} />

      {/* City Blocks */}
      <Building position={[10, 10, 10]} args={[5, 20, 5]} color="#2c3e50" />
      <Building position={[-15, 15, 12]} args={[8, 30, 8]} color="#34495e" />
      <Building position={[20, 5, -15]} args={[10, 10, 10]} color="#7f8c8d" />
      <Building position={[-25, 25, -25]} args={[12, 50, 12]} color="#2c3e50" />
      
      {/* Physics Debris */}
      {Array.from({ length: 20 }).map((_, i) => (
        <Debris key={i} position={[Math.random() * 20 - 10, 5 + i, Math.random() * 20 - 10]} />
      ))}

      {/* Characters */}
      <Character position={[-5, 2, 5]} name="Josh" color="#3498db" gender="boy" />
      <Character position={[5, 2, 5]} name="Rose" color="#e91e63" gender="girl" />

      {/* Street Lights */}
      {[ [5, 5], [-5, 5], [5, -5], [-5, -5] ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z] as [number, number, number]}>
          <mesh position={[0, 2, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 4]} />
            <meshStandardMaterial color="#333" />
          </mesh>
          <pointLight position={[0, 4, 0]} intensity={sunPos[1] < 10 ? 5 : 0} color="#f1c40f" distance={10} />
          <mesh position={[0, 4, 0]}>
            <sphereGeometry args={[0.2]} />
            <meshStandardMaterial emissive="#f1c40f" emissiveIntensity={sunPos[1] < 10 ? 2 : 0} color="white" />
          </mesh>
        </group>
      ))}
    </>
  );
};
