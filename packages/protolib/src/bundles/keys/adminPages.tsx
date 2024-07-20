import { KeyModel } from '.'
import { DataView } from '../../components/DataView'
import { AdminPage } from 'app/layout/AdminPage'
import { Key } from '@tamagui/lucide-icons';
import { usePrompt } from '../../context/PromptAtom'
import { PaginatedData } from '../../lib/SSR';

const sourceUrl = '/adminapi/v1/keys'

export default {
  'keys': {
    component: ({ pageState, initialItems, pageSession, extraData }: any) => {
      usePrompt(() => ``+ (
          initialItems?.isLoaded ? 'Currently the system returned the following information: ' + JSON.stringify(initialItems.data) : ''
        ))

      return (<AdminPage title="Keys" pageSession={pageSession}>
        <DataView
                enableAddToInitialData
                disableViews={["grid"]}
                defaultView={'list'}
                rowIcon={Key}
                sourceUrl={sourceUrl}
                initialItems={initialItems}
                numColumnsForm={1}
                name="key"
                model={KeyModel}
        />
      </AdminPage>)
    },
    getServerSideProps: PaginatedData(sourceUrl, ['admin'])
  }
}