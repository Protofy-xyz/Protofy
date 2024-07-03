import FSMPages from 'protolib/bundles/fsm/adminPages'
import Head from 'next/head'
import { useRedirectToEnviron } from 'protolib'

export default function Page(props:any) {
  useRedirectToEnviron()
  return (
    <>
      <Head>
        <title>Protofy - State Machines</title>
      </Head>
      <FSMPages.fsm.component {...props} />
    </>
  )
}

export const getServerSideProps = FSMPages.fsm.getServerSideProps