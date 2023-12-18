import { SignInPage } from 'app/features/auth/login'
import Head from 'next/head'

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

