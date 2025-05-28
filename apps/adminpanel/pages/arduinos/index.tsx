import ArduinosPage from 'protolib/bundles/arduino/adminPages'
import Head from 'next/head'
import { SiteConfig } from 'app/conf'

export default function Page(props:any) {
  const projectName = SiteConfig.projectName

  return (
    <>
      <Head>
        <title>{projectName + " - Arduinos"}</title>
      </Head>
      <ArduinosPage.arduinos.component {...props} />
    </>
  )
}

// export const getServerSideProps = ArduinosPage.arduinos.getServerSideProps