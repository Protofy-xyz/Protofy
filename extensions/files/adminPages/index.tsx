import { withSession } from 'protolib/lib/Session';
import { Tinted } from 'protolib/components/Tinted';
import { Center } from 'protolib/components/Center';
import { SSR } from 'protolib/lib/SSR';
import { AdminPage } from 'protolib/components/AdminPage';
import dynamic from 'next/dynamic'
import { Spinner, YStack } from '@my/ui'
import { useRouter } from 'next/router';

const FileBrowser = dynamic<any>(() =>
    import('protolib/adminpanel/next/components/FileBrowser').then(module => module.FileBrowser),
    { ssr: false, loading:() => <Tinted><Center><Spinner size='small' color="$color7" scale={4} /></Center></Tinted>}
);

function FilesPage({initialFilesState, pageSession}:any) {
  const router = useRouter();
  const { pathname, query, push, replace } = router;
  const routeAdapter = { push, replace, pathname, query: query as Record<string, string> };

  return (
      <AdminPage pageSession={pageSession} title={"Files"} >
        <YStack f={1} p="$6">
          <FileBrowser initialFilesState={initialFilesState} router={routeAdapter} />
        </YStack>
      </AdminPage>
  )
}

export default {
    'files': {component: FilesPage, getServerSideProps: SSR(async (context) => withSession(context, ['admin'])) }
}