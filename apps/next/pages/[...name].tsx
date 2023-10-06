import Notes from 'app/features/notes'
import Head from 'next/head'
import { SSR } from 'app/conf'
import { NextPageContext } from 'next'
import { API, useSession, withSession } from 'protolib'
import Error from 'next/error'
import Custom404 from './404'
import { useRouter } from 'next/router'
import nextPages from 'app/bundles/nextPages'
import React from 'react'

export default function NotesPage(props: any) {
  useSession(props.pageSession)
  const router = useRouter();
  const { name } = router.query;

  if (!name || !name.length) return <Custom404 />
  const objectName = name[0]
  const pages = (nextPages as any)[objectName]
  if (!pages) return <Custom404 />

  const pageComponent = pages['list']

  if (!pageComponent) return <Custom404 />
  return React.createElement(pageComponent, props)
}

export const getServerSideProps = SSR(async (context: NextPageContext) => {
  const objectName = context.query.name ? context.query.name[0] : ''
  const getNextPage = (nextPages as any)[objectName]
  if(!getNextPage) { //has no exposed pages
    return withSession(context)
  }

  return withSession(context, undefined, {
    initialElements: await API.get('/api/v1/'+objectName)
  })
})