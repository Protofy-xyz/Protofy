import FilesPage from 'protolib/bundles/files/adminPages'
import Head from 'next/head'

export default function Page(props:any) {
  return (
    <>
      <Head>
        <title>Protofy - Files</title>
      </Head>
      <FilesPage.files.component {...props} />
    </>
  )
}
