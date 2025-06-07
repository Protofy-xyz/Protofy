import ProtolibObjects from 'protolib/bundles/objects'
import {PageModel} from '@extensions/pages/pagesSchemas'
import { APIModel } from '@extensions/apis/APISchemas'
import { BoardModel } from '@extensions/boards/boardsSchemas'
import LocalObjects from '../objects'

export const Objects = {
    ...ProtolibObjects,
    ...LocalObjects,
    page: PageModel,
    api: APIModel
    board: BoardModel
}
