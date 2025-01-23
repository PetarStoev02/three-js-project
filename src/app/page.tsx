"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Stage } from "@react-three/drei";
import { Suspense } from "react";
import Link from "next/link";
import * as THREE from "three";

// Create a separate component for the 3D model
function Model() {
  // Using the model from public folder
  const { scene } = useGLTF("/model/result.gltf", true);
  return (
    <primitive
      object={scene}
      scale={1} // Adjust scale as needed
      position={[0, -1, 0]} // Adjust position as needed
      rotation={[0, 0, 0]} // Adjust rotation as needed
    />
  );
}

// Preload the model with draco support
useGLTF.preload("/model/result.gltf", true);

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Navigation Bar */}
      <nav className="fixed w-full bg-transparent backdrop-blur-[2px] z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                The Standing Man
              </h1>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center space-x-12">
                <Link
                  href="#about"
                  className="text-gray-800 hover:text-blue-600 transition-colors duration-300 text-sm uppercase tracking-wider"
                >
                  About
                </Link>
                <Link
                  href="#features"
                  className="text-gray-800 hover:text-blue-600 transition-colors duration-300 text-sm uppercase tracking-wider"
                >
                  Features
                </Link>
                <Link
                  href="#contact"
                  className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300 text-sm uppercase tracking-wider"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16 w-full">
        {/* Hero Section */}
        <section className="relative h-[90vh]">
          <div className="absolute inset-0 z-10">
            <Canvas
              camera={{
                position: [10, 10, 10], // Move camera further back
                fov: 50, // Wider field of view
              }}
            >
              <Suspense fallback={null}>
                <Stage
                  environment="city"
                  intensity={0.6}
                  adjustCamera={false} // Prevent Stage from moving camera
                >
                  <Model />
                </Stage>
                <OrbitControls
                  enableZoom={true}
                  enablePan={true}
                  enableRotate={true}
                  autoRotate={true}
                  autoRotateSpeed={1}
                  maxDistance={50} // Allow zooming out further
                  minDistance={2} // Don't allow getting too close
                />
                <Environment preset="sunset" />
              </Suspense>
            </Canvas>
          </div>
          <div className="relative max-w-7xl mx-auto h-full flex items-center">
            <div className="bg-white/80 backdrop-blur-sm p-8 z-20 rounded-lg max-w-lg ml-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Man on a Chair
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                This captivating 3D model depicts an elderly gentleman standing
                atop a chair, challenging conventional perspectives and sparking
                curiosity about his story.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition-colors duration-300">
                Discover His Story
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
