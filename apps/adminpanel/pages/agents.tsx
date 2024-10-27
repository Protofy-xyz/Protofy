import AgentsPages from 'protolib/bundles/agents/adminPages'
import Head from 'next/head'
import { SiteConfig } from 'app/conf'

export default function Page(props:any) {
  const PageComponent = AgentsPages['agents/**'].component
  const projectName = SiteConfig.projectName

  return (
    <>
      <Head>
        <title>{projectName + " - Agents"}</title>
      </Head>
      <PageComponent {...props} />
    </>
  )
}

export const getServerSideProps = AgentsPages['agents/**'].getServerSideProps