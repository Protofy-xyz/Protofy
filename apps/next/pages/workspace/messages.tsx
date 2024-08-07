import MessagesPage from 'protolib/bundles/messages/adminPages'
import Head from 'next/head'
import { useRedirectToEnviron } from 'protolib/lib/useRedirectToEnviron'
import { SiteConfig } from 'app/conf'

export default function Page(props:any) {
  useRedirectToEnviron()
  const projectName = SiteConfig.projectName

  return (
    <>
      <Head>
        <title>{projectName + " - Messages"}</title>
      </Head>
      <MessagesPage.messages.component {...props} />
    </>
  )
}

export const getServerSideProps = MessagesPage.messages.getServerSideProps