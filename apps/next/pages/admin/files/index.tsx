import FilesAdmin from 'app/features/admin/files'
import Head from 'next/head'
import { SSR } from '../../../conf'
import { NextPageContext } from 'next'
import { API, redirect, withSession } from 'protolib'
import dynamic from 'next/dynamic'

const FileBrowser = dynamic(() => import('../../../components/FileBrowser'), {
  ssr: false,
})

export default function FilesPage(props:any) {
  return (
    <>
      <Head>
        <title>Protofy - Admin Panel</title>
      </Head>
      <FilesAdmin {...props} FileBrowser={FileBrowser} />
    </>
  )
}

export const getServerSideProps = SSR(async (context:NextPageContext) => {
    return withSession(context, ['admin'])
})