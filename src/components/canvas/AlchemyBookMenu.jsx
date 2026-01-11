import React, { Suspense, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import {
  Environment,
  Html,
  OrbitControls,
  Preload,
  useCursor,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";
import CanvasLoader from "../Loader";

const PICK_MODE = false; // click on the book to print pivot-local coords for hotspots
const CAMERA_FIT = 0.8;
const CAMERA_DIR = new THREE.Vector3(0.12, 0.12, 1).normalize();
const ROT_ORDER = "YXZ";

/* ----------------------- Alchemical SVG Icons ----------------------- */
/** Mercury (☿) — cleaner so it reads well at small sizes */
function AlchemyMercuryIcon({ size = 34 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16c3-6 8-9 10-9s7 3 10 9" />
      <path d="M32 16v6" />
      <circle cx="32" cy="30" r="10" />
      <path d="M32 40v16" />
      <path d="M24 50h16" />
    </svg>
  );
}

/** Philosopher’s Stone — triangle + square + circle */
function AlchemyStoneIcon({ size = 34 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M32 10 54 50H10L32 10Z" />
      <rect x="20" y="24" width="24" height="24" />
      <circle cx="32" cy="36" r="8" />
    </svg>
  );
}

/* ----------------------------- Hotspot UI ----------------------------- */
function Hotspot({
  label,
  position,
  onClick,
  Icon, // React component (SVG or anything)

  size = 62,
  hoverSize = 74,

  // ✅ icon size only (inside)
  iconSize = 34,

  // ✅ NEW: multiplies the entire hotspot (rings + icon + hitbox)
  baseScale = 2,

  tooltipOffset = 12,

  iconColor = "rgba(74, 48, 28, 0.92)",

  shadowRest = "drop-shadow(0 12px 20px rgba(0,0,0,0.55))",
  shadowHover = "drop-shadow(0 24px 36px rgba(0,0,0,0.99))",
}) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const hoverScale = hoverSize / size;

  // constant geometry (no layout shift)
  const inset1 = Math.round(size * 0.13);
  const inset2 = Math.round(size * 0.26);

  return (
    <group position={position}>
      <Html center style={{ pointerEvents: "auto" }}>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          style={{
            position: "relative",
            width: size,
            height: size,
            borderRadius: 999,
            cursor: "pointer",

            background:
              "radial-gradient(circle at 50% 50%, rgba(207,216,255,0.22), rgba(207,216,255,0) 62%)",
            border: "1px solid rgba(207,216,255,0.50)",

            boxShadow: hovered
              ? "inset 0 0 10px rgba(255,255,255,0.10)"
              : "inset 0 0 8px rgba(255,255,255,0.08)",
            filter: hovered ? shadowHover : shadowRest,

            backdropFilter: "blur(2px)",
            display: "grid",
            placeItems: "center",
            userSelect: "none",

            // ✅ WHOLE HOTSPOT SCALE (2x) + hover zoom on top
            transform: `translateZ(0) scale(${baseScale * (hovered ? hoverScale : 1)})`,
            transformOrigin: "center center",
            transition: "transform 160ms ease, filter 160ms ease, box-shadow 160ms ease",
            willChange: "transform, filter",
            backfaceVisibility: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: inset1,
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.16)",
              opacity: hovered ? 0.9 : 0.7,
              transition: "opacity 160ms ease",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: inset2,
              borderRadius: 999,
              border: "1px solid rgba(207,216,255,0.22)",
              opacity: hovered ? 0.9 : 0.65,
              transition: "opacity 160ms ease",
            }}
          />

          <div
            style={{
              display: "grid",
              placeItems: "center",
              color: iconColor,
              transform: "translateY(-1px)",
            }}
          >
            {Icon ? <Icon size={iconSize} /> : null}
          </div>

          {hovered && (
            <div
              style={{
                position: "absolute",
                top: `calc(100% + ${tooltipOffset}px)`,
                left: "50%",
                transform: "translateX(-50%)",
                padding: "7px 12px",
                borderRadius: 999,
                fontSize: 11,
                letterSpacing: 1.6,
                textTransform: "uppercase",
                background: "rgba(10,12,20,0.58)",
                border: "1px solid rgba(255,255,255,0.16)",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}

/* ------------------------ Camera fit (stable) ------------------------ */
function fitCameraToObject(camera, controls, object3D, fit = 1.0) {
  const box = new THREE.Box3().setFromObject(object3D);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = THREE.MathUtils.degToRad(camera.fov);

  let distance = maxDim / (2 * Math.tan(fov / 2));
  distance *= fit;

  camera.near = Math.max(0.01, distance / 50);
  camera.far = distance * 200;
  camera.updateProjectionMatrix();

  camera.position.copy(center).add(CAMERA_DIR.clone().multiplyScalar(distance));
  camera.lookAt(center);

  if (controls?.current) {
    controls.current.target.copy(center);
    controls.current.update();
    controls.current.saveState();
  }
}

/* ------------------------------ Book Rig ------------------------------ */
function BookRig({ onSelect }) {
  const { scene } = useGLTF("/alchemy_book/scene.gltf");
  const book = useMemo(() => scene.clone(true), [scene]);

  const pivotRef = useRef();
  const bookRef = useRef();
  const controlsRef = useRef();

  const { camera, size } = useThree();

  const ROT_DEG = { x: 40, y: 15, z: 0 };
  const POS = [0, -0.1, -1];
  const SCALE = 1.0;

  const didCenterRef = useRef(false);

  useLayoutEffect(() => {
    if (!bookRef.current) return;
    if (didCenterRef.current) return;

    bookRef.current.position.set(0, 0, 0);
    bookRef.current.rotation.set(0, 0, 0);
    bookRef.current.scale.set(1, 1, 1);

    bookRef.current.updateWorldMatrix(true, true);

    const box = new THREE.Box3().setFromObject(bookRef.current);
    const center = box.getCenter(new THREE.Vector3());
    bookRef.current.position.sub(center);

    didCenterRef.current = true;
  }, [book]);

  useLayoutEffect(() => {
    if (!pivotRef.current || !bookRef.current) return;

    const rx = THREE.MathUtils.degToRad(ROT_DEG.x);
    const ry = THREE.MathUtils.degToRad(ROT_DEG.y);
    const rz = THREE.MathUtils.degToRad(ROT_DEG.z);

    pivotRef.current.rotation.set(rx, ry, rz, ROT_ORDER);
    pivotRef.current.position.set(POS[0], POS[1], POS[2]);
    pivotRef.current.scale.setScalar(SCALE);

    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
    fitCameraToObject(camera, controlsRef, pivotRef.current, CAMERA_FIT);
  }, [camera, size.width, size.height]);

  const handlePick = (e) => {
    if (!PICK_MODE) return;
    e.stopPropagation();
    const p = pivotRef.current.worldToLocal(e.point.clone());
    console.log("[HOTSPOT pivot-local]", `[${p.x.toFixed(3)}, ${p.y.toFixed(3)}, ${p.z.toFixed(3)}]`);
  };

  // breathing motion (safe & non-drifting)
  const basePosRef = useRef(new THREE.Vector3());
  const baseRotRef = useRef(new THREE.Euler());
  const baseReadyRef = useRef(false);

  useLayoutEffect(() => {
    if (!pivotRef.current) return;
    basePosRef.current.copy(pivotRef.current.position);
    baseRotRef.current.copy(pivotRef.current.rotation);
    baseReadyRef.current = true;
  }, [size.width, size.height]);

  useFrame(({ clock }) => {
    if (!pivotRef.current || !baseReadyRef.current) return;

    const t = clock.getElapsedTime();

    const bobAmp = 0.2;
    const bobSpeed = 1.05;
    const tiltAmp = 0.03;
    const tiltSpeed = 0.85;
    const yawAmp = 0.05;
    const yawSpeed = 0.6;

    const bob = bobAmp * Math.sin(t * bobSpeed);
    const tilt = tiltAmp * Math.sin(t * tiltSpeed);
    const yaw = yawAmp * Math.sin(t * yawSpeed);

    pivotRef.current.position.set(
      basePosRef.current.x,
      basePosRef.current.y + bob,
      basePosRef.current.z
    );

    pivotRef.current.rotation.set(
      baseRotRef.current.x + tilt,
      baseRotRef.current.y + yaw,
      baseRotRef.current.z,
      ROT_ORDER
    );
  });

  const CV_POS = [-0.95, 1.28, 0.16];
  const CONTACT_POS = [0, -1.28, 0.16];

  const CV_ICON = AlchemyMercuryIcon;
  const CONTACT_ICON = AlchemyStoneIcon;

  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight position={[3, 4, 2]} intensity={1.25} />
      <pointLight position={[-2, 1, 1]} intensity={0.6} />
      <Environment preset="city" />

      <OrbitControls ref={controlsRef} enableRotate={false} enableZoom={false} enablePan={false} />

      <group ref={pivotRef} onPointerDown={handlePick}>
        <primitive ref={bookRef} object={book} />

        <Hotspot
          label="CV"
          Icon={CV_ICON}
          position={CV_POS}
          size={66}
          hoverSize={78}
          iconSize={36}
          baseScale={1.3}  // ✅ DOUBLE
          iconColor="rgba(74, 48, 28, 0.92)"
          onClick={() => onSelect("cv")}
        />

        <Hotspot
          label="Contact"
          Icon={CONTACT_ICON}
          position={CONTACT_POS}
          size={66}
          hoverSize={78}
          iconSize={36}
          baseScale={1.3}  // ✅ DOUBLE
          iconColor="rgba(74, 48, 28, 0.92)"
          onClick={() => onSelect("contact")}
        />
      </group>
    </>
  );
}

/* ------------------------------ Canvas ------------------------------ */
export default function AlchemyBookMenu({ onSelect }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 40, near: 0.01, far: 5000, position: [0, 0.2, 2] }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <BookRig onSelect={onSelect} />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload("/alchemy_book/scene.gltf");
