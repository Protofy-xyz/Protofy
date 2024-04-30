import { HeaderContents as ProtoHeaderContents, HeaderContentsProps, HeaderLink, HeadAnchor, useSession, ConnectionIndicator, Tinted } from 'protolib'
import { Text } from 'tamagui'
import { useAtom } from 'jotai'
import { Paragraph, Theme, XStack } from '@my/ui';
import { Cloud, CloudOff } from '@tamagui/lucide-icons';
import dynamic from 'next/dynamic';
import { SiteConfig } from '../conf';

export const HeaderContents = (props: HeaderContentsProps & { headerTitle?: string }) => {
  //@ts-ignore
  const SessionInfo = dynamic(() => import('./SessionInfo'), { ssr: false })

  return <ProtoHeaderContents
    logo={<Paragraph mr={"$2"}><Text fontSize={20} fontWeight={"400"}>{props.headerTitle ?? 'Protofy'}</Text></Paragraph>}
    rightArea={<XStack ai="center">
      {props.topBar}
      <XStack $xs={{ display: 'none' }}>
        <Tinted>
          <HeaderLink id="header-session-doc" href={SiteConfig.useLocalDocumentation ? "/documentation":"https://protofy.xyz/documentation"}>Docs</HeaderLink>
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


