import EventsListPage, {serverExecuted} from './list'

export default {
    'admin/events': {component: EventsListPage, getServerSideProps: serverExecuted},
}