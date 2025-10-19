import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import { useInView } from "react-intersection-observer";
import CanvasLoader from "../Loader";

const Earth = () => {
  const earth = useGLTF("./planet/scene.gltf");
  return <primitive object={earth.scene} scale={2.5} position-y={0} rotation-y={0} />;
};

const EarthCanvas = () => {
  const [isMobile, setIsMobile] = useState(null);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  // ✅ detect if user is on mobile
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    const update = () => setIsMobile(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  if (isMobile === null) return null;

  const canvasElement = (
    <Canvas
      shadows
      frameloop="demand"
      dpr={[1, isMobile ? 1.3 : 2]}
      gl={{
        preserveDrawingBuffer: !isMobile,
        antialias: true,
        powerPreference: isMobile ? "high-performance" : "default",
      }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-4, 3, 6],
      }}
      style={{
        width: "100%",
        height: "100%",
        touchAction: "none",
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          autoRotate
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <Earth />
        <Preload all />
      </Suspense>
    </Canvas>
  );

  // ✅ Desktop: always render
  // ✅ Mobile: render only when visible
  return (
    <div ref={isMobile ? ref : null} style={{ width: "100%", height: "100%" }}>
      {isMobile ? (
        inView ? (
          canvasElement
        ) : (
          <div className="w-full h-[400px] bg-neutral-800 animate-pulse rounded-xl"></div>
        )
      ) : (
        canvasElement
      )}
    </div>
  );
};

export default EarthCanvas;
