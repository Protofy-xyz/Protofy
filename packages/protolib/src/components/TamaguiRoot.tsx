import { TamaguiProvider } from 'tamagui'
import { staticConfig } from '@my/ui/tamagui.config'

export const TamaguiRoot = ({ children }: { children: React.ReactNode }) => {
  return (
    <TamaguiProvider config={staticConfig}>
      {children}
    </TamaguiProvider>
  )
}