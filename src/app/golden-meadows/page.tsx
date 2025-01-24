"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Stage } from "@react-three/drei";
import { Suspense } from "react";
import Link from "next/link";

function Model() {
  const { scene } = useGLTF("/models/house/result.gltf");
  return (
    <primitive
      object={scene}
      scale={50}
      position={[0, -1, 0]}
      rotation={[0, Math.PI, 0]}
    />
  );
}

useGLTF.preload("/models/house/result.gltf");

export default function GoldenMeadows() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <nav className="fixed w-full bg-transparent backdrop-blur-[2px] z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent">
                Golden Meadows
              </h1>
            </Link>
            <div className="hidden sm:block">
              <div className="flex items-center space-x-12">
                <Link
                  href="#about"
                  className="text-gray-800 hover:text-amber-600 transition-colors duration-300 text-sm uppercase tracking-wider"
                >
                  About
                </Link>
                <Link
                  href="#features"
                  className="text-gray-800 hover:text-amber-600 transition-colors duration-300 text-sm uppercase tracking-wider"
                >
                  Features
                </Link>
                <Link
                  href="#contact"
                  className="px-6 py-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-colors duration-300 text-sm uppercase tracking-wider"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="w-full h-screen">
        <section className="relative h-screen">
          <div className="absolute inset-0 z-10">
            <Canvas
              camera={{
                position: [15, 15, 15],
                fov: 45,
              }}
            >
              <Suspense fallback={null}>
                <Stage environment="city" intensity={0.6}>
                  <Model />
                </Stage>
                <OrbitControls
                  enableZoom={true}
                  enablePan={true}
                  enableRotate={true}
                  autoRotate={true}
                  autoRotateSpeed={1}
                  maxDistance={50}
                  minDistance={1}
                  minPolarAngle={0}
                  maxPolarAngle={Math.PI / 2}
                />
                <Environment preset="sunset" />
              </Suspense>
            </Canvas>
          </div>
          <div className="relative max-w-7xl mx-auto h-full flex items-center">
            <div className="bg-white/80 backdrop-blur-sm p-8 z-20 rounded-lg max-w-lg ml-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome to Golden Meadows
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Discover our charming neighborhood where community meets luxury. 
                Nestled in pristine surroundings, our beautiful homes offer the perfect 
                blend of modern comfort and timeless elegance.
              </p>
              <button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition-colors duration-300">
                Explore Homes
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
} 