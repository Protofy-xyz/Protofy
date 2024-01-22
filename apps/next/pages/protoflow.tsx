import Head from 'next/head'
import { NextPageContext } from 'next'
import { withSession, SSR } from 'protolib'

import { XStack } from "@my/ui"
import { Flows } from 'protolib';

export default function ProfilePage(props: any) {
  return (
    <>
      <Head>
        <title>Protofy - Profile</title>
      </Head>
      <XStack height="100vh" width="100vw">
        <Flows sourceCode={"// Test of sourcecode"} flowId={"test"} />
      </XStack>
    </>
  )
}

export const getServerSideProps = SSR(async (context: NextPageContext) => withSession(context, []))