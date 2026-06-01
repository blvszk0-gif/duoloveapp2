import { useGLTF, Float, Environment, PresentationControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { getRandomQuote } from '../utils/quotes';

function LeonModel() {
  // Using a placeholder for now since I don't have the actual Leon GLB file.
  // I will use a high-quality bust or similar if available, or just a placeholder sphere for testing the layout.
  // Ideally user would provide leon.glb in public/models/
  const { scene } = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/bust-of-a-man/model.gltf');
  
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <primitive
        object={scene}
        scale={0.15}
        position={[-0.7, -2, 0]}
        rotation={[0, -0.2, 0]}
      />
    </Float>
  );
}

interface Leon3DProps {
  animationState?: 'idle' | 'jump_joy' | 'facepalm';
  showQuote?: boolean;
}

export default function Leon3D({ animationState: _animationState = 'idle', showQuote = false }: Leon3DProps) {
  return (
    <div className="w-full h-full min-h-[300px] cursor-grab active:cursor-grabbing relative">
      {showQuote && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 z-50 bg-white text-black p-4 rounded-3xl rounded-bl-none shadow-2xl font-bold text-sm min-w-[150px] text-center"
          >
            "{getRandomQuote()}"
            <div className="absolute -bottom-2 left-0 w-4 h-4 bg-white rotate-45" />
          </motion.div>
      )}
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />

          <PresentationControls
            global
            rotation={[0, 0.3, 0]}
            polar={[-Math.PI / 3, Math.PI / 3]}
            azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
          >
            <LeonModel />
          </PresentationControls>

          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
