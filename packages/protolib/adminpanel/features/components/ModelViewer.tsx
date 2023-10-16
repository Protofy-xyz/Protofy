import { Canvas } from '@react-three/fiber'
import { useGLTF, Environment, OrbitControls } from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

function Model(props) {
    const gltf = useLoader(GLTFLoader, props.url)
    return <primitive object={gltf.scene} {...props} />
}

export default function GLTFViewer({path}) {
  return (
    <Canvas camera={{ position: [0, 0, -1.5], fov: 40 }}>
      <ambientLight intensity={0.5} />
      <Model url={path} position={[0,0,0]} rotation={[0, 0, 0]} scale={1} />
      <Environment preset="warehouse" />
      <OrbitControls />
    </Canvas>
  )
}
