/* @my/ui is wrapper for tamagui. Any component in tamagui can be imported through @my/ui
use result = await API.get(url) or result = await API.post(url, data) to send requests
API.get/API.post will return a PendingResult, with properties like isLoaded, isError and a .data property with the result
if you call paginated apis, you will need to wait for result.isLoaded and look into result.data.items, since result.data is an object with the pagination.
Paginated apis return an object like: {"itemsPerPage": 25, "items": [...], "total": 20, "page": 0, "pages": 1}
*/

import { Protofy, Text, VStack, Image, HCenterStack, Page, UIWrapLib, UIWrap, SSR, useEdit, withSession, Center, GithubIcon, DiscordIcon, TwitterIcon, API } from 'protolib'
import React from 'react'
import Theme from 'visualui/src/components/Theme'
import { DefaultLayout } from '../../../layout/DefaultLayout'

const isProtected = Protofy("protected", false)
const { actionFetch } = API;

const PageComponent = (props) => {
  return (
    <Page>
      <DefaultLayout title="Protofy" description="Made with love from Barcelona">
        <Center height="100%" width="100%" paddingTop="60px" paddingHorizontal="20px">
          <VStack height="100%" width="100%" maxWidth="900px" ai="center" jc="center">
            <VStack ai="center" gap="30px" jc="center" width={"100%"} height="fit-content">
              <Center height={"fit-content"} width={"fit-content"}>
                <Image resizeMode='contain' url='https://raw.githubusercontent.com/Protofy-xyz/Protofy/assets/icon-protofy.png' />
              </Center>
              <VStack
                ai="center" jc="center" width={"100%"} height="fit-content"
              >
                <Text
                  fontFamily="$heading"
                  fontSize="$12"
                  fontWeight="700"
                >
                  About us
                </Text>
                <Text
                  fontFamily="$heading"
                  fontSize="$7"
                  opacity={0.5}
                  fontWeight="300"
                >
                  protofy.xyz
                </Text>
              </VStack>
            </VStack>
            <Text
              fontFamily="$body"
              fontSize="$6"
              textAlign="center"
              marginTop="20px"
            >
              Protofy is a Full-Stack, batteries included Low-Code enabled web/app and IoT system with an API system and real time messaging.
            </Text>
            <HCenterStack gap="20px" marginVertical="50px">
              <GithubIcon height="50px" width="50px" />
              <DiscordIcon height="50px" width="50px" />
              <TwitterIcon height="50px" width="50px" />
            </HCenterStack>
          </VStack>
        </Center>
      </DefaultLayout>
    </Page >)
}

const cw = UIWrapLib('@my/ui')

export default {
  route: Protofy("route", "{{route}}"),
  component: (props) => useEdit(
    () => PageComponent(props), {
    ...UIWrap("DefaultLayout", DefaultLayout, "../../../layout/DefaultLayout"),
    ...cw("Theme", Theme)
  }, "/packages/app/bundles/custom/pages/{{name}}.tsx"),
  getServerSideProps: SSR(async (context) => withSession(context, isProtected ? Protofy("permissions", []) : undefined))
}