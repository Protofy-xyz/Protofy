/*import { Canvas } from '@react-three/fiber'
import { useGLTF, Environment, OrbitControls } from '@react-three/drei'

function Model({ url, ...props }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} {...props} />
}

export default function GLTFViewer({ path }) {
  return (
    <Canvas camera={{ position: [0, 0, -1.5], fov: 40 }}>
      <ambientLight intensity={0.5} />
      <Model url={path} position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1} />
      <Environment preset="warehouse" />
      <OrbitControls />
    </Canvas>
  )
}*/
export default () => {
  return <div>The 3d Model Viewer is disabled, go to ModelViewer.tsx to enable it.</div>
}