import AdminPanel from '../features'
import Head from 'next/head'
import { SSR } from 'app/conf'
import { NextPageContext } from 'next'
import { API, withSession } from 'protolib'
import { useRouter } from 'next/router';
import DevicesAdmin from '../features/components/devices'
import { useSession } from '../../lib/Session'

export default function DevicesPage({workspace, data, pageSession}:any) {
  const router = useRouter();
  useSession(pageSession)
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
