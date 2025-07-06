import Particles from '@tsparticles/react'
import type { Container, ISourceOptions } from '@tsparticles/engine'
import { useAtomValue } from 'jotai'
import { particlesInitializedAtom } from './ParticlesEngineAtom'

type Props = {
  id?: string
  options: ISourceOptions
  onParticlesLoaded?: (container: Container | undefined) => void
}

export const ParticlesView = ({ id = 'tsparticles', options, onParticlesLoaded }: Props) => {
  const initialized = useAtomValue(particlesInitializedAtom)

  if (!initialized) return null

  return (
    <Particles
      id={id}
      options={options}
      particlesLoaded={onParticlesLoaded}
    />
  )
}