import { useEffect } from 'react'
import { useSetAtom } from 'jotai'
import { initParticlesAtom } from 'protolib/components/particles/ParticlesEngineAtom'
import { ParticlesView } from 'protolib/components/particles/ParticlesView'
import { Page } from 'protolib/components/Page'
import { basicParticlesMask } from 'protolib/components/particles/particlesMasks/basicParticlesMask'

export default function Home() {
  const initParticles = useSetAtom(initParticlesAtom)

  useEffect(() => {
    initParticles()
  }, [initParticles])

  return (
    <Page
      style={{
        height: '100vh',
        margin: 0,
        padding: 0,
        fontFamily: "'Inter', sans-serif",
        color: '#fff8e1',
        fontSize: '10px',
        background: 'radial-gradient(circle at bottom, #0d0a00 0%, #211600 100%)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <ParticlesView options={basicParticlesMask()} />
      
    </Page>
  )
}