import { useEffect } from 'react'
import { useSetAtom } from 'jotai'
import { initParticlesAtom } from 'protolib/components/particles/ParticlesEngineAtom'
import { ParticlesView } from 'protolib/components/particles/ParticlesView'
import { Page } from 'protolib/components/Page'
import { basicParticlesMask } from 'protolib/components/particles/particlesMasks/basicParticlesMask'
import { Protofy } from "protobase";

const Home = () => {
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

      <a
        href="/workspace"
        style={{
          textDecoration: 'none',
          color: 'inherit',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: '0.75rem',
          padding: '1rem',
          zIndex: 1,
          cursor: 'pointer',
        }}
      >
        <img
          src="/public/vento-logo.png"
          alt="Vento logo"
          style={{
            width: '460px',
            filter: 'drop-shadow(0 0 10px #f7b500) invert(1)',
            animation: 'float 6s ease-in-out infinite',
            marginBottom: '2.5rem',
          }}
        />
      </a>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </Page>
  )
}

export default {
  route: Protofy("route", "/"),
  component: (props) => <Home {...props} />
};
