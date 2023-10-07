import FilesPage, {getServerSideProps} from 'protolib/adminpanel/next/files'

export default {
    'admin/files/**': {component: FilesPage, getServerSideProps: getServerSideProps},
}