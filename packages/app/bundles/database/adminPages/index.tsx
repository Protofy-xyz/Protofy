import DatabasePage, {getServerSideProps} from 'protolib/adminpanel/next/database'

export default {
    'admin/database/*': {component: DatabasePage, getServerSideProps: getServerSideProps},
}