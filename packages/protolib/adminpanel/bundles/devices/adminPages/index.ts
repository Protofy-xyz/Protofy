import DevicePage, {getServerSideProps} from '../../../next/devices'
import deviceCorePage from '../devicecores/devicecoresPage';

export default {
    'admin/devices/**': {component: DevicePage, getServerSideProps: getServerSideProps},
    'admin/deviceCores/**': deviceCorePage,
}