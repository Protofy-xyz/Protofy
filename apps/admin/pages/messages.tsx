import MessagesPage from 'protolib/bundles/messages/adminPages'
import Head from 'next/head'

export default function Page(props:any) {
  return (
    <>
      <Head>
        <title>Protofy - Messages</title>
      </Head>
      <MessagesPage.messages.component {...props} />
    </>
  )
}
