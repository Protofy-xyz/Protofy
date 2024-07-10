import { GroupModel } from '.'
import { z } from 'protobase'
import { DataView } from '../../components/DataView'
import { AdminPage } from '../../components/AdminPage'
import { Users } from '@tamagui/lucide-icons';
import { API } from 'protobase'
import { usePrompt } from '../../context/PromptAtom'
import { useState } from 'react';
import { getPendingResult } from 'protobase';
import { usePendingEffect } from '../../lib/usePendingEffect';
import { PaginatedData } from '../../lib/SSR';

const GroupIcons = {}
const sourceUrl = '/adminapi/v1/groups'
const workspacesSourceUrl = '/adminapi/v1/workspaces'

export default {
  'groups': {
    component: ({ pageState, initialItems, pageSession, extraData }: any) => {
      usePrompt(() => `At this moment the user is browsing the group management page. The group management page allows to list, create, read, update and delete groups, groups contain privileges (admin true/false) and are associated to users when creating users, in the field 'type'.
      A group has a name, the privilege level (admin true/false), and a 0 or more workspaces associated. A workspace is a menu for the admin panel. If the user has more than one workspace, the admin panel will show a select list in the topbar to switch between workspaces.
      `+ (
          initialItems?.isLoaded ? 'Currently the system returned the following information: ' + JSON.stringify(initialItems.data) : ''
        ))

      const [workspaces, setWorkspaces] = useState(extraData?.workspaces ?? getPendingResult('pending'))
      usePendingEffect((s) => { API.get(workspacesSourceUrl, s) }, setWorkspaces, extraData?.workspaces)

      return (<AdminPage title="Groups" pageSession={pageSession}>
        <DataView
          enableAddToInitialData
          disableViewSelector
          defaultView={'list'}
          rowIcon={Users}
          sourceUrl={sourceUrl}
          initialItems={initialItems}
          numColumnsForm={1}
          name="group"
          extraFieldsForms={{
            workspaces: z.array(z.union([
              z.literal(""),
              z.literal("")
            ])).generateOptions(() => workspaces.data?.items.map(obj => obj.name)).after('name'),
          }}
          // columns={DataTable2.columns(
          //   DataTable2.column("name", row => row.name, "name", undefined, true, '250px'),
          //   DataTable2.column("workspaces", row => row.workspaces, false, (row) =>
          //     row?.workspaces?.length
          //       ? row.workspaces.map((workspace, i) =>
          //         <Chip ml={i ? '$2' : '$0'} key={i} text={workspace} color={'$color5'} />)
          //       : "",
          //     true, '200px')
          // )}
          model={GroupModel}
          pageState={pageState}
          icons={GroupIcons}
          //@ts-ignore
          dataTableCardProps={{ itemMinWidth: 300 }}
        />
      </AdminPage>)
    },
    getServerSideProps: PaginatedData(sourceUrl, ['admin'], {workspaces: workspacesSourceUrl})
  }
}