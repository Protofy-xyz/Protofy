import AdminPanel from '../features'
import Head from 'next/head'
import { SSR } from 'app/conf'
import { NextPageContext } from 'next'
import { API, withSession, useSession } from 'protolib'
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import {TopicsProvider } from 'react-topics';

const  DevicesAdmin = dynamic(() => import('../features/components/devices'), { ssr: false })

export default function DevicesPage({workspace, data, pageSession}:any) {
  const router = useRouter();
  useSession(pageSession)
  const { name } = router.query;
  return (
    <TopicsProvider>
      <Head>
        <title>Protofy - Admin Panel</title>
      </Head>
      <AdminPanel workspace={workspace}>
        <DevicesAdmin />
      </AdminPanel>
    </TopicsProvider>
  )
}

export const getServerSideProps = SSR(async (context:NextPageContext) => {
    return withSession(context, ['admin'], {
      //...props,
      workspace: await API.get('/adminapi/v1/workspaces')
    })
})
