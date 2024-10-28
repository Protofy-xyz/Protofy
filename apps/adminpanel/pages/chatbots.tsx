import ChatbotsPage from 'protolib/bundles/chatbots/adminPages'
import Head from 'next/head'
import { SiteConfig } from 'app/conf'

export default function Page(props: any) {
  const projectName = SiteConfig.projectName

  return (
    <>
      <Head>
        <title>{projectName + " - Chatbots"}</title>
      </Head>
      <ChatbotsPage.chatbots.component {...props} />
    </>
  )
}

export const getServerSideProps = ChatbotsPage.chatbots.getServerSideProps
