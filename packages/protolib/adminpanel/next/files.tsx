import { SSR } from 'app/conf'
import { NextPageContext } from 'next'
import { API, withSession, Center } from 'protolib'
import dynamic from 'next/dynamic'
import { Spinner } from 'tamagui'
import { Tinted } from '../../components/Tinted'
import { AdminPage } from '../features/next'

const FileBrowser = dynamic<any>(() =>
    import('./components/FileBrowser').then(module => module.FileBrowser),
    { ssr: false, loading:() => <Tinted><Center><Spinner size='small' color="$color7" scale={4} /></Center></Tinted>}
);

export default function FilesPage({data, pageSession}:any) {
  return (
      <AdminPage pageSession={pageSession} title={"Files"} >
        <FileBrowser path={data?.CurrentPath} file={data?.CurrentFile} filesState={data?.filesState} />
      </AdminPage>

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
      ...props
    })
})
