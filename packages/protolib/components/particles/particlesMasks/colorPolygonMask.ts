import type { ISourceOptions } from '@tsparticles/engine'

export const colorPolygonMask: ISourceOptions = {
  fullScreen: {
    enable: true,
    zIndex: 0,
  },
  background: {
    color: { value: '#000000' },
  },
  detectRetina: true,
  fpsLimit: 60,
  interactivity: {
    detectsOn: 'canvas',
    events: {
      onHover: {
        enable: true,
        mode: 'bubble',
      },
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
  particles: {
    number: {
      value: 1000,
      density: {
        enable: false,
      },
    },
    color: {
      value: ['#4285f4', '#34A853', '#FBBC05', '#EA4335'],
    },
    shape: {
      type: 'circle',
    },
    size: {
      value: 1,
    },
    opacity: {
      value: { min: 0.05, max: 0.4 },
      animation: {
        enable: true,
        speed: 2,
        startValue: 'random',
        destroy: 'none',
      },
    },
    move: {
      enable: true,
      speed: 1,
      direction: 'none',
      outModes: {
        default: 'bounce',
      },
    },
    links: {
      enable: true,
      distance: 40,
      color: 'random',
      opacity: 1,
      width: 1,
    },
  },
  polygon: {
    enable: true,
    type: 'inline', // <– cambia aquí
    inline: {
      arrangement: 'equidistant',
    },
    move: {
      type: 'path',
      radius: 10,
    },
    draw: {
      enable: true,
      stroke: {
        color: {
          value: '#ffffff',
        },
        width: 0.5,
        opacity: 0.2,
      },
    },
  },
}
