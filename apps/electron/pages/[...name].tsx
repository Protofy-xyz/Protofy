import { NextPageContext } from 'next'
import { useSession, withSession, SSR } from 'protolib'
import Custom404 from './404'
import { useRouter } from 'next/router'
import electronPages from 'app/bundles/electronPages'
import React from 'react'

export async function getStaticPaths() {
  const config = {
    paths: Object.keys(electronPages).filter(x => !x.includes('*')).map((x) => {
      return {
        params: {name: x.split('/')}
      }
    }),
    fallback: false
  }
  console.log('precompile config: ', config)
  return config
}

export async function getStaticProps(context:any) {
  return {
      props: {}
  };
}

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