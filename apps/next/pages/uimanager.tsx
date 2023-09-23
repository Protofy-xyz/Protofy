import UIManager from 'app/features/uimanager'
import Head from 'next/head'
import { SSR } from '../conf'
import { NextPageContext } from 'next'
import { withSession } from 'protolib'

export default function VisualUIPage(props:any) {
  return (
    <>
      <Head>
        <title>Protofy - UIManager</title>
      </Head>
      <UIManager {...props} />
    </>
  )
}

export const getServerSideProps = SSR(async (context:NextPageContext) => withSession(context, []))