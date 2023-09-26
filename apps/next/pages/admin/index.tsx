import AdminPanel from 'app/features/admin'
import Head from 'next/head'
import { SSR } from '../../conf'
import { NextPageContext } from 'next'
import { API, redirect, withSession } from 'protolib'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router';
import { promises as fs } from 'fs';

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
      <AdminPanel {...props} FileBrowser={FileBrowser} />
    </>
  )
}

export const getServerSideProps = SSR(async (context:NextPageContext) => {
    const nameSegments = context.query.name as string[];
    
    let props = {}

    if(nameSegments && nameSegments.length) {
      if(nameSegments[0] == 'files') {
        const path = nameSegments ? nameSegments.slice(1).join('/') : '';
        //@ts-ignore
        const currentFile = context.query.file ? context.query.file.split('/')[0] : ''
        const currentFilePath = path+'/'+currentFile.replace(/\/+/g, '/');
        props = {
          data: {
            filesState: await API.get('/adminapi/v1/files/'+path) ?? { data: [] },
            CurrentPath: path,
            CurrentFile: currentFile
          }
        }
        console.log('Requesting to: *****************', '/adminapi/v1/files/'+path)
      } else if(nameSegments[0] == 'dbs') {
        const dbs = await API.get('/adminapi/v1/databases') ?? { data: [] }
        if (!context.query.name && dbs.data.length) {
            return redirect('/admin/dbs/' + dbs.data[0].name)
        }

        const db = dbs.data.find((db:any) => db.name == nameSegments[1])
        if (!db) {
            return dbs.data.length ?
                redirect('/admin/dbs/' + dbs.data[0].name)
                :
                redirect('/admin')
        }
        props = {
          data: {
            databasesState: dbs,
            currentDbState: db.name,
            contentState: dbs.data.length ? await API.get('/adminapi/v1/databases/' + db.name) : []
          }
        }
      }
    }

    return withSession(context, ['admin'], {
      ...props,
      workspace: JSON.parse((await fs.readFile('../../data/workspaces/basic.json')).toString())
    })
})