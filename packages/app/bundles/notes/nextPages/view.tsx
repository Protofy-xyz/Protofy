import { withSession, API } from 'protolib'
import { NextPageContext } from 'next'
import {useRouter} from 'next/router'
import { ViewNote } from '../components/ViewNote'

export function ViewNotePage({ initialElement}) {
    const router = useRouter()
    return <ViewNote initialElement={initialElement} id={router.asPath.split('/')[2]} />
}

export const getServerSideProps = async (context: NextPageContext) => {
    return withSession(context, undefined, {
        initialElement: await API.get('/api/v1/notes/'+context.query.name[1])
    }
)}
