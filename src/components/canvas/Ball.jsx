import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Decal,
  Float,
  OrbitControls,
  Preload,
  useTexture,
} from "@react-three/drei";
import CanvasLoader from "../Loader";

const Ball = ({ imgUrl, isMobile }) => {
  const [decal] = useTexture([imgUrl]);

  return (
    <Float
      speed={isMobile ? 1.2 : 1.75}
      rotationIntensity={isMobile ? 0.7 : 1}
      floatIntensity={isMobile ? 1.3 : 2}
    >
      {/* ✅ Safe lighting for both mobile and desktop */}
      <ambientLight intensity={isMobile ? 0.2 : 0.25} />
      <directionalLight position={[0, 0, 0.05]} intensity={isMobile ? 0.9 : 1} />

      <mesh
        castShadow={!isMobile}
        receiveShadow={!isMobile}
        scale={2.75}
        dispose={null}
      >
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#fff8eb"
          polygonOffset
          polygonOffsetFactor={-5}
          flatShading
          roughness={isMobile ? 0.8 : 0.6}
          metalness={isMobile ? 0 : 0.3}
        />
        <Decal
          position={[0, 0, 1]}
          rotation={[2 * Math.PI, 0, 6.25]}
          scale={1}
          map={decal}
          flatShading
        />
      </mesh>
    </Float>
  );
};

const BallCanvas = ({ icon }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    const update = () => setIsMobile(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.5]}
      gl={{
        preserveDrawingBuffer: true,
        powerPreference: isMobile ? "low-power" : "high-performance",
      }}
      style={{ touchAction: "none" }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls enableZoom={false} />
        <Ball imgUrl={icon} isMobile={isMobile} />
        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default BallCanvas;
