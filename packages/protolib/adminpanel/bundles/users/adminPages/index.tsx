import ListUsersPage, {getServerSideProps} from './list'

export default {
    'admin/users': {component: ListUsersPage, getServerSideProps: getServerSideProps},
}