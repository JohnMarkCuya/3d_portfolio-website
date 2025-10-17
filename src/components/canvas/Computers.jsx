import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import CanvasLoader from "../Loader";

const Computers = ({ isMobile }) => {
  const computer = useGLTF("./desktop_pc/scene.gltf");

  return (
    <group>
      {/* ✅ Lighting changes depending on device */}
      {isMobile ? (
        <>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <spotLight
            position={[-10, 15, 10]}
            angle={0.3}
            penumbra={0.8}
            intensity={1.2}
            castShadow={false}
          />
          <pointLight position={[0, 10, 0]} intensity={0.8} />
        </>
      ) : (
        <>
          <hemisphereLight intensity={0.5} groundColor="black" />
          <spotLight
            position={[-20, 50, 10]}
            angle={0.12}
            penumbra={1}
            intensity={9000}
            castShadow
            shadow-mapSize={2048}
          />
          <pointLight intensity={2.5} />
        </>
      )}

      {/* ✅ Safe model render */}
      {computer.scene && (
        <primitive
          object={computer.scene}
          scale={isMobile ? 0.6 : 0.75}
          position={isMobile ? [0, -2.9, -2] : [0, -3.25, -1.5]}
          rotation={[-0.01, -0.2, -0.05]}
        />
      )}
    </group>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    const update = () => setIsMobile(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  if (isMobile === null) return null;

  return (
    <Canvas
      shadows={!isMobile}
      frameloop="demand"
      dpr={isMobile ? [1, 1.3] : [1, 2]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: !isMobile,
        powerPreference: isMobile ? "low-power" : "high-performance",
      }}
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        touchAction: "none",
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Computers isMobile={isMobile} />
        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default ComputersCanvas;
