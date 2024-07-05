import { DataView } from 'protolib/components/DataView';
import { AdminPage } from 'protolib/components/AdminPage';
import { CardBody } from 'protolib/components/CardBody';
import { Cog, ScrollText, LineChart, RotateCw, Cpu, Activity} from '@tamagui/lucide-icons';
import { ServiceModel } from './servicesSchema';
import { YStack, Stack, SizableText, XStack } from '@my/ui'
import { usePageParams } from '../../next';
import moment from 'moment';
import { PaginatedData } from '../../lib/SSR';

const sourceUrl = '/adminapi/v1/services'

const lc = '8'
const pm2Colors = {
  online: '$green' + lc,
  stopping: '$yellow' + lc,
  stopped: '$red' + lc,
  launching: '$blue' + lc,
  errored: '$red' + lc,
  'one-launch-status': '$cyan' + lc,
  'waiting restart': '$orange' + lc,
  waiting: '$gray' + lc
};

const ReportCard = ({Icon, value, description}) => {
  return <XStack ai="center">
    <XStack p="$2" boc="$gray3" br={4} m="$2" bw="0px">
      <Icon color="$gray9" size={30} strokeWidth={1.25} />
    </XStack>
    <YStack ml={"$2"}>
      <SizableText size="$5" o={0.81} fontWeight={"600"}>{value}</SizableText>
      <SizableText size="$4" o={0.6} fontWeight={"500"}>{description}</SizableText>
    </YStack>
  </XStack>
}

export default {
  'services': {
    component: ({ pageState, initialItems, pageSession, extraData }: any) => {
      const { replace } = usePageParams(pageState)
      const extraMenuActions = [
        {
          text: "Service Logs",
          icon: ScrollText,
          action: (element) => { replace('editFile', element.getConfigFile()) },
          isVisible: (element) => true
        },
      ]

      const toMB = (total: number | string) => {
        if (typeof total === 'string') {
          total = parseInt(total, 10)
        }
        return Math.round(total / 1024 / 1024) + ' MB'
      }


      return (<AdminPage title="Services" pageSession={pageSession}>
        <DataView
          quickRefresh={true}
          hideAdd
          enableAddToInitialData
          defaultView={'grid'}
          rowIcon={Cog}
          sourceUrl={sourceUrl}
          initialItems={initialItems}
          numColumnsForm={1}
          name="service"
          model={ServiceModel}
          pageState={pageState}
          dataTableGridProps={{
            disableItemSelection: true,
            onSelectItem: (item) => { },
            getBody: (data) => {
              const memory = toMB(data.memory)
              const cpu = data.cpu + '%'
              const uptime = moment.duration(data.uptime, "milliseconds").humanize()
              return <CardBody
                subtitle={<SizableText size="$4" fontWeight={"500"} color={pm2Colors[data.status]}>{data.status}</SizableText>}
                title={data.name}
              >
                <Stack right={20} top={20} position={"absolute"}>
                  {/* <ItemMenu 
                    type="item" 
                    sourceUrl={sourceUrl} 
                    deleteable={() => false} 
                    element={ServiceModel.load(data)} 
                    extraMenuActions={extraMenuActions}
                  /> */}
                </Stack>
                <YStack f={1} p="$2">
                  <ReportCard Icon={Cpu} value={cpu} description="CPU" />
                  <ReportCard Icon={LineChart} value={memory} description="Used Memory" />
                  <ReportCard Icon={Activity} value={uptime} description="Uptime" />
                  <ReportCard Icon={RotateCw} value={data.restarts} description="Service restarts" />
                </YStack>
              </CardBody>
            }
          }}
        />
      </AdminPage>)
    },
    getServerSideProps: PaginatedData(sourceUrl, ['admin'])
  }
}