import { NextPageContext } from 'next'
import { useSession, withSession, SSR } from 'protolib'
import Custom404 from './404'
import { useRouter } from 'next/router'
import electronPages from 'app/bundles/electronPages'
import React from 'react'

const getRoute = (routePath: string | string[] | undefined) => Object.keys(electronPages).find(key => {
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

  const page = (electronPages as any)[route]
  return React.createElement(page.component, {...props})
}