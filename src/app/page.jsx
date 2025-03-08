"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Stage, AccumulativeShadows, RandomizedLight, ContactShadows, useHelper, Html } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";

function Model() {
  const { scene } = useGLTF("models/test8/test2.gltf", true, (error) => {
    console.error('An error occurred loading the GLTF file:', error);
  });
  
  // Enable shadows on all meshes
  useEffect(() => {
    if (scene) {
      scene.traverse((node) => {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
    }
  }, [scene]);
  
  return <primitive object={scene} />;
}

useGLTF.preload("models/test8/test2.gltf");

// Component to visualize all light sources - properly inside Canvas
function LightHelpers() {
  const { scene } = useThree();
  const [lights, setLights] = useState([]);
  
  // Find all lights in the scene
  useEffect(() => {
    if (scene) {
      const foundLights = [];
      scene.traverse((object) => {
        if (object.isLight) {
          foundLights.push(object);
        }
      });
      setLights(foundLights);
    }
  }, [scene]);
  
  return (
    <>
      {lights.map((light, index) => {
        // Assign distinct colors based on light type
        const helperColor = light.isDirectionalLight ? '#FF0000' : 
                           light.isPointLight ? '#FFFF00' : 
                           light.isSpotLight ? '#00FF00' : 
                           light.isHemisphereLight ? '#00FFFF' : 
                           light.isAmbientLight ? '#FF00FF' : '#FFFFFF';
        
        // Create a unique label for each light
        const lightLabel = `${light.type.replace('Light', '')} ${index + 1}`;
        
        if (light.isDirectionalLight) {
          return (
            <group key={index}>
              <directionalLightHelper args={[light, 5, helperColor]} />
              <mesh position={light.position}>
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshBasicMaterial color={helperColor} />
              </mesh>
              <Html position={[light.position.x, light.position.y + 2, light.position.z]}>
                <div className="bg-black/70 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                  {lightLabel}
                </div>
              </Html>
            </group>
          );
        } else if (light.isPointLight) {
          return (
            <group key={index}>
              <pointLightHelper args={[light, 1, helperColor]} />
              <mesh position={light.position}>
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshBasicMaterial color={helperColor} />
              </mesh>
              <Html position={[light.position.x, light.position.y + 2, light.position.z]}>
                <div className="bg-black/70 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                  {lightLabel}
                </div>
              </Html>
            </group>
          );
        } else if (light.isSpotLight) {
          return (
            <group key={index}>
              <spotLightHelper args={[light, helperColor]} />
              <mesh position={light.position}>
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshBasicMaterial color={helperColor} />
              </mesh>
              <Html position={[light.position.x, light.position.y + 2, light.position.z]}>
                <div className="bg-black/70 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                  {lightLabel}
                </div>
              </Html>
            </group>
          );
        } else {
          return (
            <group key={index}>
              <mesh position={light.position}>
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshBasicMaterial color={helperColor} />
              </mesh>
              <Html position={[light.position.x, light.position.y + 2, light.position.z]}>
                <div className="bg-black/70 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                  {lightLabel}
                </div>
              </Html>
            </group>
          );
        }
      })}
    </>
  );
}

// Scene component that contains all 3D elements and handles light detection
function Scene({ showLightHelpers, setLightInfo, updateLight }) {
  const { scene } = useThree();
  const sunsetLightRef = useRef();
  const ambientLightRef = useRef();
  const lightsRef = useRef([]);
  
  // Find all lights in the scene and pass info to parent
  useEffect(() => {
    if (scene) {
      const foundLights = [];
      lightsRef.current = []; // Reset the lights ref array
      
      // First add our custom lights to the ref array
      if (sunsetLightRef.current) lightsRef.current.push(sunsetLightRef.current);
      if (ambientLightRef.current) lightsRef.current.push(ambientLightRef.current);
      
      // Then traverse the scene for all lights
      scene.traverse((object) => {
        if (object.isLight) {
          // Only add to lightsRef if it's not already there
          if (!lightsRef.current.includes(object)) {
            lightsRef.current.push(object);
          }
          
          foundLights.push({
            type: object.type,
            position: [
              object.position.x.toFixed(2),
              object.position.y.toFixed(2),
              object.position.z.toFixed(2)
            ],
            intensity: object.intensity.toFixed(2),
            color: '#' + object.color.getHexString(),
            castShadow: object.castShadow
          });
          
          // Log light information
          console.log(`Light:`, {
            type: object.type,
            position: object.position,
            intensity: object.intensity,
            color: object.color.getHexString(),
            castShadow: object.castShadow
          });
        }
      });
      setLightInfo(foundLights);
    }
  }, [scene, setLightInfo]);
  
  // Update light properties when controls are changed
  useEffect(() => {
    if (updateLight && lightsRef.current.length > 0) {
      const { index, property, value } = updateLight;
      const light = lightsRef.current[index];
      
      if (light) {
        if (property === 'intensity') {
          light.intensity = value;
        } else if (property === 'color') {
          light.color.set(value);
        } else if (property === 'position') {
          const { axis, value: axisValue } = value;
          light.position[axis] = axisValue;
        }
        
        // Update light info after changes
        const updatedLights = lightsRef.current.map(light => ({
          type: light.type,
          position: [
            light.position.x.toFixed(2),
            light.position.y.toFixed(2),
            light.position.z.toFixed(2)
          ],
          intensity: light.intensity.toFixed(2),
          color: '#' + light.color.getHexString(),
          castShadow: light.castShadow
        }));
        
        setLightInfo(updatedLights);
      }
    }
  }, [updateLight, setLightInfo]);
  
  return (
    <>
      <Stage
        environment="apartment"
        intensity={0.2} // Reduced intensity to allow our custom lights to have more effect
        shadows={{
          type: 'contact',
          opacity: 0.8,
          blur: 0,
          color: '#000000'
        }}
        adjustCamera={false}
        shadowBias={-0.0005}
        presetsType="soft"
      >
        <Model />
      </Stage>
      
      {/* Main sunset directional light - simulates the sun */}
      <directionalLight 
        ref={sunsetLightRef}
        color="#FF7F50" // Coral/orange color for sunset
        intensity={5}
        position={[-50, 25, -50]} // Coming from the "west" side
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={100}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      {/* Ambient light with warm color to fill shadows */}
      <ambientLight 
        ref={ambientLightRef}
        color="#FFF0E0" // Warm white
        intensity={0}
      />
      
      {/* Add contact shadows for sharper, darker shadows */}
      <ContactShadows
        position={[0, 1, 1]}
        opacity={1}
        scale={100}
        blur={1}
        far={10}
        resolution={1024}
        color="#000000"
      />
      
      <CameraController />
      
      <color attach="background" args={["#b4bebf"]} /> {/* Light gray background */}
      
      {/* Add light helpers when enabled */}
      {showLightHelpers && <LightHelpers />}
    </>
  );
}

// Component to display light information on screen
function LightInfoPanel({ lights }) {
  if (!lights || lights.length === 0) {
    return null;
  }
  
  // Color legend for light types
  const lightTypeColors = {
    'DirectionalLight': '#FF0000',
    'PointLight': '#FFFF00',
    'SpotLight': '#00FF00',
    'HemisphereLight': '#00FFFF',
    'AmbientLight': '#FF00FF',
    'RectAreaLight': '#FFFFFF'
  };
  
  return (
    <div className="absolute top-4 right-4 bg-black/70 text-white p-4 rounded z-50 max-w-xs max-h-[80vh] overflow-auto">
      <h3 className="text-lg font-bold mb-2">Light Sources: {lights.length}</h3>
      
      {/* Color legend */}
      <div className="mb-3 p-2 bg-black/50 rounded">
        <p className="font-semibold mb-1">Light Type Legend:</p>
        <div className="grid grid-cols-2 gap-1">
          {Object.entries(lightTypeColors).map(([type, color]) => (
            <div key={type} className="flex items-center">
              <div className="w-3 h-3 mr-1" style={{ backgroundColor: color }}></div>
              <span className="text-xs">{type.replace('Light', '')}</span>
            </div>
          ))}
        </div>
      </div>
      
      {lights.map((light, index) => {
        const lightColor = lightTypeColors[light.type] || '#FFFFFF';
        
        return (
          <div key={index} className="mb-3 border-b border-white/20 pb-2">
            <div className="flex items-center">
              <div 
                className="w-4 h-4 mr-2 rounded-full" 
                style={{ backgroundColor: lightColor }}
              />
              <p className="font-semibold">{light.type}</p>
            </div>
            <p>Position: [{light.position.join(', ')}]</p>
            <p>Intensity: {light.intensity}</p>
            <div className="flex items-center">
              <span>Color: {light.color}</span>
              <div 
                className="ml-2 w-4 h-4 rounded-full" 
                style={{ backgroundColor: light.color }}
              />
            </div>
            <p>Casts Shadow: {light.castShadow ? 'Yes' : 'No'}</p>
          </div>
        );
      })}
    </div>
  );
}

// New component for controlling lights with sliders
function LightControlPanel({ lights, onLightUpdate }) {
  if (!lights || lights.length === 0) {
    return null;
  }

  const handleIntensityChange = (index, value) => {
    onLightUpdate(index, 'intensity', parseFloat(value));
  };

  const handleColorChange = (index, value) => {
    onLightUpdate(index, 'color', value);
  };

  const handlePositionChange = (index, axis, value) => {
    onLightUpdate(index, 'position', { axis, value: parseFloat(value) });
  };

  return (
    <div className="absolute bottom-4 right-4 bg-black/70 text-white p-4 rounded z-50 max-w-md max-h-[60vh] overflow-auto">
      <h3 className="text-lg font-bold mb-2">Sunset Light Controls</h3>
      
      {lights.map((light, index) => {
        // Skip ambient lights as they don't have position
        if (light.type === 'AmbientLight') {
          return (
            <div key={index} className="mb-4 p-3 bg-gray-800/50 rounded">
              <p className="font-semibold mb-2">{light.type} (Ambient Fill)</p>
              
              <div className="mb-2">
                <label className="block text-sm mb-1">Intensity</label>
                <input 
                  type="range" 
                  min="0" 
                  max="2" 
                  step="0.1" 
                  value={light.intensity} 
                  onChange={(e) => handleIntensityChange(index, e.target.value)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs">
                  <span>0</span>
                  <span>{light.intensity}</span>
                  <span>2</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm mb-1">Color</label>
                <div className="flex items-center">
                  <input 
                    type="color" 
                    value={light.color} 
                    onChange={(e) => handleColorChange(index, e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-xs">{light.color}</span>
                </div>
              </div>
            </div>
          );
        }
        
        // Custom labels for our sunset lights
        let lightLabel = light.type;
        if (index === 3) { // Assuming the main sunset light is at index 3
          lightLabel += " (Sunset)";
        }
        
        return (
          <div key={index} className="mb-4 p-3 bg-gray-800/50 rounded">
            <p className="font-semibold mb-2">{lightLabel}</p>
            
            <div className="mb-2">
              <label className="block text-sm mb-1">Intensity</label>
              <input 
                type="range" 
                min="0" 
                max="5" 
                step="0.1" 
                value={light.intensity} 
                onChange={(e) => handleIntensityChange(index, e.target.value)}
                className="w-full"
              />
              <div className="flex justify-between text-xs">
                <span>0</span>
                <span>{light.intensity}</span>
                <span>5</span>
              </div>
            </div>
            
            <div className="mb-2">
              <label className="block text-sm mb-1">Color</label>
              <div className="flex items-center">
                <input 
                  type="color" 
                  value={light.color} 
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  className="mr-2"
                />
                <span className="text-xs">{light.color}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm mb-1">Position</label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs mb-1">X: {light.position[0]}</label>
                  <input 
                    type="range" 
                    min="-100" 
                    max="100" 
                    step="5" 
                    value={light.position[0]} 
                    onChange={(e) => handlePositionChange(index, 'x', e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">Y: {light.position[1]}</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    step="5" 
                    value={light.position[1]} 
                    onChange={(e) => handlePositionChange(index, 'y', e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">Z: {light.position[2]}</label>
                  <input 
                    type="range" 
                    min="-100" 
                    max="100" 
                    step="5" 
                    value={light.position[2]} 
                    onChange={(e) => handlePositionChange(index, 'z', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
      
      <div className="mt-4 p-3 bg-gray-800/50 rounded">
        <h4 className="font-semibold mb-2">Sunset Presets</h4>
        <div className="grid grid-cols-2 gap-2">
          <button 
            className="px-2 py-1 bg-orange-500 text-white rounded text-sm"
            onClick={() => {
              // Apply golden hour preset
              onLightUpdate(3, 'color', '#FFA500'); // Orange sunset
              onLightUpdate(3, 'intensity', 2.0);
              onLightUpdate(3, 'position', { axis: 'x', value: -50 });
              onLightUpdate(3, 'position', { axis: 'y', value: 20 });
              onLightUpdate(4, 'color', '#FFE0C0'); // Warm ambient
              onLightUpdate(4, 'intensity', 0.6);
            }}
          >
            Golden Hour
          </button>
          <button 
            className="px-2 py-1 bg-red-600 text-white rounded text-sm"
            onClick={() => {
              // Apply late sunset preset
              onLightUpdate(3, 'color', '#FF4500'); // Red-orange sunset
              onLightUpdate(3, 'intensity', 1.5);
              onLightUpdate(3, 'position', { axis: 'x', value: -60 });
              onLightUpdate(3, 'position', { axis: 'y', value: 10 });
              onLightUpdate(4, 'color', '#FFD700'); // Golden ambient
              onLightUpdate(4, 'intensity', 0.4);
            }}
          >
            Late Sunset
          </button>
          <button 
            className="px-2 py-1 bg-purple-600 text-white rounded text-sm"
            onClick={() => {
              // Apply dusk preset
              onLightUpdate(3, 'color', '#8A2BE2'); // Purple sunset
              onLightUpdate(3, 'intensity', 1.0);
              onLightUpdate(3, 'position', { axis: 'x', value: -70 });
              onLightUpdate(3, 'position', { axis: 'y', value: 5 });
              onLightUpdate(4, 'color', '#483D8B'); // Dark slate blue ambient
              onLightUpdate(4, 'intensity', 0.3);
            }}
          >
            Dusk
          </button>
          <button 
            className="px-2 py-1 bg-yellow-500 text-white rounded text-sm"
            onClick={() => {
              // Apply bright day preset
              onLightUpdate(3, 'color', '#FFFFFF'); // White sun
              onLightUpdate(3, 'intensity', 3.0);
              onLightUpdate(3, 'position', { axis: 'x', value: -30 });
              onLightUpdate(3, 'position', { axis: 'y', value: 50 });
              onLightUpdate(4, 'color', '#F0F8FF'); // Alice blue ambient
              onLightUpdate(4, 'intensity', 0.8);
            }}
          >
            Bright Day
          </button>
        </div>
      </div>
    </div>
  );
}

// Add a loading component
function LoadingScreen() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/90">
      <div className="text-2xl font-semibold text-gray-800">
        Loading 3D Scene...
      </div>
    </div>
  );
}

// Add this new component for scroll control
function CameraController() {
  const controlsRef = useRef();
  const rotationRef = useRef(0);
  const cameraRef = useRef();
  const spiralRef = useRef(0);
  const isFirstScroll = useRef(true);
  const isDragging = useRef(false);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const isTouching = useRef(false);
  
  useFrame(({ camera }) => {
    if (!cameraRef.current) {
      cameraRef.current = camera;
    }
  });

  useEffect(() => {
    const handleScroll = (e) => {
      if (controlsRef.current && cameraRef.current) {
        // Only prevent default for wheel events within the canvas
        if (e.type === 'wheel') {
          e.preventDefault();
        }
        
        let scrollAmount = 0;
        if (e.type === 'wheel') {
          if (isFirstScroll.current) {
            // Reverse the direction: negative deltaY (scroll up) should zoom in
            scrollAmount = -e.deltaY * 0.05;
            isFirstScroll.current = false;
          } else {
            // Reverse the direction: negative deltaY (scroll up) should zoom in
            scrollAmount = -e.deltaY * 0.2;
          }
        } else if (e.type === 'keydown') {
          // Reverse arrow keys for consistency
          if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') scrollAmount = 50; // Zoom in
          if (e.key === 'ArrowDown' || e.key === 'ArrowRight') scrollAmount = -50; // Zoom out
        } else if (e.type === 'mousemove' && isDragging.current) {
          // Reverse mouse drag direction for consistency
          scrollAmount = -e.movementY * 2;
        }

        // Spiral effect
        spiralRef.current += Math.abs(scrollAmount) * 0.00001;
        const rotationSpeed = 0.005 * (1 + spiralRef.current * 0.05);
        rotationRef.current += scrollAmount * rotationSpeed;
        controlsRef.current.setAzimuthalAngle(rotationRef.current);
        
        // Adjusted zoom range
        const zoomSpeed = 0.02;
        const minDistance = 40;   // Minimum zoom distance
        const maxDistance = 160;  // Maximum zoom distance
        
        const currentDistance = cameraRef.current.position.length();
        const newDistance = currentDistance - scrollAmount * zoomSpeed; // Reverse the direction
        const clampedDistance = Math.max(minDistance, Math.min(maxDistance, newDistance));
        
        // Height adjustment
        const heightOffset = spiralRef.current * 0.1;
        const normalizedPosition = cameraRef.current.position.normalize();
        normalizedPosition.y += heightOffset * 0.02;
        normalizedPosition.normalize().multiplyScalar(clampedDistance);
        
        cameraRef.current.position.copy(normalizedPosition);
      }
    };

    // Touch event handlers for mobile
    const handleTouchStart = (e) => {
      // Only handle touch events if they're on the canvas element
      const canvasElement = document.querySelector('canvas');
      if (!canvasElement) return;
      
      const rect = canvasElement.getBoundingClientRect();
      const touch = e.touches[0];
      
      // Check if the touch is within the canvas
      if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
          touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
        
        e.preventDefault(); // Only prevent default if touching the canvas
        isTouching.current = true;
        touchStartY.current = touch.clientY;
        touchStartX.current = touch.clientX;
      }
    };

    const handleTouchMove = (e) => {
      // Only process if we started the touch on the canvas
      if (!isTouching.current) return;
      
      if (e.touches.length === 1 && controlsRef.current && cameraRef.current) {
        e.preventDefault(); // Prevent scrolling while manipulating the 3D scene
        
        const touch = e.touches[0];
        const touchY = touch.clientY;
        const touchX = touch.clientX;
        
        // Calculate both X and Y movement for better control
        const deltaY = touchStartY.current - touchY;
        const deltaX = touchStartX.current - touchX;
        
        touchStartY.current = touchY;
        touchStartX.current = touchX;
        
        // Reverse the direction: swipe up (negative deltaY) should zoom in
        // Use a combination of X and Y movement for a more natural feel
        const scrollAmount = -(deltaY * 1.5 + deltaX * 0.5);
        
        // Apply the same camera transformations as in handleScroll
        spiralRef.current += Math.abs(scrollAmount) * 0.00001;
        const rotationSpeed = 0.005 * (1 + spiralRef.current * 0.05);
        rotationRef.current += scrollAmount * rotationSpeed;
        controlsRef.current.setAzimuthalAngle(rotationRef.current);
        
        const zoomSpeed = 0.02;
        const minDistance = 40;
        const maxDistance = 160;
        
        const currentDistance = cameraRef.current.position.length();
        const newDistance = currentDistance - scrollAmount * zoomSpeed; // Reverse the direction
        const clampedDistance = Math.max(minDistance, Math.min(maxDistance, newDistance));
        
        const heightOffset = spiralRef.current * 0.1;
        const normalizedPosition = cameraRef.current.position.normalize();
        normalizedPosition.y += heightOffset * 0.02;
        normalizedPosition.normalize().multiplyScalar(clampedDistance);
        
        cameraRef.current.position.copy(normalizedPosition);
      }
    };
    
    const handleTouchEnd = () => {
      isTouching.current = false;
    };

    // Middle mouse button (wheel click) handlers
    const handleMouseDown = (e) => {
      if (e.button === 1) { // Middle mouse button
        isDragging.current = true;
        e.preventDefault();
      }
    };

    const handleMouseUp = (e) => {
      if (e.button === 1) {
        isDragging.current = false;
      }
    };

    // Get the canvas element to attach events specifically to it
    const canvasElement = document.querySelector('canvas');
    if (canvasElement) {
      canvasElement.addEventListener('wheel', handleScroll, { passive: false });
      canvasElement.addEventListener('touchstart', handleTouchStart, { passive: false });
      canvasElement.addEventListener('touchmove', handleTouchMove, { passive: false });
      canvasElement.addEventListener('touchend', handleTouchEnd);
      canvasElement.addEventListener('mousedown', handleMouseDown);
    }
    
    // These events can remain on window
    window.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        handleScroll(e);
      }
    });
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleScroll);
    window.addEventListener('mouseleave', () => { isDragging.current = false; });

    return () => {
      if (canvasElement) {
        canvasElement.removeEventListener('wheel', handleScroll);
        canvasElement.removeEventListener('touchstart', handleTouchStart);
        canvasElement.removeEventListener('touchmove', handleTouchMove);
        canvasElement.removeEventListener('touchend', handleTouchEnd);
        canvasElement.removeEventListener('mousedown', handleMouseDown);
      }
      
      window.removeEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
          handleScroll(e);
        }
      });
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleScroll);
      window.removeEventListener('mouseleave', () => { isDragging.current = false; });
    };
  }, []);

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={false}
      enablePan={false}
      enableRotate={false}
      maxPolarAngle={Math.PI / 2}
      minPolarAngle={Math.PI / 4}
    />
  );
}

export default function newHouse() {
  const [isMobile, setIsMobile] = useState(false);
  const [showLightHelpers, setShowLightHelpers] = useState(false); // Default to false
  const [lightInfo, setLightInfo] = useState([]);
  const [showControls, setShowControls] = useState(false); // Default to false
  const [updateLight, setUpdateLight] = useState(null);
  
  // Detect mobile device on component mount
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 768;
      setIsMobile(isMobileDevice);
      
      // Set initial state based on device type
      setShowLightHelpers(!isMobileDevice);
      setShowControls(!isMobileDevice);
    };
    
    // Check on initial load
    checkMobile();
    
    // Add resize listener to update when orientation changes
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Toggle light helpers with 'L' key and controls with 'C' key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'l' || e.key === 'L') {
        setShowLightHelpers(prev => !prev);
      } else if (e.key === 'c' || e.key === 'C') {
        setShowControls(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Handle light updates from the control panel
  const handleLightUpdate = (index, property, value) => {
    setUpdateLight({ index, property, value });
    
    // Update the local state for the UI
    setLightInfo(prevLights => {
      const updatedLights = [...prevLights];
      
      if (property === 'intensity') {
        updatedLights[index].intensity = value.toFixed(2);
      } else if (property === 'color') {
        updatedLights[index].color = value;
      } else if (property === 'position') {
        const { axis, value: axisValue } = value;
        const axisIndex = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
        updatedLights[index].position[axisIndex] = axisValue.toFixed(2);
      }
      
      return updatedLights;
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
      <nav className="fixed w-full bg-transparent backdrop-blur-[2px] z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
          
            
            <div className="flex space-x-4">
              {/* Add button to toggle light helpers */}
              <button 
                className={`px-4 py-2 rounded ${showLightHelpers ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                onClick={() => setShowLightHelpers(prev => !prev)}
              >
                {showLightHelpers ? 'Hide Light Helpers' : 'Show Light Helpers'}
              </button>
              
              {/* Add button to toggle light controls */}
              <button 
                className={`px-4 py-2 rounded ${showControls ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                onClick={() => setShowControls(prev => !prev)}
              >
                {showControls ? 'Hide Light Controls' : 'Show Light Controls'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="w-full h-screen pt-20">
        <section className="relative h-screen">
          <div className="absolute inset-0 z-10">
            <Suspense fallback={<LoadingScreen />}>
              <Canvas
                camera={{
                  position: [195, 97.5, 195],
                  fov: 45,
                }}
                shadows={{ 
                  type: 'basic',
                  enabled: true
                }}
                gl={{ 
                  antialias: true,
                  toneMapping: THREE.ACESFilmicToneMapping,
                  toneMappingExposure: 1.0
                }}
                style={{ 
                  background: 'linear-gradient(to bottom, #e0e0e0, #f8f8f8)',
                  touchAction: 'none' // Prevent browser handling of touch events on canvas
                }}
              >
                <Scene 
                  showLightHelpers={showLightHelpers} 
                  setLightInfo={setLightInfo}
                  updateLight={updateLight}
                />
              </Canvas>
            </Suspense>
            
            {/* Display light information */}
            {showLightHelpers && <LightInfoPanel lights={lightInfo} />}
            
            {/* Display light controls */}
            {showControls && <LightControlPanel 
              lights={lightInfo} 
              onLightUpdate={handleLightUpdate} 
            />}
          </div>
          
          {/* Instructions */}
          <div className="absolute bottom-4 left-4 bg-black/70 text-white p-3 rounded z-50">
            <p>Press 'L' to toggle light helpers</p>
            <p>Press 'C' to toggle light controls</p>
          </div>
        </section>
      </main>
    </div>
  );
} 