import { useEffect, useState, startTransition, useMemo, useSyncExternalStore } from 'react'
import { Theme, ThemeName } from 'tamagui'

const familiesValues = {
  tamagui: ['gray', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'red']
}

type Family = keyof typeof familiesValues

const familiesNames = Object.keys(familiesValues) as any as Family[]

const families = familiesValues as {
  [key in Family]: ThemeName[]
}

type TintFamily = keyof typeof families

let fam: TintFamily = 'tamagui'

export function getTints() {
  return {
    name: fam || 'tamagui',
    tints: families[fam] || families.tamagui,
    families,
  }
}

export function useTints() {
  const [val, setVal] = useState(getTints())

  useEffect(() => {
    return onTintFamilyChange(() => {
      setVal(getTints())
    })
  }, [])

  return val
}

export const setTintFamily = (next: TintFamily) => {
  if (!families[next]) throw `impossible`
  fam = next
  listeners.forEach((l) => l(next))
}

export const setNextTintFamily = () => {
  setTintFamily(familiesNames[(familiesNames.indexOf(fam) + 1) % familiesNames.length])
}

type ChangeHandler = (next: TintFamily) => void

const listeners = new Set<ChangeHandler>()

export const onTintFamilyChange = (cb: ChangeHandler) => {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

//____

// TODO useSyncExternalStore

// no localstorage because its not important to remember and causes a flicker
// const tintVal = typeof localStorage !== 'undefined' ? localStorage.getItem('tint') : 0
// const tint = tintVal ? +tintVal 0
export const initialTint = 3

let current = initialTint

const listeners_ = new Set<Function>()

export const onTintChange = (listener: (cur: number) => void) => {
  listeners_.add(listener)
  return () => {
    listeners_.delete(listener)
  }
}

const numTints = getTints().tints.length

export const setTintIndex = (next: number) => {
  const val = next % numTints
  if (val === current) return
  current = val
  startTransition(() => {
    listeners_.forEach((x) => x(val))
  })
}

export const useTint = () => {
  const index = useSyncExternalStore(
    onTintChange,
    () => current,
    () => initialTint
  )
  const tintsContext = useTints()
  const { tints } = tintsContext

  return {
    ...tintsContext,
    tints: tintsContext.tints as ThemeName[],
    tintIndex: index,
    tint: tints[index] as ThemeName,
    setTintIndex,
    setNextTintFamily,
    setNextTint: () => {
      setTintIndex(index + 1)
    },
  } as const
}

export const ThemeTint = (props: { children: any; disable?: boolean }) => {
  const curTint = useTint().tint

  return (
    <Theme name={props.disable ? null : curTint}>
      {props.children}
    </Theme>
  )
}

export const ThemeTintAlt = ({
  children,
  disable,
  offset = 2,
}: {
  children: any
  disable?: boolean
  offset?: number
}) => {
  const tint = useTint()
  const curTint = tint.tints[(tint.tintIndex + offset) % tint.tints.length]

  return (
    <Theme name={disable ? null : curTint}>
      {children}
    </Theme>
  )
}

