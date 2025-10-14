import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";
import { useInView } from 'react-intersection-observer';

const Computers = ({ isMobile }) => {
  const computer = useGLTF("/desktop_pc/scene.gltf");

// ...existing code...
useEffect(() => {
  if (!computer?.scene) return;

  computer.scene.traverse((child) => {
    if (child.isMesh && child.geometry && child.geometry.attributes?.position) {
      const posAttr = child.geometry.attributes.position;
      const arr = posAttr.array;
      let bad = false;

      // detect NaN / non-finite values
      for (let i = 0; i < arr.length; i++) {
        const v = arr[i];
        if (!Number.isFinite(v)) { bad = true; break; }
      }

      if (bad) {
        console.warn('Bad geometry (NaN) in mesh:', child.name || child.uuid, child);

        // Option A: sanitize by replacing invalid values with 0
        for (let i = 0; i < arr.length; i++) {
          if (!Number.isFinite(arr[i])) arr[i] = 0;
        }
        posAttr.needsUpdate = true;

        // recompute safely
        try {
          child.geometry.computeBoundingSphere();
          child.geometry.computeBoundingBox && child.geometry.computeBoundingBox();
        } catch (e) {
          console.error('Failed to compute bounds after sanitizing:', child.name || child.uuid, e);
        }


      }

      // normal setup
      child.castShadow = true;
      child.receiveShadow = true;
      if (child.material) child.material.needsUpdate = true;
    }
  });
}, [computer]);

  return (
    <mesh>
      <hemisphereLight intensity={0.50} groundColor='black' />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={isMobile ? 1.5 : 9000}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={2.5} />
      <primitive
        object={computer.scene}
        scale={isMobile ? 0.6 : 0.75}
        position={isMobile ? [0, -2.9, -2] : [0, -3.25, -1.5]}
        rotation={[-0.01, -0.2, -0.05]}
      />
    </mesh>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Add a listener for changes to the screen size
    const mediaQuery = window.matchMedia("(max-width: 500px)");

    // Set the initial value of the `isMobile` state variable
    setIsMobile(mediaQuery.matches);

    // Define a callback function to handle changes to the media query
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    // Add the callback function as a listener for changes to the media query
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // Remove the listener when the component is unmounted
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      frameloop='demand'
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true, antialias: true, powerPreference: 'high-performance', alpha: true }}
      style={{ width: "100vw", height: "100vh", overflow: "hidden", touchAction: "none" }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Computers isMobile={isMobile} />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;