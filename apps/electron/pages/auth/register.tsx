import { SignInPage } from 'app/features/auth/register'
import Head from 'next/head'

export default function Page(props:any) {
  return (
    <>
      <Head>
        <title>Protofy - Sign Up</title>
      </Head>
      <SignInPage {...props} />
    </>
  )
}