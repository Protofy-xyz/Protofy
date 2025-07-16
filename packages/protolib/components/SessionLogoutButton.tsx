import { Button, ButtonProps, Text, Stack, TooltipSimple, YStack } from '@my/ui'
import React from 'react'
import { LogOut } from '@tamagui/lucide-icons'
import { Popover } from './Popover'
import { Tinted } from './Tinted'
import { clearSession } from '../lib/Session'
import { useSession, useSessionContext } from '../lib/useSession'

export const SessionLogoutButton = React.forwardRef((props: ButtonProps, ref: any) => {

  const [session, setSession] = useSession()
  const [sessionContext, setSessionContext] = useSessionContext()

  const onLogout = () => {
    clearSession(setSession, setSessionContext)
  }

  return (
    <Stack ref={ref}>
      <Tinted tint="red">
        <TooltipSimple groupId="header-actions-logout" label="Logout">
          <Popover
            menuPlacement="top"
            trigger={
              <Button
                size="$3"
                hoverStyle={{ bc: '$red4' }}
                {...props}
                aria-label="Session Logout"
                icon={LogOut}
                scaleIcon={1.4}
                color="$gray9"
              >
                {/* {theme === 'light' ? <Moon size={12} /> : <SunIcon />} */}
              </Button>
            }
          >
            <YStack p="$4" gap="$4" ai="center">
              <Text>
                Are you sure you want to logout?
              </Text>
              <Button w="100%" iconAfter={LogOut} onPress={onLogout}>
                Yes, Logout
              </Button>
            </YStack>
          </Popover>
        </TooltipSimple>
      </Tinted>
    </Stack >
  )
})
