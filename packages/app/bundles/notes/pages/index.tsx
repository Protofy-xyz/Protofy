import { ListNotes, getServerSideProps as getServerSidePropsNotesList } from "./list"
import { ViewNote, getServerSideProps as getServerSidePropsNotesView } from "./view"

export default {
    'notes': {component: ListNotes, getServerSideProps: getServerSidePropsNotesList},
    'notes/*': {component: ViewNote, getServerSideProps: getServerSidePropsNotesView}
} as any