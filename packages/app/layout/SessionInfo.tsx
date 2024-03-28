import { HeaderLink, useSession } from "protolib";

export default function SessionInfo() {
    const [session] = useSession();
    return (
      <>
        {
          session.loggedIn ? <HeaderLink suppressHydrationWarning={true} id="header-session-user-id" href="/profile">{session.user.id}</HeaderLink> : <HeaderLink href="/auth/login" id="header-login-link" suppressHydrationWarning={true}>Login</HeaderLink>
        }
      </>
    )
  }