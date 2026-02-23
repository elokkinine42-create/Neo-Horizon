import { Physics } from '@react-three/cannon';
import { PointerLockControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { Suspense } from 'react';
import * as THREE from 'three';
import { Player } from './Player';
import { World } from './World';
import { Vehicle } from './Vehicle';

export const Experience = () => {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas shadows camera={{ fov: 45, position: [0, 5, 10] }} gl={{ antialias: false }}>
        <Suspense fallback={null}>
          <Physics gravity={[0, -9.81, 0]} tolerance={0.001} iterations={10}>
            <World />
            <Vehicle position={[10, 2, 0]} />
            <Player />
          </Physics>
          
          <PointerLockControls />
          
          <EffectComposer>
            <Bloom intensity={1.0} luminanceThreshold={1} luminanceSmoothing={0.9} />
            <ChromaticAberration offset={new THREE.Vector2(0.0005, 0.0005)} />
            <Noise opacity={0.05} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>
        </Suspense>
      </Canvas>
      
      {/* UI Overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-1 h-1 bg-white rounded-full opacity-50" />
      </div>
      
      <div className="absolute bottom-8 left-8 text-white font-mono text-xs space-y-1 bg-black/50 p-4 rounded-lg backdrop-blur-md border border-white/10">
        <p>WASD - MOVE / DRIVE</p>
        <p>SHIFT - SPRINT</p>
        <p>SPACE - JUMP / BRAKE</p>
        <p>CLICK - LOCK MOUSE</p>
        <p className="text-emerald-400 mt-2">NEO HORIZON ENGINE v1.0</p>
        <p className="text-white/40 text-[10px]">ULTRA REALISM ENABLED</p>
      </div>
    </div>
  );
};
