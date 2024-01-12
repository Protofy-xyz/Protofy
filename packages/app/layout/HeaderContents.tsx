import { HeaderContents as ProtoHeaderContents, HeaderContentsProps, HeaderLink, useSession, ConnectionIndicator, Tinted } from 'protolib'
import { Text } from 'tamagui'
import { useAtom } from 'jotai'
import { Paragraph, Theme, XStack } from '@my/ui';
import { Cloud, CloudOff } from '@tamagui/lucide-icons';

export const HeaderContents = (props: HeaderContentsProps & { headerTitle?: string }) => {
  const [session] = useSession();

  return <ProtoHeaderContents
    logo={<Paragraph mr={"$2"}><Text fontSize={20} fontWeight={"400"}>{props.headerTitle ?? 'Protofy'}</Text></Paragraph>}
    rightArea={<XStack ai="center">
      {props.topBar}
      <XStack $xs={{ display: 'none' }}><Tinted>{session.loggedIn ? <HeaderLink id="header-session-user-id" href="/profile">{session.user.id}</HeaderLink> : <HeaderLink href="/auth/login" id="header-login-link" >Login</HeaderLink>}</Tinted></XStack>
      {/* <XStack>
          <ConnectionIndicator />
        </XStack> */}
    </XStack>}
    {...props}
  />
}