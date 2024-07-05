import { Profile } from 'app/features/profile'
import Head from 'next/head'
import { NextPageContext } from 'next'
import { useSession, withSession } from 'protolib/lib/Session'
import {SSR} from 'protolib/lib/SSR'

export default function ProfilePage(props:any) {
  useSession(props.pageSession)
  return (
    <>
      <Head>
        <title>Protofy - Profile</title>
      </Head>
      <Profile {...props} />
    </>
  )
}

export const getServerSideProps = SSR(async (context:NextPageContext) => withSession(context, []))