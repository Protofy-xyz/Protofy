import {HeaderContents as ProtoHeaderContents, HeaderContentsProps, HeaderLink, Session} from 'protolib'
import {Text} from 'tamagui'
import { useAtom } from 'jotai'

export const HeaderContents = (props: HeaderContentsProps) => {
  const [session] = useAtom(Session);
  return <ProtoHeaderContents 
      logo={<Text>Protofy</Text>} 
      rightArea={session.loggedIn?<HeaderLink href="/profile">{session.user.id.split('@')[0]}</HeaderLink>:<HeaderLink href="/auth/login">Login</HeaderLink>}
      {...props} 
  />
}