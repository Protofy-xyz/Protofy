//@card/reactframe
import { Canvas, useFrame } from "https://esm.sh/@react-three/fiber@8.12.1?alias=react:react@18.2.0,react-dom:react-dom@18.2.0";
import * as THREE from "https://esm.sh/three@0.150.1";

function SpinningBox({ size }) {
  const ref = React.useRef();
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.x += 0.6 * dt;
      ref.current.rotation.y += 0.8 * dt;
    }
  });

  return (
    <mesh ref={ref} castShadow>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial color="orange" roughness={0.4} metalness={0.1} />
    </mesh>
  );
}

function Ground() {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.55, 0]}
      receiveShadow
    >
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#888" roughness={1} metalness={0} />
    </mesh>
  );
}

function Widget({ state }) {
  const size = state?.num ?? 1;
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas shadows camera={{ position: [3, 2, 4], fov: 50 }}>
        {/* Luz de relleno suave */}
        <ambientLight intensity={0.2} />

        {/* Luz principal con sombras */}
        <directionalLight
          position={[3, 5, 2]}
          intensity={1.1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.5}
          shadow-camera-far={20}
        />

        <SpinningBox size={size} />
        <Ground />
      </Canvas>
    </div>
  );
}