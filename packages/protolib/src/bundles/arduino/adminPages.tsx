import { AdminPage } from "../../components/AdminPage"
import { useRouter } from 'solito/navigation';
import { DataView, DataViewActionButton } from "../../components/DataView"
import { PaginatedData, SSR } from "../../lib/SSR"
import { withSession } from "../../lib/Session"
import { API } from 'protobase'
import { ArduinosModel } from "./arduinosSchemas";
import { DataTable2 } from "../../components/DataTable2"
import { YStack, Text } from "@my/ui";
import { ArrowLeft, BookOpen, Plus, Save, Settings, Sparkles, Tag, Trash2, X } from '@tamagui/lucide-icons'



const sourceUrl = '/api/core/v1/arduinos'

const ArduinoPreview = ({ element, width, onDelete, onPress, ...props }: any)=>{
  return (
    <YStack><Text>Found here a list of arduinos</Text></YStack>
  )
}

export default {
    arduinos: {
      component: ({ workspace, pageState, initialItems, itemData, pageSession, extraData }: any) => {
        const router = useRouter()
  
        return (<AdminPage title="Arduinos" workspace={workspace} pageSession={pageSession}>
          <DataView
            entityName={"arduinos"}
            itemData={itemData}
            rowIcon={BookOpen}
            sourceUrl={sourceUrl}
            initialItems={initialItems}
            numColumnsForm={1}
            onAdd={(data) => { router.push(`/arduinos/${data.name}`); return data }}
            name="Arduino"
            onEdit={data => { console.log("DATA (onEdit): ", data); return data }}
            onSelectItem={(item) => router.push(`/arduinos/${item.data.name}`)}
            columns={DataTable2.columns(
              DataTable2.column("name", row => row.name, "name")
            )}
            model={ArduinosModel}
            pageState={pageState}
            dataTableGridProps={{
              getCard: (element, width) => <ArduinoPreview
                onDelete={async () => {
                }}
                onPress={() => console.log("Go to: ", element )}
                element={element} width={width} />,
            }}
            defaultView={"grid"}
          />
        </AdminPage>)
      },
      getServerSideProps: PaginatedData(sourceUrl, ['admin'])
    },
    view: {
      component: ({ workspace, pageState, initialItems, itemData, pageSession, extraData, arduino, icons }: any) => {
        const { data } = arduino
        console.log("Arduino: ", data)
        return( <YStack><Text>Arduino Component</Text></YStack>)
      },
      getServerSideProps: SSR(async (context) => withSession(context, ['admin'], async (session) => {
        return {
          board: await API.get(`/api/core/v1/arduinos/${context.params.board}/?token=${session?.token}`),
          icons: (await API.get(`/api/core/v1/icons?token=${session?.token}`))?.data?.icons ?? []
        }
      }))
    }
  }