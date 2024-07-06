/* @my/ui is wrapper for tamagui. Any component in tamagui can be imported through @my/ui
use result = await API.get(url) or result = await API.post(url, data) to send requests
API.get/API.post will return a PendingResult, with properties like isLoaded, isError and a .data property with the result
if you call paginated apis, you will need to wait for result.isLoaded and look into result.data.items, since result.data is an object with the pagination.
Paginated apis return an object like: {"itemsPerPage": 25, "items": [...], "total": 20, "page": 0, "pages": 1}
*/

import { Text } from 'protolib/components/Text';
import { VStack } from 'protolib/components/VStack';
import { Image } from 'protolib/components/Image';
import { HCenterStack } from 'protolib/components/HCenterStack';
import { Page } from 'protolib/components/Page';
import { withSession } from 'protolib/lib/Session';
import { Center } from 'protolib/components/Center';
import { GithubIcon } from 'protolib/components/icons/GithubIcon';
import { DiscordIcon } from 'protolib/components/icons/DiscordIcon';
import { TwitterIcon } from 'protolib/components/icons/TwitterIcon';
import { Protofy, API } from 'protobase'
import { useComposedState } from 'protolib/lib/useComposedState'
import { UIWrapLib, UIWrap } from 'protolib/visualui/visualuiWrapper'
import { useEditor } from 'protolib/visualui/useEdit'
import { SSR } from 'protolib/lib/SSR'
import React, { useState } from 'react'
import Theme from 'visualui/src/components/Theme'
import { DefaultLayout } from '../../../layout/DefaultLayout'
import { context } from 'app/bundles/uiContext'
import { useRouter } from 'solito/navigation'
import { Objects } from 'app/bundles/objects'

const isProtected = Protofy("protected", false)
Protofy("pageType", "about")

const PageComponent = ({ currentView, setCurrentView, ...props }: any) => {
  const { cs, states } = useComposedState();
  
  const router = useRouter();
  context.onRender(() => {

  });
  return (
    <Page>
      <DefaultLayout title="Protofy" description="Made with love from Barcelona">
        <Center height="90vh" width="100%" paddingHorizontal="20px">
          <VStack height="100%" gap="20px" width="100%" maxWidth="900px" ai="center" jc="center">
            <Image height={120} width={150} resizeMode='cover' url='/logo.png' />
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
  component: (props) => {
    const [currentView, setCurrentView] = useState("default");

    return useEditor(
      <PageComponent currentView={currentView} setCurrentView={setCurrentView} {...props} />,
      {
          path: "/packages/app/bundles/custom/pages/{{name}}.tsx",
          context: {
            currentView: currentView,
            setCurrentView: setCurrentView,
            Objects: Objects
          },
          components: {
            ...UIWrap("DefaultLayout", DefaultLayout, "../../../layout/DefaultLayout"),
            ...cw("Theme", Theme)
          }
      }, 
    )
  },
  getServerSideProps: SSR(async (context) => withSession(context, isProtected ? Protofy("permissions", []) : undefined))
}