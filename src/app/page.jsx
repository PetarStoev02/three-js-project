"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Stage } from "@react-three/drei";
import { Suspense } from "react";
import Link from "next/link";

// Create preview components for each model
function HousePreview() {
  const { scene } = useGLTF("/three-js-project/models/house/result.gltf");
  return (
    <primitive
      object={scene}
      scale={50}
      position={[0, -1, 0]}
      rotation={[0, Math.PI, 0]}
    />
  );
}

function OldManPreview() {
  const { scene } = useGLTF("/three-js-project/models/old-man/result.gltf");
  return (
    <primitive
      object={scene}
      scale={1}
      position={[0, -1, 0]}
      rotation={[0, Math.PI, 0]}
    />
  );
}

function RoomPreview() {
  const { scene } = useGLTF("/three-js-project/models/room/result.gltf");
  return (
    <primitive
      object={scene}
      scale={50}
      position={[0, -1, 0]}
      rotation={[0, Math.PI, 0]}
    />
  );
}

// Preload all models
useGLTF.preload("/three-js-project/models/house/result.gltf");
useGLTF.preload("/three-js-project/models/old-man/result.gltf");
useGLTF.preload("/three-js-project/models/room/result.gltf");

export default function Home() {
  return (
    <div className="min-h-screen w-screen bg-black overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed w-full bg-black/30 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
          <h1 className="text-2xl sm:text-3xl font-light text-center text-white tracking-wider">
            3D SHOWCASE
          </h1>
        </div>
      </nav>

      {/* Main Content */}
      <main className="min-h-screen w-full flex items-start sm:items-center justify-center pt-20 pb-8 px-4">
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Golden Meadows Card */}
          <Link href="/golden-meadows" className="group">
            <div className="bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.02] hover:shadow-amber-500/20">
              <div className="h-[300px] sm:h-[400px] relative">
                <Canvas
                  camera={{
                    position: [15, 15, 15],
                    fov: 45,
                  }}
                >
                  <Suspense fallback={null}>
                    <Stage environment="sunset" intensity={0.6}>
                      <HousePreview />
                    </Stage>
                    <OrbitControls
                      enableZoom={false}
                      autoRotate={true}
                      autoRotateSpeed={1}
                    />
                  </Suspense>
                </Canvas>
              </div>
              <div className="p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-light text-white mb-2 sm:mb-3">
                  Golden Meadows
                </h2>
                <p className="text-sm sm:text-base text-neutral-400 mb-4 font-light">
                  Discover our luxurious residential community with modern homes.
                </p>
                <span className="text-amber-500 text-xs sm:text-sm tracking-wider group-hover:text-amber-400 transition-colors">
                  EXPLORE PROJECT →
                </span>
              </div>
            </div>
          </Link>

          {/* Old Man Character Card */}
          <Link href="/character" className="group">
            <div className="bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.02] hover:shadow-blue-500/20">
              <div className="h-[300px] sm:h-[400px] relative">
                <Canvas
                  camera={{
                    position: [3, 2, 3],
                    fov: 45,
                  }}
                >
                  <Suspense fallback={null}>
                    <Stage environment="sunset" intensity={0.6}>
                      <OldManPreview />
                    </Stage>
                    <OrbitControls
                      enableZoom={false}
                      autoRotate={true}
                      autoRotateSpeed={1}
                    />
                  </Suspense>
                </Canvas>
              </div>
              <div className="p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-light text-white mb-2 sm:mb-3">
                  Character Showcase
                </h2>
                <p className="text-sm sm:text-base text-neutral-400 mb-4 font-light">
                  Explore our detailed character model with realistic features.
                </p>
                <span className="text-blue-500 text-xs sm:text-sm tracking-wider group-hover:text-blue-400 transition-colors">
                  EXPLORE PROJECT →
                </span>
              </div>
            </div>
          </Link>

          {/* Room Interior Card */}
          <Link href="/interior" className="group md:col-span-2 lg:col-span-1">
            <div className="bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.02] hover:shadow-green-500/20">
              <div className="h-[300px] sm:h-[400px] relative">
                <Canvas
                  camera={{
                    position: [3, 2, 3],
                    fov: 45,
                  }}
                >
                  <Suspense fallback={null}>
                    <Stage environment="sunset" intensity={0.6}>
                      <RoomPreview />
                    </Stage>
                    <OrbitControls
                      enableZoom={false}
                      autoRotate={true}
                      autoRotateSpeed={1}
                    />
                  </Suspense>
                </Canvas>
              </div>
              <div className="p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-light text-white mb-2 sm:mb-3">
                  Interior Design
                </h2>
                <p className="text-sm sm:text-base text-neutral-400 mb-4 font-light">
                  Take a tour of our modern interior design concepts.
                </p>
                <span className="text-green-500 text-xs sm:text-sm tracking-wider group-hover:text-green-400 transition-colors">
                  EXPLORE PROJECT →
                </span>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
