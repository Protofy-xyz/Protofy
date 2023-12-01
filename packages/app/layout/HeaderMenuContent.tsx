import * as React from 'react'
import { Popover, YStack } from 'tamagui'
import { HeaderLink, Tinted } from 'protolib'
import { createSession } from 'protolib'
import { useSession, clearSession, useUserSettings, useSessionContext, useWorkspaces } from 'protolib'
import { useRouter } from 'next/router'
import workspaces from '../bundles/workspaces'

export const HeaderMenuContent = React.memo(function HeaderMenuContent() {
  const [session, setSession] = useSession()
  const [sessionContext, setSessionContext] = useSessionContext()
  const userSpaces = useWorkspaces()
  const logout = () => {
    clearSession(setSession, setSessionContext)
  }

  const [settings] = useUserSettings()
  const currentWorkspace = settings && settings.workspace? settings.workspace : userSpaces[0]
  //@ts-ignore
  const workspace = workspaces[currentWorkspace]

  return (
    <YStack miw={230} p="$3" ai="flex-end">
      <Tinted>
        {session.loggedIn ? <>
          <HeaderLink href="/profile">Profile</HeaderLink>
          {workspace && workspace.default ?<HeaderLink href={workspace.default}>{workspace.label}</HeaderLink>:null}
          <HeaderLink onClick={logout} href={"/"}>Logout</HeaderLink>
        </> : <HeaderLink href="/auth/login">Login</HeaderLink>}
        {/* <Separator my="$4" w="100%" />

            <Separator my="$4" w="100%" /> */}
      </Tinted>

    </YStack>
  )
})
