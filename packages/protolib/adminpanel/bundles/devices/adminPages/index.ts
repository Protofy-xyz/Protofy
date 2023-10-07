import DevicePage, {getServerSideProps} from '../../../next/devices'

export default {
    'admin/devices/**': {component: DevicePage, getServerSideProps: getServerSideProps},
}