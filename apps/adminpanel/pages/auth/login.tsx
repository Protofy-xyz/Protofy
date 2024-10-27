import { SignInPage } from 'app/features/auth/login'
import Head from 'next/head'
import { getSessionCookie } from 'protolib/lib/Session'
import { NextPageContext } from 'next'
import { SSR } from 'protolib/lib/SSR'
import { SiteConfig } from 'app/conf'

export default function Page(props:any) {
  const projectName = SiteConfig.projectName
  return (
    <>
      <Head>
        <title>{projectName + " - Sign In"}</title>
      </Head>
      <SignInPage {...props} />
    </>
  )
}

export const getServerSideProps = SSR(async (context:NextPageContext) => {
  const sessionCookie = await getSessionCookie(context.req?.headers.cookie)
  if(sessionCookie) {
    return {
      redirect: {
        permanent: false,
        destination: "/workspace/"
      }
    }
  }
  
  return { props: {}}
})

