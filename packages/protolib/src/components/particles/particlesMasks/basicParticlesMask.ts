// protolib/components/particles/particlesMasks/svgMask.ts
import type { ISourceOptions } from '@tsparticles/engine'

export const basicParticlesMask: ISourceOptions = {
  fullScreen: {
    enable: true,
    zIndex: 0,
  },
  background: {
    color: {
      value: 'radial-gradient(circle at bottom, #0d0a00 0%, #211600 100%)',
    },
  },
  detectRetina: true,
  fpsLimit: 60,
  particles: {
    number: { value: 35, density: { enable: true, area: 800 } },
    color: { value: ['#f7b500', '#ffdc69'] },
    links: {
      enable: false,
      distance: 140,
      color: '#ffffff',
      opacity: 0.08,
      width: 0.6,
    },
    move: {
      enable: true,
      speed: 0.8,
      outModes: { default: 'bounce' },
    },
    size: { value: { min: 1, max: 3 } },
    opacity: { value: 0.45 },
  },
  interactivity: {
    detectsOn: 'canvas',
    events: {
      onHover: { enable: true, mode: 'bubble' },
      resize: true,
    },
    modes: {
      bubble: {
        distance: 40,
        duration: 2,
        opacity: 8,
        size: 6,
      },
    },
  },
}
