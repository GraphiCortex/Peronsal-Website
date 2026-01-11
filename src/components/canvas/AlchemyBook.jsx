import React, { useMemo } from "react";
import { useGLTF, Environment } from "@react-three/drei";

export default function AlchemyBook({
  scale = 1.15,
  position = [0.15, -0.08, 0],
  rotation = [0, -0.35, 0],
}) {
  const { scene } = useGLTF("/alchemy_book/scene.gltf");

  const cloned = useMemo(() => scene.clone(true), [scene]);

  return (
    <>
      {/* Lighting tuned for “readable page” vibes */}
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 2]} intensity={1.25} />
      <pointLight position={[-2, 1, 1]} intensity={0.6} />

      <primitive object={cloned} scale={scale} position={position} rotation={rotation} />

      <Environment preset="city" />
    </>
  );
}

useGLTF.preload("/alchemy_book/scene.gltf");
