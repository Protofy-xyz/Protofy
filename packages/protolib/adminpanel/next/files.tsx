import AdminPanel from '../features'
import Head from 'next/head'
import { SSR } from 'app/conf'
import { NextPageContext } from 'next'
import { API, withSession } from 'protolib'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router';
import { useSession } from '../../lib/Session'

const FileBrowser = dynamic<any>(() =>
    import('./components/FileBrowser').then(module => module.FileBrowser),
    { ssr: false }
);

export default function FilesPage({workspace, data, pageSession}:any) {
  const router = useRouter();
  useSession(pageSession)
  const { name } = router.query;
  return (
    <>
      <Head>
        <title>Protofy - Admin Panel</title>
      </Head>
      <AdminPanel workspace={workspace}>
        <FileBrowser path={data?.CurrentPath} file={data?.CurrentFile} filesState={data?.filesState} />
      </AdminPanel>
    </>
  )
}

export const getServerSideProps = SSR(async (context:NextPageContext) => {
    const nameSegments = context.query.name as string[];
    
    let props = {}
    const path = nameSegments ? nameSegments.slice(2).join('/') : '';
    //@ts-ignore
    const currentFile = context.query.file ? context.query.file.split('/')[0] : ''
    props = {
      data: {
        filesState: await API.get('/adminapi/v1/files/'+path) ?? { data: [] },
        CurrentPath: path,
        CurrentFile: currentFile
      }
    }    

    return withSession(context, ['admin'], {
      ...props,
      workspace: await API.get('/adminapi/v1/workspaces')
    })
})
