import {Protofy} from 'protolib/base'
import screen from './pages/screen';
import notFound from './pages/notFound';

export default Protofy("pages", {
    ["/"]: screen,
    "notFound": notFound
})