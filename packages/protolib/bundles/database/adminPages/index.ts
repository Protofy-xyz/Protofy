import DatabasePage, {getServerSideProps} from '../../../adminpanel/next/database'

export default {
    'admin/database/**': {component: DatabasePage, getServerSideProps: getServerSideProps},
}