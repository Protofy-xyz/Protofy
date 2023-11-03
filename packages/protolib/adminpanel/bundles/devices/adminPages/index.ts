import DevicePage, { getServerSideProps } from '../../../next/devices'
import deviceCorePage from '../devicecores/devicecoresPage';
import deviceBoardPage from '../deviceBoards/deviceBoardsPage';

export default {
  'admin/devices/**': { component: DevicePage, getServerSideProps: getServerSideProps },
  'admin/deviceCores/**': deviceCorePage,
  'admin/deviceBoards/**': deviceBoardPage
}