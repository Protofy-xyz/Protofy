import React, { useState, useEffect } from "react";
import { BookOpen, Tag, Router } from '@tamagui/lucide-icons';
import { AgentsModel, AgentsType } from './agentsSchemas';
import { API } from 'protobase';
import { DataTable2 } from '../../../components/DataTable2';
import { DataView } from '../../../components/DataView';
import { AdminPage } from '../../../components/AdminPage';
import { CardBody } from '../../../components/CardBody';
import { ItemMenu } from '../../../components/ItemMenu';
import { useWorkspaceEnv } from '../../../lib/useWorkspaceEnv';
import { Tinted } from '../../../components/Tinted';
import { Chip } from '../../../components/Chip';
import { z } from 'protobase';
import { Paragraph, Stack, Switch, TextArea, XStack, YStack, Text, Button } from '@my/ui';
import { getPendingResult } from "protobase";
import { Pencil, UploadCloud } from '@tamagui/lucide-icons';
import { usePageParams } from '../../../next';
import { SSR } from '../../../lib/SSR'
import { withSession } from '../../../lib/Session'
import { Subsystems } from '../subsystems/Subsystems'

const agentsIcon = { name: Tag, deviceDefinition: BookOpen }

const sourceUrl = '/adminapi/v1/agents'

export default {
  component: ({ pageState, initialItems, itemData, pageSession, extraData }: any) => {
    const { replace } = usePageParams(pageState)
    const [all, setAll] = useState(false)
    const env = useWorkspaceEnv()

    const extraMenuActions = []

    return (<AdminPage title="Agents" pageSession={pageSession}>
      <DataView
        entityName="agents"
        onAdd={data => {
          return { ...data, environment: env }
        }}
        defaultView={"grid"}
        key={all ? 'all' : 'filtered'}
        toolBarContent={
          <XStack mr={"$2"} f={1} space="$1.5" ai="center" jc='flex-end'>
            <Text fontSize={14} color="$color11">
              View all
            </Text>
            <Tinted>
              <Switch
                forceStyle='hover'
                checked={all}
                onCheckedChange={v => setAll(v)} size="$1"
              >
                {/** @ts-ignore */}
                <Switch.Thumb animation="quick" backgroundColor={"$color9"} />
              </Switch>
            </Tinted>


          </XStack>
        }
        itemData={itemData}
        rowIcon={Router}
        sourceUrl={sourceUrl}
        sourceUrlParams={all ? undefined : { env }}
        initialItems={initialItems}
        name="agent"
        columns={DataTable2.columns(
          DataTable2.column("name", row => row.name, "name"),
          DataTable2.column("platform", row => row.platform, "platform"),
        )}
        model={AgentsModel}
        pageState={pageState}
        icons={agentsIcon}
        dataTableGridProps={{
          disableItemSelection: true,
          onSelectItem: (item) => { },
          getBody: (data: AgentsType) => <CardBody title={data.name}>
            <XStack right={20} top={20} position={"absolute"}>
              {/* ADD ENVIRONMENTS COMPATIBILITY */}
              {/* {data.environment && all && <Chip color={data.environment == 'dev' ? "$color5" : "$color7"} text={data.environment} />} */}
              <ItemMenu type="item" sourceUrl={sourceUrl} onDelete={async (sourceUrl, deviceId?: string) => {
                await API.get(`${sourceUrl}/${deviceId}/delete`)
              }} deleteable={() => true} element={AgentsModel.load(data)} extraMenuActions={extraMenuActions} />
            </XStack>
            <YStack f={1}>
              {
                Object.keys(data.subsystems ?? {}).length
                  ? <Subsystems name={data.name} subsystems={data.subsystems} type={"agent"} />
                  : <Paragraph mt="20px" ml="20px" size={20}>{'No subsystems defined'}</Paragraph>
              }
            </YStack>
          </CardBody>
        }}
        extraMenuActions={extraMenuActions}
      />
    </AdminPage>)
  },
  getServerSideProps: SSR(async (context) => withSession(context, ['admin']))
}