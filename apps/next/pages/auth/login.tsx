import { SignInPage } from 'app/features/auth/login'
import Head from 'next/head'
import { hasSessionCookie } from 'protolib/dist/lib/Session'
import { NextPageContext } from 'next'
import { SSR } from 'protolib/dist/lib/SSR'
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
  if(hasSessionCookie(context.req?.headers.cookie)) {
    return {
      redirect: {
        permanent: false,
        destination: "/"
      }
    }
  }
  
  return { props: {}}
})

