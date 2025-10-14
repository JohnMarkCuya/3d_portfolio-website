import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Computers = ({ isMobile }) => {
  const computer = useGLTF("./desktop_pc/scene.gltf"); // keep .gltf

  // Fix possible NaN geometry and lighting for mobile
  useEffect(() => {
    if (!computer?.scene) return;

    computer.scene.traverse((child) => {
      if (child.isMesh && child.geometry && child.geometry.attributes?.position) {
        const posAttr = child.geometry.attributes.position;
        const arr = posAttr.array;

        let hasInvalid = false;
        for (let i = 0; i < arr.length; i++) {
          if (!Number.isFinite(arr[i])) {
            hasInvalid = true;
            break;
          }
        }

        if (hasInvalid) {
          console.warn("Invalid geometry detected:", child.name);
          for (let i = 0; i < arr.length; i++) {
            if (!Number.isFinite(arr[i])) arr[i] = 0;
          }
          posAttr.needsUpdate = true;
          try {
            child.geometry.computeBoundingSphere();
            child.geometry.computeBoundingBox?.();
          } catch (e) {
            console.error("Bounding recompute failed:", child.name, e);
          }
        }

        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [computer]);

  return (
    <mesh>
      {/* Softer lighting for mobile stability */}
      <hemisphereLight intensity={0.6} groundColor="black" />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.25}
        penumbra={0.8}
        intensity={isMobile ? 1.4 : 4.5}
        castShadow
        shadow-mapSize={512}
      />
      <pointLight intensity={1.2} />

      <primitive
        object={computer.scene}
        scale={isMobile ? 0.5 : 0.75}
        position={isMobile ? [0, -1.6, -2.3] : [0, -3.25, -1.5]}
        rotation={[-0.01, -0.2, -0.05]}
      />
    </mesh>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event) => setIsMobile(event.matches);
    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () => mediaQuery.removeEventListener("change", handleMediaQueryChange);
  }, []);

  return (
    <Canvas
      shadows
      dpr={[1, 1.25]} // keeps it smooth on phones
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        preserveDrawingBuffer: true,
      }}
      style={{ width: "100vw", height: "100vh", background: "#1a002b" }} // soft purple bg
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

useGLTF.preload("./desktop_pc/scene.gltf");

export default ComputersCanvas;
