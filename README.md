# Three.js Interactive 3D Scene Viewer

An interactive 3D scene viewer built with React Three Fiber, featuring advanced lighting controls, real-time light visualization, and immersive camera interactions. Explore 3D models with customizable sunset lighting presets and intuitive controls.

🌐 **Live Demo:** [https://petarstoev02.github.io/three-js-project/](https://petarstoev02.github.io/three-js-project/)

## Features

### 🎨 Interactive Lighting System
- **Real-time Light Controls**: Adjust intensity, color, and position of all light sources
- **Light Visualization**: Toggle visual helpers to see all light sources in the scene
- **Sunset Lighting Presets**: Quick access to Golden Hour, Late Sunset, Dusk, and Bright Day lighting scenarios
- **Dynamic Light Detection**: Automatically detects and displays information about all lights in the scene

### 🎮 Camera Controls
- **Scroll-based Navigation**: Zoom in/out and rotate the camera with mouse wheel or touch gestures
- **Spiral Camera Movement**: Smooth spiral effect as you zoom and rotate
- **Orbit Controls**: Intuitive camera rotation and positioning
- **Mobile Support**: Full touch gesture support for mobile devices

### 🖼️ 3D Model Rendering
- **GLTF Model Support**: Load and display 3D models in GLTF format
- **Shadow Rendering**: Realistic shadows with contact shadows and shadow mapping
- **Environment Mapping**: Pre-configured environment for realistic lighting
- **Material Support**: Full support for PBR materials and textures

### ⌨️ Keyboard Shortcuts
- **Press 'L'**: Toggle light helpers visualization
- **Press 'C'**: Toggle light control panel
- **Arrow Keys**: Navigate and zoom the camera

## Tech Stack

- **Next.js 14** - React framework with App Router
- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for React Three Fiber
- **Three.js** - 3D graphics library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/petarstoev02/three-js-project.git
cd three-js-project
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
three-js-project/
├── public/
│   └── models/          # 3D model files (GLTF) and textures
├── src/
│   └── app/
│       ├── page.jsx    # Main 3D scene component
│       ├── layout.tsx  # Root layout
│       └── globals.css # Global styles
├── package.json
└── README.md
```

## Usage

### Loading Your Own 3D Model

1. Place your GLTF model files in the `public/models/` directory
2. Update the model path in `src/app/page.jsx`:
```jsx
const { scene } = useGLTF("models/your-model/model.gltf");
```

### Customizing Lighting

The scene includes several customizable lights:
- **Directional Light**: Main sunset light (default: coral/orange)
- **Ambient Light**: Fill light for shadows (default: warm white)
- **Environment Light**: From the Stage component

Adjust these in the light control panel or modify the default values in the `Scene` component.

### Lighting Presets

The application includes four built-in lighting presets:
- **Golden Hour**: Warm orange sunset with soft ambient fill
- **Late Sunset**: Deep red-orange with golden ambient
- **Dusk**: Purple sunset with dark slate blue ambient
- **Bright Day**: White sunlight with bright ambient

## Building for Production

```bash
npm run build
npm start
```

## Deployment

This project is configured for GitHub Pages deployment. The live version is available at:
[https://petarstoev02.github.io/three-js-project/](https://petarstoev02.github.io/three-js-project/)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is open source and available under the MIT License.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

---

**Built with ❤️ using React Three Fiber and Three.js**
