
import { AdminPage, PaginatedDataSSR } from 'protolib/adminpanel/features/next'
import { GroupModel } from '.'
import { z } from 'zod'
import { DataTable2, Chip, DataView } from 'protolib'
import moment from 'moment'
import { Mail, Tag, Key, User, Users } from '@tamagui/lucide-icons';
import { API } from '../../lib/Api'
const GroupIcons = {}

export default {
  'admin/groups': {
    component: ({ pageState, sourceUrl, initialItems, pageSession, extraData }: any) => {
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