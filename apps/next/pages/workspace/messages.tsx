import MessagesPage from 'protolib/bundles/messages/adminPages'
import Head from 'next/head'
import { useRedirectToEnviron } from 'protolib/lib/useRedirectToEnviron'

export default function Page(props:any) {
  useRedirectToEnviron()
  return (
    <>
      <Head>
        <title>Protofy - Messages</title>
      </Head>
      <MessagesPage.messages.component {...props} />
    </>
  )
}

export const getServerSideProps = MessagesPage.messages.getServerSideProps