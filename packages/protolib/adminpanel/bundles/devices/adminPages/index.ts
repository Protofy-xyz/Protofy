import DevicePage, { getServerSideProps } from '../../../next/devices'
import deviceCorePage from '../devicecores/devicecoresPage';
import deviceBoardPage from '../deviceBoards/deviceBoardsPage';
import deviceDefinitionsPage from '../deviceDefinitions/deviceDefinitionsPage';

export default {
  'admin/devices/**': { component: DevicePage, getServerSideProps: getServerSideProps },
  'admin/deviceCores/**': deviceCorePage,
  'admin/deviceBoards/**': deviceBoardPage,
  'admin/deviceDefinitions/**': deviceDefinitionsPage
}