import FilesPage, {getServerSideProps} from '../../../adminpanel/next/files'

export default {
    'admin/files/**': {component: FilesPage, getServerSideProps: getServerSideProps},
}