import { useBox, useRaycastVehicle } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useKeyboard } from '../../hooks/useKeyboard';

const wheelInfo: any = {
  radius: 0.7,
  directionLocal: [0, -1, 0],
  suspensionStiffness: 30,
  suspensionRestLength: 0.3,
  maxSuspensionForce: 100000,
  maxSuspensionTravel: 0.3,
  dampingRelaxation: 2.3,
  dampingCompression: 4.4,
  axleLocal: [-1, 0, 0],
  chassisConnectionPointLocal: [1, 0, 1],
  useCustomSlidingRotationalSpeed: true,
  customSlidingRotationalSpeed: -30,
  frictionSlip: 2,
};

const wheelInfos = [
  { ...wheelInfo, chassisConnectionPointLocal: [-1, 0, 1.5], isFrontWheel: true },
  { ...wheelInfo, chassisConnectionPointLocal: [1, 0, 1.5], isFrontWheel: true },
  { ...wheelInfo, chassisConnectionPointLocal: [-1, 0, -1.5], isFrontWheel: false },
  { ...wheelInfo, chassisConnectionPointLocal: [1, 0, -1.5], isFrontWheel: false },
];

export const Vehicle = ({ position }: { position: [number, number, number] }) => {
  const chassisBody = useRef<THREE.Group>(null);
  const wheels = [useRef<THREE.Group>(null), useRef<THREE.Group>(null), useRef<THREE.Group>(null), useRef<THREE.Group>(null)];
  const { moveForward, moveBackward, moveLeft, moveRight } = useKeyboard();

  const [chassisRef, chassisApi] = useBox(() => ({
    mass: 500,
    position,
    args: [2, 1, 4],
    allowSleep: false,
  }), useRef<THREE.Group>(null));

  const [vehicle, vehicleApi] = useRaycastVehicle(() => ({
    chassisBody: chassisRef as any,
    wheelInfos,
    wheels: wheels as any,
  }), useRef<THREE.Group>(null));

  useFrame(() => {
    const engineForce = 1500;
    const steerValue = 0.5;

    vehicleApi.applyEngineForce(moveForward ? -engineForce : moveBackward ? engineForce : 0, 2);
    vehicleApi.applyEngineForce(moveForward ? -engineForce : moveBackward ? engineForce : 0, 3);

    vehicleApi.setSteeringValue(moveLeft ? steerValue : moveRight ? -steerValue : 0, 0);
    vehicleApi.setSteeringValue(moveLeft ? steerValue : moveRight ? -steerValue : 0, 1);
  });

  return (
    <group ref={vehicle as any}>
      <group ref={chassisRef as any}>
        <mesh castShadow>
          <boxGeometry args={[2, 1, 4]} />
          <meshStandardMaterial color="#e74c3c" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Windshield */}
        <mesh position={[0, 0.6, 0.5]} rotation={[-0.5, 0, 0]}>
          <planeGeometry args={[1.8, 1]} />
          <meshStandardMaterial color="#3498db" transparent opacity={0.6} />
        </mesh>
      </group>
      {wheels.map((ref, i) => (
        <group key={i} ref={ref as any}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.7, 0.7, 0.5, 32]} />
            <meshStandardMaterial color="#111" roughness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
