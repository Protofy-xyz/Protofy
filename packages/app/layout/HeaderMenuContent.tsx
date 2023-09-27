import * as React from 'react'
import { Popover, YStack } from 'tamagui'
import { HeaderLink } from 'protolib'
import { useAtom } from 'jotai'
import { Session, createSession } from 'protolib'

export const HeaderMenuContent = React.memo(function HeaderMenuContent() {
  const [session, setSession] = useAtom(Session)
  return (
        <YStack miw={230} p="$3" ai="flex-end">
          {session.loggedIn?<>
            <HeaderLink href="/profile">Profile</HeaderLink>
            {session.user?.type == 'admin' ? <HeaderLink href="/admin">Control Panel</HeaderLink>:null} 
            <HeaderLink onClick={() => setSession(createSession())} href="">Logout</HeaderLink>
          </>:<HeaderLink href="/auth/login">Login</HeaderLink>}
          {/* <Separator my="$4" w="100%" />

          <Separator my="$4" w="100%" /> */}
        </YStack>
  )
})
