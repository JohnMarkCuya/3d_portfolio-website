import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import CanvasLoader from "../Loader";

const Computers = ({ isMobile }) => {
  const { scene } = useGLTF("/desktop_pc/scene.gltf");

  useEffect(() => {
    if (!scene) return;

    scene.traverse((child) => {
      if (child.isMesh && child.geometry?.attributes?.position) {
        const arr = child.geometry.attributes.position.array;

        // Clean NaN or invalid positions
        for (let i = 0; i < arr.length; i++) {
          if (!Number.isFinite(arr[i])) arr[i] = 0;
        }

        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <mesh>
      <hemisphereLight intensity={0.45} groundColor="black" />
      <directionalLight
        position={[10, 15, 10]}
        intensity={2.2}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={1.8} position={[0, 5, 0]} />

      <primitive
        object={scene}
        scale={isMobile ? 0.6 : 0.75}
        position={isMobile ? [0, -2.2, -1.8] : [0, -3.25, -1.5]}
        rotation={[-0.02, -0.25, -0.03]}
      />
    </mesh>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    setIsMobile(mediaQuery.matches);

    const handleChange = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <Canvas
      shadows
      frameloop="demand"
      dpr={[1, 2]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{
        preserveDrawingBuffer: true,
        powerPreference: "high-performance",
        antialias: true,
        alpha: true, // ✅ transparent background
      }}
      style={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        touchAction: "none",
        background: "transparent", // ✅ keep your site’s theme visible
      }}
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
