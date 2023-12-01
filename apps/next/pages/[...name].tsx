import { NextPageContext } from 'next'
import { useSession, withSession, SSR } from 'protolib'
import Custom404 from './404'
import { useRouter } from 'next/router'
import nextPages from 'app/bundles/nextPages'
import React from 'react'

const getRoute = (routePath: string | string[] | undefined) => Object.keys(nextPages).find(key => {
  if(!routePath) return false
  const path = Array.isArray(routePath) ? (routePath as string[]) : [routePath as string]
  const route = key.split('/')
  let valid = true
  for(var i=0;i<path.length && valid;i++) {
    if(route[i] == '**') {
      return true
    }
    if(route[i] != '*' && route[i] != path[i]) {
      valid = false
    }
  }
  return valid
})

export default function BundlePage(props: any) {
  useSession(props.pageSession)
  const router = useRouter();
  const route = getRoute(router.query.name)
  if(!route) return <Custom404 />

  const page = nextPages[route]
  return React.createElement(page.component, {...props})
}

export const getServerSideProps = SSR(async (context: NextPageContext) => {
  const route = getRoute(context.query.name)

  if(!route) { //has no exposed pages
    return withSession(context)
  }

  const page = nextPages[route]

  if(page.getServerSideProps) {
    const ret = await page.getServerSideProps(context)
    //console.log('going to route: ', route, page, ret)
    return ret
  }

  return withSession(context)
})