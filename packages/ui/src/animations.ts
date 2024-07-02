import { createAnimations } from '@tamagui/animations-moti';

export const animations: any = createAnimations({
  bouncy: {
    type: 'spring',
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  } as any,
  lazy: {
    type: 'spring',
    damping: 20,
    stiffness: 60,
  } as any,
  quick: {
    type: 'spring',
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  } as any
})
