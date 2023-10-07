import DatabasePage, {getServerSideProps} from '../../../next/database'

export default {
    'admin/database/**': {component: DatabasePage, getServerSideProps: getServerSideProps},
}