import { SettingModel } from '.'
import { DataView } from 'protolib/components/DataView'
import { AdminPage } from 'protolib/components/AdminPage'
import { Key } from '@tamagui/lucide-icons';
import { usePrompt } from 'protolib/context/PromptAtom'
import { PaginatedData } from 'protolib/lib/SSR';

const sourceUrl = '/api/core/v1/settings'

export default {
  'settings': {
    component: ({ pageState, initialItems, pageSession, extraData }: any) => {
      usePrompt(() => ``+ (
          initialItems?.isLoaded ? 'Currently the system returned the following information: ' + JSON.stringify(initialItems.data) : ''
        ))

      return (<AdminPage title="Keys" pageSession={pageSession}>
        <DataView
                enableAddToInitialData
                disableViews={["grid"]}
                defaultView={'list'}
                sourceUrl={sourceUrl}
                initialItems={initialItems}
                numColumnsForm={1}
                name="settings"
                model={SettingModel}
        />
      </AdminPage>)
    },
    getServerSideProps: PaginatedData(sourceUrl, ['admin'])
  }
}