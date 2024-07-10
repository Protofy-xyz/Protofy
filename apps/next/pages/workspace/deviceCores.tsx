import DevicesPages from 'protolib/src/bundles/devices/adminPages'
import Head from 'next/head'
import { useRedirectToEnviron } from 'protolib'
import { SiteConfig } from 'app/conf'

export default function Page(props:any) {
  const PageComponent = DevicesPages['deviceCores/**'].component
  useRedirectToEnviron()
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
