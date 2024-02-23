import * as React from 'react'
import { Popover, YStack } from 'tamagui'
import { HeaderLink, Tinted } from 'protolib'
import { createSession } from 'protolib'
import { useSession, clearSession, useUserSettings, useSessionContext, useWorkspaces } from 'protolib'
import { useRouter } from 'next/router'
import menuOptions from '../bundles/menu'
import workspaces from '../bundles/workspaces'

export const HeaderMenuContent = React.memo(function HeaderMenuContent() {
  const [session, setSession] = useSession()
  const [sessionContext, setSessionContext] = useSessionContext()
  const userSpaces = useWorkspaces()
  const [settings] = useUserSettings()
  const currentWorkspace = settings && settings.workspace ? settings.workspace : userSpaces[0]
  //@ts-ignore
  const workspace = workspaces[currentWorkspace]

  console.log('workspace:', workspace)
  return (
    <YStack miw={230} p="$3" ai="flex-end">
      <Tinted>
        {menuOptions.filter((menu, i) => !menu['visibility'] || menu['visibility'](session, workspace)).map((menu, i) => {
          return <HeaderLink {...(menu['id']?{id:menu['id']}:{})} onClick={() => menu['onClick'] && menu['onClick'](setSession, setSessionContext)} href={typeof menu['path'] == 'function' ? menu['path'](workspace, session) : menu['path']}>
            {typeof menu['label'] == 'function' ? menu['label'](workspace, session) : menu['label']}
          </HeaderLink>
        })
        }
      </Tinted>
    </YStack>
  )
})
