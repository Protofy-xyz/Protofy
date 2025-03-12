import BoardsPage from 'protolib/bundles/boards/adminPages'
import Head from 'next/head'
import { SiteConfig } from 'app/conf'

export default function Page(props:any) {
  const projectName = SiteConfig.projectName

  return (
    <>
      <Head>
        <title>{projectName + " - Boards"}</title>
      </Head>
      <BoardsPage.boards.component {...props} />
    </>
  )
}

export const getServerSideProps = BoardsPage.boards.getServerSideProps