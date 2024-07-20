import { Profile } from 'app/features/profile'
import Head from 'next/head'
import { NextPageContext } from 'next'
import { useSession, withSession } from 'protolib/dist/lib/Session'
import {SSR} from 'protolib/dist/lib/SSR'
import { SiteConfig } from 'app/conf'

export default function ProfilePage(props:any) {
  useSession(props.pageSession)
  const projectName = SiteConfig.projectName

  return (
    <>
      <Head>
        <title>{projectName + " - Profile"}</title>
      </Head>
      <Profile {...props} />
    </>
  )
}

export const getServerSideProps = SSR(async (context:NextPageContext) => withSession(context, []))