import DevicesPages from '@extensions/devices/adminPages'
import Head from 'next/head'
import { SiteConfig } from 'app/conf'

export default function Page(props:any) {
  const PageComponent = DevicesPages['devices/**'].component
  const projectName = SiteConfig.projectName

  return (
    <>
      <Head>
        <title>{projectName + " - Devices"}</title>
      </Head>
      <PageComponent {...props} />
    </>
  )
}