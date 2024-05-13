import DatabasesPage from 'protolib/bundles/databases/adminPages'
import Head from 'next/head'

export default function Page(props:any) {
  const PageComponent = DatabasesPage['databases/view'].component
  return (
    <>
      <Head>
        <title>Protofy - View Database</title>
      </Head>
      <PageComponent {...props} />
    </>
  )
}

export const getServerSideProps = DatabasesPage['databases/view'].getServerSideProps