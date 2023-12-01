import { NextPageContext } from 'next'
import { API, withSession, Center, getURLWithToken, SSR } from 'protolib'
import dynamic from 'next/dynamic'
import { Spinner } from 'tamagui'
import { Tinted } from '../../components/Tinted'
import { AdminPage } from '../features/next'
import { usePrompt } from '../../context/PromptAtom'

const FileBrowser = dynamic<any>(() =>
    import('./components/FileBrowser').then(module => module.FileBrowser),
    { ssr: false, loading:() => <Tinted><Center><Spinner size='small' color="$color7" scale={4} /></Center></Tinted>}
);

export default function FilesPage({data, pageSession}:any) {
  usePrompt(() => data?.CurrentFile ? ``:`At this moment the user is using a web file manager. The file manager allows to view and manage the files and directories of the project.
  The web file managers allow to create, view and edit files, has an integrated source code editor, an integrated visual programming editor and allows to upload and download files from the system.
  Using the file manager you have full control of the system because you can directly edit any system file. Be careful when editing sensible files, like source code or system directories, you may break the system.
  There are interesting directories:
  - /data/databases contain the databases (leveldb files)
  - /apps contain the system applications (next, expo, redbird proxy and express apis)
  - /apps/next/public publicly accesible directory. The files you upload here can be accessed from the public system url (its the public directory of the next app)
  - /packages/app/bundles/custom the custom bundle. The system encourages extension through bundles, and the custom bundle is the bundle for your specific system. You can extend the system from this bundle, or create other bundles. bundles can add apis, pages, tasks, objects and more things 
  
  
  Currently the user is in the directory: ${data?.CurrentPath}. 
  ${data?.CurrentFile?'The user is viewing the file'+data?.CurrentFile:`The directory contents are: ${JSON.stringify(data?.filesState)}`}
  `) 
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
        filesState: await API.get(getURLWithToken('/adminapi/v1/files/'+path, context)) ?? { data: [] },
        CurrentPath: path,
        CurrentFile: currentFile? path+'/'+currentFile : null
      }
    }    

    return withSession(context, ['admin'], {
      ...props
    })
})
