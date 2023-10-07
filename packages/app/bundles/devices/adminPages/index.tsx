import DevicePage, {getServerSideProps} from 'protolib/adminpanel/next/devices'


export default {
    'admin/devices/**': {component: DevicePage, getServerSideProps: getServerSideProps},
}