export * from './AdminPage'
import {SSR as _SSR} from 'app/conf' 
import { NextPageContext } from 'next'
import { API, withSession } from 'protolib'

export function DataSSR(initialItemsUrl?, allowdUserTypes=['admin'], props={}) {
    return _SSR(async (context:NextPageContext) => {
        return withSession(context, allowdUserTypes, {
          workspace: await API.get('/adminapi/v1/workspaces'),
          ...(initialItemsUrl ? {
            initialItems: await API.get(initialItemsUrl),
          } : {}),
          ...props
        })
    })
}

export function PaginatedDataSSR(initialItemsUrl ,rowsPerPage=20, initialPage=0, allowdUserTypes=['admin'], props={}) {
  return _SSR(async (context:NextPageContext) => {
    return withSession(context, allowdUserTypes, {
      workspace: await API.get('/adminapi/v1/workspaces'),
      initialItems: await API.get(initialItemsUrl+'?itemsPerPage='+(context.query.page??rowsPerPage+'&page='+(context.query.page??initialPage))),
      rowsPerPage: context.query.itemsPerPage??rowsPerPage,
      initialPage: context.query.page??initialPage,
      ...props
    })
  })
}