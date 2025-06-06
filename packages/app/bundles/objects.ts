import ProtolibObjects from 'protolib/bundles/objects'
import PageModel from '@bundles/pages/pagesSchemas'
import LocalObjects from '../objects'

export const Objects = {
    ...ProtolibObjects,
    ...LocalObjects,
    page: PageModel
}
