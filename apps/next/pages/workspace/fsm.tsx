import FSMPages from 'protolib/bundles/fsm/adminPages'
import Head from 'next/head'
import { useRedirectToEnviron } from 'protolib/lib/useRedirectToEnviron'
import { SiteConfig } from 'app/conf'

export default function Page(props:any) {
  useRedirectToEnviron()
  const projectName = SiteConfig.projectName

  return (
    <>
      <Head>
        <title>{projectName + " - State Machines"}</title>
      </Head>
      <FSMPages.fsm.component {...props} />
    </>
  )
}

export const getServerSideProps = FSMPages.fsm.getServerSideProps