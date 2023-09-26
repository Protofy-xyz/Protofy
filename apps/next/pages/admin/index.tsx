import FilesAdmin from 'app/features/admin/files'
import Head from 'next/head'
import { SSR } from '../../conf'
import { NextPageContext } from 'next'
import { API, redirect, withSession } from 'protolib'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router';

const FileBrowser = dynamic(() => import('../../components/FileBrowser'), {
  ssr: false,
})

export default function FilesPage(props:any) {
  const router = useRouter();
  const { name } = router.query;
  return (
    <>
      <Head>
        <title>Protofy - Admin Panel</title>
      </Head>
      <FilesAdmin  {...props} CurrentPath={(name?name as []:[]).join('/')} FileBrowser={FileBrowser} />
    </>
  )
}

export const getServerSideProps = SSR(async (context:NextPageContext) => {
    const nameSegments = context.query.name as string[];
    
    let props = {}

    if(nameSegments && nameSegments.length && nameSegments[0] == 'files') {
      const path = nameSegments ? nameSegments.slice(1).join('/') : '';
      //@ts-ignore
      const currentFile = context.query.file ? context.query.file.split('/')[0] : ''
      const currentFilePath = path+'/'+currentFile.replace(/\/+/g, '/');
      props = {
        filesState: await API.get('/adminapi/v1/files/'+path) ?? { data: [] },
        CurrentPath: path,
        CurrentFile: currentFile,
        CurrentFileContent: currentFile ? (await API.get('/adminapi/v1/files/'+currentFilePath, null, true)) : ''
      }
      console.log('Requesting to: *****************', '/adminapi/v1/files/'+path)
    }

    return withSession(context, ['admin'], props)
})