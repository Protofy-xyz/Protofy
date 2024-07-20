import { useSession } from 'protolib/dist/lib/Session'
import Custom404 from './404'
import { useSearchParams } from 'solito/navigation';
import electronPages from 'app/bundles/electronPages'
import React from 'react'

export async function getStaticPaths() {
  const config = {
    paths: Object.keys(electronPages).filter(x => !x.includes('*')).map((x) => {
      return {
        params: { name: x.split('/') }
      }
    }),
    fallback: false
  }
  console.log('precompile config: ', config)
  return config
}

export async function getStaticProps(context: any) {
  return {
    props: {}
  };
}

const getRoute = (routePath: string | string[] | undefined) => Object.keys(electronPages).find(key => {
  if (!routePath) return false
  const path = Array.isArray(routePath) ? (routePath as string[]) : [routePath as string]
  const route = key.split('/')
  let valid = true
  for (var i = 0; i < path.length && valid; i++) {
    if (route[i] == '**') {
      return true
    }
    if (route[i] != '*' && route[i] != path[i]) {
      valid = false
    }
  }
  return valid
})

export default function BundlePage(props: any) {
  useSession(props.pageSession)


  const searchParams = useSearchParams();
  const query = Object.fromEntries(searchParams.entries());
  const route = getRoute(query.name);
  if (!route) return <Custom404 />

  const page = (electronPages as any)[route]
  return React.createElement(page.component, { ...props })
}