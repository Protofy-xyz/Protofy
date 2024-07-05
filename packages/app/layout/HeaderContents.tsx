import { HeaderContents as ProtoHeaderContents, HeaderContentsProps } from 'protolib/components/layout/HeaderContents'
import { HeaderLink } from 'protolib/components/HeaderLink'
import { Tinted } from 'protolib/components/Tinted'
import { Text } from 'tamagui'
import { Paragraph, XStack } from '@my/ui';
import dynamic from 'next/dynamic';
import { SiteConfig } from '../conf';

export const HeaderContents = (props: HeaderContentsProps & { headerTitle?: string }) => {
  //@ts-ignore
  const SessionInfo = dynamic(() => import('./SessionInfo'), { ssr: false })

  return <ProtoHeaderContents
    logo={<Paragraph mr={"$2"}><Text fontSize={20} fontWeight={"400"}>{props.headerTitle ?? 'Protofy'}</Text></Paragraph>}
    rightArea={<XStack ai="center">
      {/* todo: publish button */}
      {props.topBar}
      <XStack $xs={{ display: 'none' }}>
        <Tinted>
          <HeaderLink id="header-session-doc" href={SiteConfig.useLocalDocumentation ? "/documentation" : "https://protofy.xyz/documentation"}>Docs</HeaderLink>
          {
            <SessionInfo />
          }
        </Tinted>
      </XStack>
      {/* <XStack>
          <ConnectionIndicator />
        </XStack> */}
    </XStack>}
    {...props}
  />
}


