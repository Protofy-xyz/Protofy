import EventsPage from 'protolib/bundles/events/adminPages'
import Head from 'next/head'
import { useRedirectToEnviron } from 'protolib/lib/useRedirectToEnviron'

export default function Page(props:any) {
  useRedirectToEnviron()
  return (
    <>
      <Head>
        <title>Protofy - Events</title>
      </Head>
      <EventsPage.events.component {...props} />
    </>
  )
}

export const getServerSideProps = EventsPage.events.getServerSideProps