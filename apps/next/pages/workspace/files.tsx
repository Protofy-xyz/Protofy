import FilesPage from 'protolib/bundles/files/adminPages'
import Head from 'next/head'
import { useRedirectToEnviron } from 'protolib'

export default function Page(props:any) {
  useRedirectToEnviron()
  return (
    <>
      <Head>
        <title>Protofy - Files</title>
      </Head>
      <FilesPage.files.component {...props} />
    </>
  )
}

export const getServerSideProps = FilesPage.files.getServerSideProps
