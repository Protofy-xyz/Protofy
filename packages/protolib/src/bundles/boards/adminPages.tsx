import { BookOpen, Plus, Trash2 } from '@tamagui/lucide-icons'
import { BoardModel } from './boardsSchemas'
import { API } from 'protobase'
import { DataTable2 } from "../../components/DataTable2"
import { DataView } from "../../components/DataView"
import { AdminPage } from "../../components/AdminPage"
import { PaginatedData, SSR } from "../../lib/SSR"
import { withSession } from "../../lib/Session"
import ErrorMessage from "../../components/ErrorMessage"
import { YStack, XStack, Paragraph, Popover, Button, AlertDialog, Dialog } from '@my/ui'
import { computeLayout } from '../autopilot/layout';
import { DashboardGrid } from '../../components/DashboardGrid';
import { CenterCard } from '../widgets'
import { useState } from 'react'

const sourceUrl = '/api/core/v1/boards'

const Board = ({ board }) => {
  let items = board.widgets || []
  items.push({ key: 'addwidget', type: 'addWidget', width: 1, height: 5 })
  const [addOpened, setAddOpened] = useState(false)

  const layouts = {
    lg: computeLayout(items, { totalCols: 12, normalW: 2, normalH: 6, doubleW: 6, doubleH: 12 }),
    md: computeLayout(items, { totalCols: 10, normalW: 5, normalH: 6, doubleW: 10, doubleH: 12 }),
    sm: computeLayout(items, { totalCols: 12, normalW: 12, normalH: 6, doubleW: 12, doubleH: 12 })
  }

  //fill items with react content
  items = items.map((item) => {
    if (item.type == 'addWidget') {
      return {
        ...item,
        content: <CenterCard title={""} id={item.key} containerProps={{ className: "no-drag", style: { cursor: "pointer" } }} onPress={() => {
          setAddOpened(true)
        }}>
          <YStack alignItems="center" justifyContent="center" f={1} width="100%" opacity={0.5}>
            <Plus size={50} />
            <Paragraph size="$5" fontWeight="400" mt="$1">Add</Paragraph>
          </YStack>
        </CenterCard>
      }
    }
    return item
  })
  return (
    <YStack flex={1}>

      <XStack px={"$5"} py={"$3"}>
        <Paragraph size="$5" fontWeight="400">{board.name}</Paragraph>
      </XStack>
      <Dialog modal open={addOpened} onOpenChange={setAddOpened}>
        <Dialog.Portal zIndex={999999999} overflow='hidden'>
          <Dialog.Overlay />
          <Dialog.Content
            bordered
            elevate
            animateOnly={['transform', 'opacity']}
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            gap="$4"
            maxWidth={600}
          >
            <Dialog.Title>Add widget</Dialog.Title>
            <Dialog.Description>
              {'Select the widget you want to add to the board'}
            </Dialog.Description>
            <YStack>
              content
            </YStack>
            <Dialog.Close displayWhenAdapted asChild>
              <Button theme='blue' onPress={() => {}}>
                Add
              </Button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog >
      <DashboardGrid items={items} layouts={layouts} borderRadius={10} padding={10} backgroundColor="white" />
    </YStack>
  )
}

export default {
  boards: {
    component: ({ workspace, pageState, initialItems, itemData, pageSession, extraData }: any) => {
      return (<AdminPage title="Boards" workspace={workspace} pageSession={pageSession}>
        <DataView
          entityName={"boards"}
          itemData={itemData}
          rowIcon={BookOpen}
          sourceUrl={sourceUrl}
          initialItems={initialItems}
          numColumnsForm={1}
          name="Board"
          onEdit={data => { console.log("DATA (onEdit): ", data); return data }}
          columns={DataTable2.columns(
            DataTable2.column("name", row => row.name, "name")
          )}
          model={BoardModel}
          pageState={pageState}
          dataTableGridProps={{ itemMinWidth: 300, spacing: 20 }}
        />
      </AdminPage>)
    },
    getServerSideProps: PaginatedData(sourceUrl, ['admin'])
  },
  view: {
    component: ({ workspace, pageState, initialItems, itemData, pageSession, extraData, board }: any) => {
      const { data } = board
      return (<AdminPage title="Board" workspace={workspace} pageSession={pageSession}>
        {board.status == 'error' && <ErrorMessage
          msg="Error loading board"
          details={board.error.result}
        />}
        {board.status == 'loaded' && <Board board={data} />}
      </AdminPage>)
    },
    getServerSideProps: SSR(async (context) => withSession(context, ['admin'], async () => {
      return {
        board: await API.get(`/api/core/v1/boards/${context.params.board}`)
      }
    }))
  }
}