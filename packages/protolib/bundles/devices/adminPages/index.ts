import DevicePage, { getServerSideProps } from '../../../adminpanel/next/devices'
import deviceCorePage from '../devicecores/devicecoresPage';
import deviceBoardPage from '../deviceBoards/deviceBoardsPage';
import deviceDefinitionsPage from '../deviceDefinitions/deviceDefinitionsPage';
import devicesPage from '../devices/devicesPage';
import deviceSdksPage from '../deviceSdks/deviceSdksPage';

export default {
  'device-test/**': { component: DevicePage, getServerSideProps: getServerSideProps },
  'devices/**': devicesPage,
  'deviceSdks/**': deviceSdksPage,
  'deviceCores/**': deviceCorePage,
  'deviceBoards/**': deviceBoardPage,
  'deviceDefinitions/**': deviceDefinitionsPage
}