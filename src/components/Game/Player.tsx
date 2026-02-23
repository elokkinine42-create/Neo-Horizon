import { useSphere } from '@react-three/cannon';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useKeyboard } from '../../hooks/useKeyboard';

const JUMP_FORCE = 4;
const SPEED = 4;
const SPRINT_MULTIPLIER = 1.8;

export const Player = () => {
  const { camera } = useThree();
  const { moveForward, moveBackward, moveLeft, moveRight, jump, sprint } = useKeyboard();
  
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position: [0, 1, 0],
    args: [0.5],
  }));

  const velocity = useRef([0, 0, 0]);
  useEffect(() => api.velocity.subscribe((v) => (velocity.current = v)), [api.velocity]);

  const pos = useRef([0, 0, 0]);
  useEffect(() => api.position.subscribe((p) => (pos.current = p)), [api.position]);

  useFrame(() => {
    // Camera follows player
    camera.position.copy(new THREE.Vector3(pos.current[0], pos.current[1] + 0.75, pos.current[2]));

    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3(
      0,
      0,
      Number(moveBackward) - Number(moveForward)
    );
    const sideVector = new THREE.Vector3(
      Number(moveLeft) - Number(moveRight),
      0,
      0
    );

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED * (sprint ? SPRINT_MULTIPLIER : 1))
      .applyEuler(camera.rotation);

    api.velocity.set(direction.x, velocity.current[1], direction.z);

    if (jump && Math.abs(velocity.current[1]) < 0.05) {
      api.velocity.set(velocity.current[0], JUMP_FORCE, velocity.current[2]);
    }
  });

  return (
    <>
      <mesh ref={ref as any}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="white" transparent opacity={0} />
      </mesh>
    </>
  );
};
