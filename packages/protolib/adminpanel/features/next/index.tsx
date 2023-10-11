export * from './AdminPage'
import {SSR as _SSR} from 'app/conf' 
import { NextPageContext } from 'next'
import { API, withSession } from 'protolib'

export function SSR(initialItemsUrl?, allowdUserTypes=['admin'], props={}) {
    return _SSR(async (context:NextPageContext) => {
        return withSession(context, allowdUserTypes, {
          workspace: await API.get('/adminapi/v1/workspaces'),
          ...(initialItemsUrl ? {
            initialItems: await API.get(initialItemsUrl)
          } : {}),
          ...props
        })
    })
}