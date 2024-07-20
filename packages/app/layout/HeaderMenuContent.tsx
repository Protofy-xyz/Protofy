import * as React from 'react'
import { YStack } from 'tamagui'
import { Tinted } from 'protolib/dist/components/Tinted'
import { HeaderLink } from 'protolib/dist/components/HeaderLink'
import { useSession, useUserSettings, useSessionContext, useWorkspaces } from 'protolib/dist/lib/Session'
import menuOptions from '../bundles/menu'
import workspaces from '../bundles/workspaces'

export const HeaderMenuContent = React.memo(function HeaderMenuContent() {
  const [session, setSession] = useSession()
  const [sessionContext, setSessionContext] = useSessionContext()
  const userSpaces = useWorkspaces()
  const [settings] = useUserSettings()
  const currentWorkspace = settings && settings.workspace ? settings.workspace : userSpaces[0]
  //@ts-ignore
  const workspace = typeof workspaces[currentWorkspace] === 'function' ? workspaces[currentWorkspace]({ pages: [] }) : workspaces[currentWorkspace]


  // console.log('workspace:', workspace)
  const currentMenuOptions = menuOptions.filter((menu, i) => !menu['visibility'] || menu['visibility'](session, workspace))

  return (
    <YStack minWidth={230} padding="$3" alignItems="flex-end">
      <Tinted>
        {currentMenuOptions.map((menu, i) => {
          return <HeaderLink key={i} native={true} {...(menu['id'] ? { id: menu['id'] } : {})} onClick={() => menu['onClick'] && menu['onClick'](setSession, setSessionContext)} href={typeof menu['path'] == 'function' ? menu['path'](workspace, session) : menu['path']}>
            {typeof menu['label'] == 'function' ? menu['label'](workspace, session) : menu['label']}
          </HeaderLink>
        })
        }
      </Tinted>
    </YStack>
  )
})
