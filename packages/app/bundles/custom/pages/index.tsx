import {Protofy} from 'protolib/base'
import home from './home';
import notFound from './notFound';

export default Protofy("pages", {
    ["/"]: home,
    "notFound": notFound
})