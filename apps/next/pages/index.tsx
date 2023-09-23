import { HomeScreen } from 'app/features/home'
import Head from 'next/head'
import { SSR } from '../conf'
import { NextPageContext } from 'next'
import { withSession } from 'protolib'

export default function Page(props:any) {
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