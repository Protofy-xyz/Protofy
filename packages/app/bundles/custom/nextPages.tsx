import {Protofy} from 'protolib/base'
import home from './pages/home';
import notFound from './pages/notFound';

export default Protofy("pages", {
    ["/"]: home,
    "notFound": notFound
})