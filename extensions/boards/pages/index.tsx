import React from 'react'
import { BoardModel } from '../boardsSchemas'
import { API } from 'protobase'
import { DataTable2 } from "protolib/components/DataTable2"
import { DataView } from "protolib/components/DataView"
import { AdminPage } from "protolib/components/AdminPage"
import { PaginatedData, SSR } from "protolib/lib/SSR"
import { withSession } from "protolib/lib/Session"
import { useRouter } from 'solito/navigation';
import BoardPreview from 'protolib/components/board/BoardPreview'
import { createParam } from 'solito'
import { AsyncView } from 'protolib/components/AsyncView'
import { BoardView } from './view'

const { useParams } = createParam()

const sourceUrl = '/api/core/v1/boards'

export default {
  boards: {
    component: ({ workspace, pageState, initialItems, itemData, pageSession, extraData }: any) => {
      const router = useRouter()

      return (<AdminPage title="Boards" workspace={workspace} pageSession={pageSession}>
        <DataView
          entityName={"boards"}
          itemData={itemData}
          sourceUrl={sourceUrl}
          initialItems={initialItems}
          numColumnsForm={1}
          onAdd={(data) => { router.push(`/boards/view?board=${data.name}`); return data }}
          name="Board"
          disableViews={['raw']}
          onEdit={data => { console.log("DATA (onEdit): ", data); return data }}
          onSelectItem={(item) => router.push(`/boards/view?board=${item.data.name}`)}
          columns={DataTable2.columns(
            DataTable2.column("name", row => row.name, "name")
          )}

          model={BoardModel}
          pageState={pageState}
          dataTableGridProps={{
            getCard: (element, width) => <BoardPreview
              onDelete={async () => {
                await API.get(`${sourceUrl}/${element.name}/delete`);
              }}
              onPress={(e) => {
                const dialogContent = e.target.className.includes('DialogEditDisplayName')
                if (dialogContent) return
                router.push(`/boards/view?board=${element.name}`)
              }}
              element={element} width={width} />,
          }}
          defaultView={"grid"}
        />
      </AdminPage>)
    },
    getServerSideProps: PaginatedData(sourceUrl, ['admin'])
  },
  view: {
    component: (props: any) => {
      const { params } = useParams()

      return <AsyncView ready={params.board ? true : false}>
        <BoardView key={params.board} {...props} board={undefined} />
      </AsyncView>
    },
    getServerSideProps: SSR(async (context) => withSession(context, ['admin'], async (session) => {
      return {
        board: await API.get(`/api/core/v1/boards/${context.params.board}/?token=${session?.token}`),
        icons: (await API.get(`/api/core/v1/icons?token=${session?.token}`))?.data?.icons ?? []
      }
    }))
  }
}