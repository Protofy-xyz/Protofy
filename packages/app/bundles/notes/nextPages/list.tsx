import { withSession, API } from 'protolib'
import {NextPageContext} from 'next'
import { ListNotes } from '../components/ListNotes'

export function ListNotesPage ({ initialElements }) {
  return <ListNotes initialElements={initialElements} />
}

export const getServerSideProps = async (context: NextPageContext) => {
  return withSession(context, undefined, {
    initialElements: await API.get('/api/v1/notes')
  })
}