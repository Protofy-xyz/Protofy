import { HeaderContents as ProtoHeaderContents, HeaderContentsProps } from './base/HeaderContents'
import { HeaderLink } from 'protolib/dist/components/HeaderLink'
import { Tinted } from 'protolib/dist/components/Tinted'
import { Text } from 'tamagui'
import { Paragraph, XStack } from '@my/ui';
import dynamic from 'next/dynamic';
import { SiteConfig } from '../conf';

export const HeaderContents = (props: HeaderContentsProps & { headerTitle?: string }) => {
  //@ts-ignore
  const SessionInfo = dynamic(() => import('./SessionInfo'), { ssr: false })

  const projectName = SiteConfig.projectName ?? 'Protofy'

  return <ProtoHeaderContents
    logo={<Paragraph marginRight={"$2"}><Text fontSize={20} fontWeight={"400"}>{props.headerTitle ?? projectName}</Text></Paragraph>}
    rightArea={<XStack alignItems="center">
      {/* todo: publish button */}
      {props.topBar}
      <XStack $xs={{ display: 'none' }}>
        <Tinted>
          {SiteConfig.documentationVisible ? <HeaderLink id="header-session-doc" href={SiteConfig.useLocalDocumentation ? "/documentation" : "https://protofy.xyz/documentation"}>Docs</HeaderLink> : <></>}
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


