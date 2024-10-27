import StateMachineDefinitionsPages from 'protolib/bundles/stateMachines/adminPages'
import Head from 'next/head'
import { SiteConfig } from 'app/conf'

export default function Page(props: any) {
  const PageComponent = StateMachineDefinitionsPages['stateMachineDefinitions/**'].component
  const projectName = SiteConfig.projectName

  return (
    <>
      <Head>
        <title>{projectName + " - State Machine Definitions"}</title>
      </Head>
      <PageComponent {...props} />
    </>
  )
}

export const getServerSideProps = StateMachineDefinitionsPages['stateMachineDefinitions/**'].getServerSideProps