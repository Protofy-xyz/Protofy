import AssetsPage from '@extensions/assets/adminPages'
import Head from 'next/head'
import { SiteConfig } from 'app/conf'

export default function Page(props:any) {
  const projectName = SiteConfig.projectName

  return (
    <>
      <Head>
        <title>{projectName + " - Assets"}</title>
      </Head>
      <AssetsPage.assets.component {...props} />
    </>
  )
}
