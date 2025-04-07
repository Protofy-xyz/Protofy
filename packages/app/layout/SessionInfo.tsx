import { useSession } from "protolib/lib/useSession";
import { HeaderLink } from 'protolib/components/HeaderLink';

export default function SessionInfo() {
    const [session] = useSession();
    return (
      <>
        {
          session.loggedIn ? <></>: <HeaderLink href="/auth/login" id="header-login-link" suppressHydrationWarning={true}>Login</HeaderLink>
        }
      </>
    )
  }