const { Canvas } = require('@react-three/fiber');
const { useGLTF, Environment, OrbitControls } = require('@react-three/drei');
const { useLoader } = require('@react-three/fiber');
const { useEffect, useState } = require('react');

function Model(props) {
  const [GLTFLoader, setGLTFLoader] = useState(null);

  useEffect(() => {
    import('three/examples/jsm/loaders/GLTFLoader').then((module) => {
      setGLTFLoader(() => module.GLTFLoader);
    });
  }, []);

  const gltf = useLoader(GLTFLoader, props.url);

  //@ts-ignore
  return GLTFLoader ? <primitive object={gltf.scene} {...props} /> : null;
}

export default function GLTFViewer({ path }) {
  return (
    <Canvas camera={{ position: [0, 0, -1.5], fov: 40 }}>
      {/*@ts-ignore*/}
      <ambientLight intensity={0.5} />
      <Model url={path} position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1} />
      <Environment preset="warehouse" />
      <OrbitControls />
    </Canvas>
  );
}