import { ListNotesPage, getServerSideProps as getServerSidePropsNotesList } from "./list"
import { ViewNotePage, getServerSideProps as getServerSidePropsNotesView } from "./view"

export default {
    'notes': {component: ListNotesPage, getServerSideProps: getServerSidePropsNotesList},
    'notes/*': {component: ViewNotePage, getServerSideProps: getServerSidePropsNotesView}
} as any