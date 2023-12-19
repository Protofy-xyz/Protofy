import { SignInPage } from 'app/features/auth/login'
import Head from 'next/head'
import { hasSessionCookie, SSR } from 'protolib'
import { NextPageContext } from 'next'

export default function Page(props:any) {
  return (
    <>
      <Head>
        <title>Protofy - Sign In</title>
      </Head>
      <SignInPage {...props} />
    </>
  )
}
