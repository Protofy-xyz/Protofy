import DevicePage, { getServerSideProps } from '../../../adminpanel/next/devices'
import deviceCorePage from '../devicecores/devicecoresPage';
import deviceBoardPage from '../deviceBoards/deviceBoardsPage';
import deviceDefinitionsPage from '../deviceDefinitions/deviceDefinitionsPage';
import devicesPage from '../devices/devicesPage';
import deviceSdksPage from '../deviceSdks/deviceSdksPage';

export default {
  'admin/device-test/**': { component: DevicePage, getServerSideProps: getServerSideProps },
  'admin/devices/**': devicesPage,
  'admin/deviceSdks/**': deviceSdksPage,
  'admin/deviceCores/**': deviceCorePage,
  'admin/deviceBoards/**': deviceBoardPage,
  'admin/deviceDefinitions/**': deviceDefinitionsPage
}