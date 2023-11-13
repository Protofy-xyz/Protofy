import * as React from 'react'
import { Popover, YStack } from 'tamagui'
import { HeaderLink } from 'protolib'
import { createSession } from 'protolib'
import { useSession } from 'protolib'
import { useRouter } from 'next/router'
export const HeaderMenuContent = React.memo(function HeaderMenuContent() {
  const [session, setSession, clearSession] = useSession()
  const logout = () => {
    clearSession()
  }
  return (
    <YStack miw={230} p="$3" ai="flex-end">
      {session.loggedIn ? <>
        <HeaderLink href="/profile">Profile</HeaderLink>
        {session.user?.type == 'admin' ? <HeaderLink href="/admin/files">Workspace</HeaderLink> : null}
        <HeaderLink onClick={logout} href={"/"}>Logout</HeaderLink>
      </> : <HeaderLink href="/auth/login">Login</HeaderLink>}
      {/* <Separator my="$4" w="100%" />

          <Separator my="$4" w="100%" /> */}
    </YStack>
  )
})
