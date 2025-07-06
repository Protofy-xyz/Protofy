// app/atoms/particlesEngineAtom.ts
import { atom } from 'jotai'
import { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

export const particlesInitializedAtom = atom(false)

export const initParticlesAtom = atom(
  null,
  async (get, set) => {
    if (get(particlesInitializedAtom)) return

    await initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    })

    set(particlesInitializedAtom, true)
  }
)
