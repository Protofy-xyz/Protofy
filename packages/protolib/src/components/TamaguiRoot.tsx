import { TamaguiProvider } from '@my/ui'
import { staticConfig } from '@my/ui/tamagui.config'

const config = staticConfig()

export const TamaguiRoot = ({ children }: { children: React.ReactNode }) => {
  return (
    <TamaguiProvider config={config}>
      {children}
    </TamaguiProvider>
  )
}