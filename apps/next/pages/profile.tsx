import { Profile } from 'app/features/profile'
import Head from 'next/head'
import { NextPageContext } from 'next'
import { useSession } from 'protolib/lib/useSession'
import { withSession } from 'protolib/lib/Session'
import {SSR} from 'protolib/lib/SSR'
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