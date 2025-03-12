import React, { useState } from "react"
import { CircuitBoard, Tag, BookOpen, Eye, Text } from '@tamagui/lucide-icons'
import { BoardModel } from './boardsSchemas'
import { API, z, getPendingResult } from 'protobase'
import { usePendingEffect } from "../../lib/usePendingEffect"
import { Chip } from "../../components/Chip"
import { DataTable2 } from "../../components/DataTable2"
import { DataView } from "../../components/DataView"
import { AdminPage } from "../../components/AdminPage"
import { PaginatedData } from "../../lib/SSR"
import { useSearchParams, usePathname } from 'solito/navigation'
import { Input } from 'tamagui'

const sourceUrl = '/api/core/v1/boards'

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
  }
}