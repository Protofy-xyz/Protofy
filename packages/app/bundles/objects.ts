import ProtolibObjects from 'protolib/bundles/objects'
import {PageModel} from '@extensions/pages/pagesSchemas'
import { APIModel } from '@extensions/apis/APISchemas'
import LocalObjects from '../objects'

export const Objects = {
    ...ProtolibObjects,
    ...LocalObjects,
    page: PageModel,
    api: APIModel
}
