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
  console.log('route: ', route,router.query.name)

  //if no route, but router is already available, it means the route truly doesnt exist
  if(!route && router.query.name) return <Custom404 />
  //if no route and no router, it means we are still loading, just wait
  if(!route) return <></>

  const page = (nextPages as any)[route]
  return React.createElement(page.component, {...props})
}