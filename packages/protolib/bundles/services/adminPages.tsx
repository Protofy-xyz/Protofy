import { DataView, AdminPage } from 'protolib'
import { Zap } from '@tamagui/lucide-icons';
import { ServiceModel } from './servicesSchema';

const sourceUrl = '/adminapi/v1/services'
export default {
  'services': {
    component: ({ pageState, initialItems, pageSession, extraData }: any) => {
      return (<AdminPage title="Services" pageSession={pageSession}>
        <DataView
          integratedChat
          enableAddToInitialData
          disableViewSelector
          defaultView={'grid'}
          rowIcon={Zap}
          sourceUrl={sourceUrl}
          initialItems={initialItems}
          numColumnsForm={1}
          name="service"
          model={ServiceModel}
          pageState={pageState}
          dataTableCardProps={{ itemMinWidth: 300 }}
        />
      </AdminPage>)
    }
  }
}