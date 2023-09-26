import DBAdmin from 'app/features/admin/db'
import Head from 'next/head'
import { SSR } from '../../../conf'
import { NextPageContext } from 'next'
import { API, redirect, withSession } from 'protolib'

export default function AdminPage(props:any) {
  return (
    <>
      <Head>
        <title>Protofy - Admin Panel</title>
      </Head>
      <DBAdmin {...props} />
    </>
  )
}

export const getServerSideProps = SSR(async (context:NextPageContext) => {
    const dbs = await API.get('/adminapi/v1/databases') ?? { data: [] }
    if (!context.query.name && dbs.data.length) {
        return redirect('/admin/db/' + dbs.data[0].name)
    }

    const db = dbs.data.find((db:any) => db.name == context.query.name)
    if (!db) {
        return dbs.data.length ?
            redirect('/admin/db/' + dbs.data[0].name)
            :
            redirect('/admin')
    }

    return withSession(context, ['admin'], {
        databasesState: dbs,
        currentDbState: db.name,
        contentState: dbs.data.length ? await API.get('/adminapi/v1/databases/' + db.name) : []
    })
})