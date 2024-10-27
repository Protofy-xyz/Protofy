import DevicesPages from 'protolib/bundles/devices/adminPages'
import Head from 'next/head'
import { SiteConfig } from 'app/conf'

export default function Page(props:any) {
  const PageComponent = DevicesPages['deviceCores/**'].component
  const projectName = SiteConfig.projectName

  return (
    <>
      <Head>
        <title>{projectName + " - Device Cores"}</title>
      </Head>
      <PageComponent {...props} />
    </>
  )
}
