import FilesPage, {getServerSideProps} from '../../../next/files'

export default {
    'admin/files/**': {component: FilesPage, getServerSideProps: getServerSideProps},
}