"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Stage } from "@react-three/drei";
import { Suspense } from "react";
import Link from "next/link";

function Model() {
  const { scene } = useGLTF("/three-js-project/models/newHouse/result.gltf");
  return (
    <primitive
      object={scene}
      scale={1}
      position={[0, -1, 0]}
      rotation={[0, Math.PI, 0]}
    />
  );
}

useGLTF.preload("/three-js-project/models/newHouse/result.gltf");

export default function newHouse() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <nav className="fixed w-full bg-transparent backdrop-blur-[2px] z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                Interior Design
              </h1>
            </Link>
          </div>
        </div>
      </nav>

      <main className="w-full h-screen">
        <section className="relative h-screen">
          <div className="absolute inset-0 z-10">
            <Canvas
              camera={{
                position: [5, 3, 5],
                fov: 45,
              }}
            >
              <Suspense fallback={null}>
                <Stage environment="apartment" intensity={0.6}>
                  <Model />
                </Stage>
                <OrbitControls
                  enableZoom={true}
                  enablePan={true}
                  enableRotate={true}
                  autoRotate={true}
                  autoRotateSpeed={1}
                />
                <Environment preset="apartment" />
              </Suspense>
            </Canvas>
          </div>
          <div className="relative max-w-7xl mx-auto h-full flex items-center">
            <div className="bg-white/80 backdrop-blur-sm p-8 z-20 rounded-lg max-w-lg ml-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Modern Interior Design
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Step into our virtual showroom and experience contemporary interior design.
                Explore how we blend functionality with aesthetics to create perfect living spaces.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
} 