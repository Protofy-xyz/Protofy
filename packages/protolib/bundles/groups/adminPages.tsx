
import { AdminPage, PaginatedDataSSR } from 'protolib/adminpanel/features/next'
import { GroupModel } from '.'
import { z } from 'protolib/base'
import { DataTable2, Chip, DataView } from 'protolib'
import { Users } from '@tamagui/lucide-icons';
import { API } from '../../lib/Api'
import { usePrompt } from '../../context/PromptAtom'
const GroupIcons = {}

export default {
  'admin/groups': {
    component: ({ pageState, sourceUrl, initialItems, pageSession, extraData }: any) => {
      usePrompt(() => `At this moment the user is browsing the group management page. The group management page allows to list, create, read, update and delete groups, groups contain privileges (admin true/false) and are associated to users when creating users, in the field 'type'.
      A group has a name, the privilege level (admin true/false), and a 0 or more workspaces associated. A workspace is a menu for the admin panel. If the user has more than one workspace, the admin panel will show a select list in the topbar to switch between workspaces.
      `+ (
          initialItems.isLoaded?'Currently the system returned the following information: '+JSON.stringify(initialItems.data) : ''
      )) 
      return (<AdminPage title="Groups" pageSession={pageSession}>
        <DataView
          integratedChat
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
            ])).generateOptions(() => extraData.workspaces.map(o => o)).after('name').display(),
          }}
          columns={DataTable2.columns(
            DataTable2.column("name", "name", true, undefined, true, '250px'),
            DataTable2.column("workspaces", "workspaces", false, (row) => Object.keys(row?.workspaces ?? []).length ? Object.keys(row.workspaces).map((k, i) => <Chip ml={i ? '$2' : '$0'} key={k} text={row.workspaces[k]} color={'$color5'} />) : <Chip text='empty' color={'$gray5'} />, true, '200px')
          )}
          model={GroupModel}
          pageState={pageState}
          icons={GroupIcons}
          dataTableCardProps={{ itemMinWidth: 300 }}
        />
      </AdminPage>)
    },
    getServerSideProps: PaginatedDataSSR('/adminapi/v1/groups', ['admin'], {}, async () => {
      const workspaces = await API.get('/adminapi/v1/workspaces')
      const workspacesArray = workspaces.data.items.map(obj => obj.name);
      return {
        workspaces: workspacesArray,
      }
    })
  }
}