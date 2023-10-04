import Notes from 'app/features/notes'
import Head from 'next/head'
import { SSR } from 'common'
import { NextPageContext } from 'next'
import { API, withSession } from 'protolib'

export default function NotesPage(props:any) {
  return (
    <>
      <Head>
        <title>Protofy - Notes</title>
      </Head>
      <Notes {...props} />
    </>
  )
}

export const getServerSideProps = SSR(async () => {
    return { props: { initialNotes: await API.get('/api/v1/notes') } }
})