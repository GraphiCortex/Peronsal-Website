import React, { Suspense, useEffect, useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Center,
  OrbitControls,
  Preload,
  useGLTF,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

import CanvasLoader from "../Loader";

const SCALE_FACTOR = 1;

const Computers = ({ isMobile }) => {
  const computer = useGLTF("./brain/scene.gltf");

  const baseScale = isMobile ? 0.7 : 0.75;
  const finalScale = baseScale * SCALE_FACTOR;

  const xOffset = isMobile ? 2.0 : -0.2;
  const yOffset = isMobile ? 5.0 : -0.1;
  const zOffset = 0;

  // 🔥 Add emissive glow to all mesh materials
  useMemo(() => {
    computer.scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone();
        child.material.emissive = new THREE.Color("#7c7cff"); // soft violet-blue
        child.material.emissiveIntensity = 0.35;              // subtle glow
        child.material.transparent = true;
        child.material.opacity = 0.9;
      }
    });
  }, [computer]);

  return (
    <mesh>
      <hemisphereLight intensity={0.6} groundColor="black" />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.14}
        penumbra={1}
        intensity={0.9}
        castShadow
      />
      <pointLight intensity={25} />

      <Center position={[xOffset, yOffset, zOffset]}>
        <primitive
          object={computer.scene}
          scale={finalScale}
          rotation={[-0.01, -0.2, -0.6]}
        />
      </Center>
    </mesh>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      frameloop="on demand"
      shadows
      dpr={[1, 2]}
      camera={{ position: [20, 3, 5], fov: 18 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />

        <Computers isMobile={isMobile} />

        {/*Soft bloom for scientific glow */}
        <EffectComposer>
          <Bloom
            intensity={0.6}       // glow strength
            luminanceThreshold={0.25}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
        </EffectComposer>
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;
