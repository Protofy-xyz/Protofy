import AdminPanel from 'app/features/admin'
import Head from 'next/head'
import { SSR } from 'common'
import { NextPageContext } from 'next'
import { API, withSession } from 'protolib'
import { useRouter } from 'next/router';
import DevicesAdmin from 'app/features/admin/components/devices'

export default function DevicesPage({workspace, data}:any) {
  const router = useRouter();
  const { name } = router.query;
  return (
    <>
      <Head>
        <title>Protofy - Admin Panel</title>
      </Head>
      <AdminPanel workspace={workspace}>
        <DevicesAdmin />
      </AdminPanel>
    </>
  )
}

export const getServerSideProps = SSR(async (context:NextPageContext) => {
    return withSession(context, ['admin'], {
      //...props,
      workspace: await API.get('/adminapi/v1/workspaces')
    })
})
