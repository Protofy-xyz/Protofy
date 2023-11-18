import {HeaderContents as ProtoHeaderContents, HeaderContentsProps, HeaderLink, useSession, ConnectionIndicator, Tinted} from 'protolib'
import {Text} from 'tamagui'
import { useAtom } from 'jotai'
import { Theme, XStack } from '@my/ui';
import { Cloud, CloudOff } from '@tamagui/lucide-icons';

export const HeaderContents = (props: HeaderContentsProps) => {
  const [session] = useSession();

  return <ProtoHeaderContents 
      logo={<Text>Protofy</Text>} 
      rightArea={<XStack ai="center">
        {props.topBar }
        <Tinted>{session.loggedIn ? <HeaderLink href="/profile">{session.user.id}</HeaderLink>:<HeaderLink href="/auth/login">Login</HeaderLink>}</Tinted>
        {/* <XStack>
          <ConnectionIndicator />
        </XStack> */}
      </XStack>}
      {...props} 
  />
}