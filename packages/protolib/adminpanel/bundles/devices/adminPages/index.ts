import DevicePage, { getServerSideProps } from '../../../next/devices'
import deviceCorePage from '../devicecores/devicecoresPage';
import deviceBoardPage from '../deviceBoards/deviceBoardsPage';
import deviceDefinitionsPage from '../deviceDefinitions/deviceDefinitionsPage';
import devicesPage from '../devices/devicesPage';

export default {
  'admin/device-test/**': { component: DevicePage, getServerSideProps: getServerSideProps }, 
  'admin/devices/**': devicesPage,
  'admin/deviceCores/**': deviceCorePage,
  'admin/deviceBoards/**': deviceBoardPage,
  'admin/deviceDefinitions/**': deviceDefinitionsPage
}