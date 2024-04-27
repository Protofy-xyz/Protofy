import { KeyModel } from '.'
import { DataView, AdminPage, PaginatedDataSSR } from 'protolib'
import { Key } from '@tamagui/lucide-icons';
import { API } from '../../base/Api'
import { usePrompt } from '../../context/PromptAtom'
import { useState } from 'react';
import { getPendingResult } from '../../base';
import { usePendingEffect } from '../../lib/usePendingEffect';

const sourceUrl = '/adminapi/v1/keys'
const workspacesSourceUrl = '/adminapi/v1/workspaces'

export default {
  'keys': {
    component: ({ pageState, initialItems, pageSession, extraData }: any) => {
      usePrompt(() => ``+ (
          initialItems?.isLoaded ? 'Currently the system returned the following information: ' + JSON.stringify(initialItems.data) : ''
        ))

      const [workspaces, setWorkspaces] = useState(extraData?.workspaces ?? getPendingResult('pending'))
      usePendingEffect((s) => { API.get(workspacesSourceUrl, s) }, setWorkspaces, extraData?.workspaces)

      return (<AdminPage title="Keys" pageSession={pageSession}>
        <DataView
                integratedChat
                enableAddToInitialData
                disableViewSelector
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
    getServerSideProps: PaginatedDataSSR(sourceUrl, ['admin'], {}, async () => {
      return {
        workspaces: await API.get(workspacesSourceUrl),
      }
    })
  }
}