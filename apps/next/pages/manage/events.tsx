import EventsPage from 'protolib/bundles/events/adminPages'
import Head from 'next/head'

export default function Page(props:any) {
  return (
    <>
      <Head>
        <title>Protofy - Events</title>
      </Head>
      <EventsPage.events.component {...props} />
    </>
  )
}
