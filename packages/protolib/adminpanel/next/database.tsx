import AdminPanel from '../features'
import Head from 'next/head'
import { SSR } from 'app/conf'
import { NextPageContext } from 'next'
import { API, redirect, withSession } from 'protolib'
import { useRouter } from 'next/router';
import DBAdmin from '../features/components/db'
import { useSession } from '../../lib/Session'

export default function DatabasePage({workspace, data, pageSession}:any) {
  useSession(pageSession)
  return (
    <>
      <Head>
        <title>Protofy - Admin Panel</title>
      </Head>
      <AdminPanel workspace={workspace}>
        <DBAdmin contentState={data?.contentState} />
      </AdminPanel>
    </>
  )
}

export const getServerSideProps = SSR(async (context:NextPageContext) => {
    const nameSegments = context.query.name as string[];
    
    let props = {}
    const dbs = await API.get('/adminapi/v1/databases') ?? { data: [] }

    if (!context.query.name && dbs.data?.length) {
        return redirect('/admin/database/' + dbs.data[0].name)
    }

    const db = dbs.data?.find((db:any) => db.name == nameSegments[2])
    if (!db) {
        return dbs.data?.length ?
            redirect('/admin/database/' + dbs.data[0].name)
            :
            redirect('/admin/database')
    }
    props = {
      data: {
        contentState: dbs.data?.length ? await API.get('/adminapi/v1/databases/' + db.name) : []
      }
    }

    return withSession(context, ['admin'], {
      ...props,
      workspace: await API.get('/adminapi/v1/workspaces')
    })
})
