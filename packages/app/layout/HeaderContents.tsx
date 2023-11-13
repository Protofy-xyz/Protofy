import {HeaderContents as ProtoHeaderContents, HeaderContentsProps, HeaderLink, useSession, ConnectionIndicator} from 'protolib'
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
        {session.loggedIn ? <HeaderLink href="/profile">{session.user.id}</HeaderLink>:<HeaderLink href="/auth/login">Login</HeaderLink>}
        <XStack>
          <ConnectionIndicator />
        </XStack>
      </XStack>}
      {...props} 
  />
}