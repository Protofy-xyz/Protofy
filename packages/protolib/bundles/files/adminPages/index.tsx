import { withSession, Tinted, Center, SSR, AdminPage } from 'protolib'
import dynamic from 'next/dynamic'
import { Spinner } from 'tamagui'

const FileBrowser = dynamic<any>(() =>
    import('protolib/adminpanel/next/components/FileBrowser').then(module => module.FileBrowser),
    { ssr: false, loading:() => <Tinted><Center><Spinner size='small' color="$color7" scale={4} /></Center></Tinted>}
);

function FilesPage({initialFilesState, pageSession}:any) {
  return (
      <AdminPage pageSession={pageSession} title={"Files"} >
        <FileBrowser initialFilesState={initialFilesState} />
      </AdminPage>
  )
}

export default {
    'files': {component: FilesPage, getServerSideProps: SSR(async (context) => withSession(context, ['admin'])) }
}