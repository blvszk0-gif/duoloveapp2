import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { getRandomQuote } from '../utils/quotes';

function LeonModel({ animationState }: { animationState: 'idle' | 'jump_joy' | 'facepalm' }) {
  // Using a placeholder box for Leon Kennedy as I don't have the actual model file.
  // In a real scenario, we would load the GLTF model here.
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      if (animationState === 'jump_joy') {
        group.current.position.y = Math.abs(Math.sin(state.clock.elapsedTime * 10)) * 0.5;
        group.current.rotation.y += 0.1;
      } else if (animationState === 'facepalm') {
        group.current.rotation.z = Math.sin(state.clock.elapsedTime * 5) * 0.2;
      } else {
        group.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
        group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      }
    }
  });

  return (
    <group ref={group}>
      {/* Head */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.7, 0]}>
        <capsuleGeometry args={[0.3, 1, 4, 8]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.5, 1, 0]}>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      <mesh position={[0.5, 1, 0]}>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
    </group>
  );
}

interface Leon3DProps {
  animationState: 'idle' | 'jump_joy' | 'facepalm';
  showQuote: boolean;
}

export default function Leon3D({ animationState, showQuote }: Leon3DProps) {
  const quote = useRef(getRandomQuote());

  useEffect(() => {
    if (showQuote) {
      quote.current = getRandomQuote();
    }
  }, [showQuote]);

  return (
    <div className="w-full h-64 relative">
      <Canvas camera={{ position: [0, 1.5, 4], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <LeonModel animationState={animationState} />
        {showQuote && (
          <Html position={[0, 2.2, 0]} center>
            <div className="bg-card text-text px-4 py-2 rounded-xl border-2 border-accent whitespace-nowrap animate-bounce shadow-lg">
              {quote.current}
            </div>
          </Html>
        )}
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
