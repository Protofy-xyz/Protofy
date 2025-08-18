//@card/reactframe
import { Canvas, useFrame } from "https://esm.sh/@react-three/fiber@8.12.1?alias=react:react@18.2.0,react-dom:react-dom@18.2.0";
import * as THREE from "https://esm.sh/three@0.150.1";

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#888" roughness={1} metalness={0} />
    </mesh>
  );
}

function Board() {
  // Tablero de madera simple
  return (
    <group>
      <mesh position={[0, -0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.4, 0.1, 3.4]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.8} metalness={0.05} />
      </mesh>
      {/* Rejilla */}
      <gridHelper args={[3, 3, 0x222222, 0x222222]} position={[0, 0.01, 0]} />
    </group>
  );
}

function PieceX({ position = [0, 0, 0], size = 0.7 }) {
  const ref = React.useRef();
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += 0.15 * dt;
  });
  const bar = [size, 0.12, 0.12];
  return (
    <group ref={ref} position={position} castShadow>
      <mesh castShadow>
        <boxGeometry args={bar} />
        <meshStandardMaterial color="#ff6b00" roughness={0.35} metalness={0.2} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <boxGeometry args={bar} />
        <meshStandardMaterial color="#ff6b00" roughness={0.35} metalness={0.2} />
      </mesh>
      <group rotation={[0, 0, Math.PI / 4]}>
        <mesh castShadow>
          <boxGeometry args={bar} />
          <meshStandardMaterial color="#ff6b00" roughness={0.35} metalness={0.2} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <boxGeometry args={bar} />
          <meshStandardMaterial color="#ff6b00" roughness={0.35} metalness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

function PieceO({ position = [0, 0, 0], radius = 0.28 }) {
  const ref = React.useRef();
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y -= 0.1 * dt;
  });
  return (
    <mesh ref={ref} position={position} castShadow>
      <torusGeometry args={[radius, 0.08, 16, 64]} />
      <meshStandardMaterial color="#2aa8ff" roughness={0.25} metalness={0.25} />
    </mesh>
  );
}

function PiecesFromArray({ game }) {
  const cell = 1.0;
  const y = 0.4;

  return (
    <group>
      {game.map((row, r) =>
        row.map((v, c) => {
          const pos = [(c - 1) * cell, y, (1 - r) * cell];
          const key = ("x-" + r + "-" + c)
          if (v === "x" || v === "X") return <PieceX key={key} position={pos} />;
          if (v === "o" || v === "O") return <PieceO key={key} position={pos} />;
          return null;
        })
      )}
    </group>
  );
}

function Scene({ game }) {
  return (
    <>
      {/* Luces */}
      <ambientLight intensity={0.25} />
      <directionalLight
        position={[3, 5, 2]}
        intensity={1.15}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
      />

      <Board />
      <PiecesFromArray game={game} />
      <Ground />
    </>
  );
}

function Widget({ state }) {
  const defaultGame = [
    ["-", "-", "-"],
    ["-", "-", "-"],
    ["-", "-", "-"]
  ];

  const game = Array.isArray(state?.game) ? state.game : defaultGame;

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas shadows camera={{ position: [3, 3, 4.5], fov: 50 }}>
        <Scene game={game} />
      </Canvas>
    </div>
  );
}