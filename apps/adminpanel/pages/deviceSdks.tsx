import DevicesPages from 'protolib/bundles/devices/adminPages'
import Head from 'next/head'
import { SiteConfig } from 'app/conf'

export default function Page(props:any) {
  const PageComponent = DevicesPages['deviceSdks/**'].component
  const projectName = SiteConfig.projectName

  return (
    <>
      <Head>
        <title>{projectName + " - Devices SDK"}</title>
      </Head>
      <PageComponent {...props} />
    </>
  )
}
