import ProtolibObjects from 'protolib/bundles/objects'
import {PageModel} from '@bundles/pages/pagesSchemas'
import { APIModel } from '@bundles/apis/APISchemas'
import LocalObjects from '../objects'

export const Objects = {
    ...ProtolibObjects,
    ...LocalObjects,
    page: PageModel,
    api: APIModel
}
