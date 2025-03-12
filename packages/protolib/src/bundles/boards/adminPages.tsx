import React, { useState } from "react"
import { CircuitBoard, Tag, BookOpen, Eye, Text } from '@tamagui/lucide-icons'
import { BoardModel } from './boardsSchemas'
import { API, z, getPendingResult } from 'protobase'
import { usePendingEffect } from "../../lib/usePendingEffect"
import { Chip } from "../../components/Chip"
import { DataTable2 } from "../../components/DataTable2"
import { DataView } from "../../components/DataView"
import { AdminPage } from "../../components/AdminPage"
import { PaginatedData, SSR } from "../../lib/SSR"
import { useSearchParams, usePathname } from 'solito/navigation'
import { Input } from 'tamagui'
import { withSession } from "../../lib/Session"
import ErrorMessage from "../../components/ErrorMessage"
import { BigTitle } from "../../components/BigTitle"
import { YStack, XStack, Paragraph } from '@my/ui'

const sourceUrl = '/api/core/v1/boards'

const Board = ({ board }) => {
  return (
    <YStack>
      <XStack px={"$5"} py={"$3"}>
        <Paragraph size="$7">{board.name}</Paragraph>
      </XStack>
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