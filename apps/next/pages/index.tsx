import { HomeScreen } from 'app/features/home'
import Head from 'next/head'
import { SSR } from 'app/conf'
import { NextPageContext } from 'next'
import { useSession, withSession } from 'protolib'

export default function Page(props:any) {
  useSession(props.pageSession)
  return (
    <>
      <Head>
        <title>Protofy</title>
      </Head>
      <HomeScreen {...props} />
    </>
  )
}

export const getServerSideProps = SSR(async (context:NextPageContext) => withSession(context))