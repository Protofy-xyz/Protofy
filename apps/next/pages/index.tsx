import nextPages from 'app/bundles/nextPages'
import Head from 'next/head'
import { SSR } from 'app/conf'
import { NextPageContext } from 'next'
import { useSession, withSession } from 'protolib'

export default function Page(props:any) {
  useSession(props.pageSession)
  return (
    <>
      {nextPages["/"].component()}
    </>
  )
}

export const getServerSideProps = nextPages["/"].getServerSideProps