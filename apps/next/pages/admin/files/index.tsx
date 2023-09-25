import FilesAdmin from 'app/features/admin/files'
import Head from 'next/head'
import { SSR } from '../../../conf'
import { NextPageContext } from 'next'
import { API, redirect, withSession } from 'protolib'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router';

const FileBrowser = dynamic(() => import('../../../components/FileBrowser'), {
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
    const path = nameSegments ? nameSegments.join('/') : '';
    const files = await API.get('/adminapi/v1/files/'+path) ?? { data: [] }
    return withSession(context, ['admin'], {
      filesState: files,
      CurrentPath: path,
      CurrentFile: context.query.file ?? ''
    })
})