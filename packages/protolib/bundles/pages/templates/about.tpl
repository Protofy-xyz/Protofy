/* @my/ui is wrapper for tamagui. Any component in tamagui can be imported through @my/ui
use result = await API.get(url) or result = await API.post(url, data) to send requests
API.get/API.post will return a PendingResult, with properties like isLoaded, isError and a .data property with the result
if you call paginated apis, you will need to wait for result.isLoaded and look into result.data.items, since result.data is an object with the pagination.
Paginated apis return an object like: {"itemsPerPage": 25, "items": [...], "total": 20, "page": 0, "pages": 1}
*/

import { Protofy, Text, VStack, Image, HCenterStack, Page, UIWrapLib, UIWrap, SSR, useEditor, withSession, Center, GithubIcon, DiscordIcon, TwitterIcon, API } from 'protolib'
import React from 'react'
import Theme from 'visualui/src/components/Theme'
import { DefaultLayout } from '../../../layout/DefaultLayout'
import { uiContext } from "app/bundles/visualuiContext";

const isProtected = Protofy("protected", false)

const PageComponent = (props) => {
  return (
    <Page>
      <DefaultLayout title="Protofy" description="Made with love from Barcelona">
        <Center height="90vh" width="100%" paddingHorizontal="20px">
          <VStack height="100%" gap="20px" width="100%" maxWidth="900px" ai="center" jc="center">
            <Image height={120} width={120} resizeMode='contain' url='https://raw.githubusercontent.com/Protofy-xyz/Protofy/assets/icon-protofy.png' />
            <Text
              fontFamily="$heading"
              fontSize="$12"
              fontWeight="700"
            >
              About Us
            </Text>
            <Text
              fontFamily="$body"
              fontSize="$6"
              textAlign="center"
              fontWeight="200"
            >
              Protofy is a Full-Stack, batteries included Low-Code enabled web/app and IoT system with an API system and real time messaging.
            </Text>
            <HCenterStack gap="20px" marginTop="40px">
              <GithubIcon height="35px" width="35px" />
              <DiscordIcon height="35px" width="35px" />
              <TwitterIcon height="35px" width="35px" />
            </HCenterStack>
          </VStack>
        </Center>
      </DefaultLayout>
    </Page >)
}

const cw = UIWrapLib('@my/ui')

export default {
  route: Protofy("route", "{{route}}"),
  component: (props) => useEditor(
    () => PageComponent(props),
    {
        path: "/packages/app/bundles/custom/pages/{{name}}.tsx",
        components: {
          ...UIWrap("DefaultLayout", DefaultLayout, "../../../layout/DefaultLayout"),
          ...cw("Theme", Theme)
        }
    }, 
  ),
  getServerSideProps: SSR(async (context) => withSession(context, isProtected ? Protofy("permissions", []) : undefined))
}