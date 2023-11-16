export * from './AdminPage'
import {SSR as _SSR} from 'app/conf' 
import { NextPageContext } from 'next'
import { API, withSession, getURLWithToken } from 'protolib'
import { parse } from 'cookie';

export function DataSSR(sourceUrl, allowdUserTypes=['admin', 'editor'], props={}) {
    return _SSR(async (context:NextPageContext) => {
        return withSession(context, allowdUserTypes, {
          pageState: {
            sourceUrl,
            initialItems: await API.get({url: sourceUrl, ...props}),
            ...props,
          }
        })
    })
}

export function PaginatedDataSSR(sourceUrl: string|Function,allowdUserTypes=['admin', 'editor'], dataProps:any={}, extraData:any={}, workspaces:any=[]) {
  return _SSR(async (context:NextPageContext) => {
    const _dataProps = {
      itemsPerPage: parseInt(context.query.itemsPerPage as string) ? parseInt(context.query.itemsPerPage as string) : '',
      page: parseInt(context.query.page as string, 10) ? parseInt(context.query.page as string, 10) : '',
      search: context.query.search ?? '',
      orderBy: context.query.orderBy ?? '',
      orderDirection: context.query.orderDirection ?? '',
      view: context.query.view?? '',
      item: context.query.item?? '',
      editFile: context.query.editFile??'',
      ...(typeof dataProps === "function"? await dataProps(context) : dataProps),
    }
    const _sourceUrl = typeof sourceUrl === 'function' ? sourceUrl(context) : sourceUrl

    return withSession(context, allowdUserTypes, {
      sourceUrl: _sourceUrl,
      initialItems: await API.get({url: getURLWithToken(_sourceUrl, context), ..._dataProps}),
      itemData: context.query.item ? await API.get(getURLWithToken(_sourceUrl+'/'+context.query.item, context)) : '',
      route: context.query.name,
      extraData: {...(typeof extraData === "function"? await extraData(context) : extraData)},
      pageState: {
        ..._dataProps,
      }
    })
  })
}