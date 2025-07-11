import EventsPage from '@extensions/events/adminPages'
import Head from 'next/head'
import { SiteConfig } from 'app/conf'

export default function Page(props:any) {
  const projectName = SiteConfig.projectName

  return (
    <>
      <Head>
        <title>{projectName + " - Events"}</title>
      </Head>
      <EventsPage.events.component {...props} />
    </>
  )
}