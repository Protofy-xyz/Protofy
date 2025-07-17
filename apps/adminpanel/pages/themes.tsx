import ThemesPage from '@extensions/themes/adminPages'
import Head from 'next/head'
import { SiteConfig } from 'app/conf'

export default function Page(props:any) {
  const projectName = SiteConfig.projectName

  return (
    <>
      <Head>
        <title>{projectName + " - Themes"}</title>
      </Head>
      <ThemesPage.themes.component {...props} />
    </>
  )
}