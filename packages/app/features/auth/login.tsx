import { FormEvent, useEffect, useRef, useState } from 'react'
import { Button, Input, Paragraph, Spinner, Stack, YStack } from 'tamagui'
import { hasSessionCookie, useSession, useSessionContext, createSession, Auth, Center, HorizontalBox, Notice, Section, SpotLight, ElevatedArea, BackgroundGradient, LogoIcon, PendingResult, getPendingResult, Page} from 'protolib'
import { DefaultLayout } from '../../layout/DefaultLayout'
import Link from 'next/link'
import { ProtofyLogoSVG } from '@my/ui'
import { useRouter } from 'next/router';
import { getErrorMessage } from "@my/ui";

export function SignInPage(props) {
  return (
    <Page>
      <DefaultLayout
        title="Protofy"
        description="Made with love from Barcelona"
        footer={null}>
        <YStack f={1} overflow={'hidden'}>
          <Section containerProps={{ f: 1 }} sectionProps={{ index: 0, p: 0 }}>
            <BackgroundGradient />
            <SpotLight t={'20vh'} />
            <Center>
              <Stack mt={'-10vh'}>
                <ElevatedArea>
                  <HorizontalBox>
                    <SignIn />
                  </HorizontalBox>
                </ElevatedArea>
              </Stack>
            </Center>
          </Section>
        </YStack>
      </DefaultLayout>
    </Page>
  )
}

function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPasswordInput, setShowPasswordInput] = useState(false)
  const emailRef = useRef(null)
  const [authState, setAuthState] = useState<PendingResult>(getPendingResult('pending'))
  const [session, setSession] = useSession()
  const [sessionContext, setSessionContext] = useSessionContext()

  const router = useRouter()

  useEffect(() => {
    // @ts-ignore
    emailRef.current?.focus()
  }, [])

  useEffect(() => {
    if(authState.isLoaded && authState.data) {
      setSession(createSession(authState.data.session.user, authState.data.session.token))
      setSessionContext(authState.data.context)
    }
  }, [authState])

  useEffect(() => {
    if(session.loggedIn) {
      //@ts-ignore
      router.push(router.query.return ?? '/')
    }
  }, [session])

  const handleSignin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    Auth.login(email, password, setAuthState)
  }

  return (
    <YStack ai="center" jc="center" p="$2">
      <YStack miw={300} maw={320} jc="space-between" p="$2" gap="$4">
        <YStack mb="$4">
          <LogoIcon o={0.9}>
            <ProtofyLogoSVG
              className="tamagui-icon"
              width={600/5}
              height={652/5}
            />
          </LogoIcon>
        </YStack>

        {Boolean(authState.isError) && (
          <Notice>
            <Paragraph>{getErrorMessage(authState.error)}</Paragraph>
          </Notice>
        )}

        <>
          {/* <XStack mx="$4" jc="center" space ai="center">
            <Separator />
            <Paragraph size="$2">Auth</Paragraph>
            <Separator />
          </XStack> */}
          <YStack>
            <form onSubmit={handleSignin}>
              <YStack space="$2" mt={'$5'}>
                <Input
                  ref={emailRef}
                  autoComplete="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.nativeEvent.text)}
                  // @ts-ignore
                  required
                />
                <Input
                  autoComplete="password"
                  secureTextEntry
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.nativeEvent.text)}
                  // @ts-ignore
                  required
                />
                <Button
                  // @ts-ignore
                  type="submit"
                  loading={authState.isLoading}
                  disabled={
                    authState.isLoading || !password.length || !email.length
                  }
                  mt={"$5"}
                >
                  {session.loggedIn || authState.isLoading?<Spinner /> : "Sign in"}
                </Button>
              </YStack>
            </form>
          </YStack>
        </>
        <YStack space="$2" >
          <Paragraph theme="alt2" ta="center" size="$2">
            Don't have an account?
            {` `}
            <Link href={"/auth/register"+(router.query.return?"?return="+router.query.return:'')} style={{ fontWeight: '800' }}>
              Sign up.
            </Link>
          </Paragraph>
        </YStack>
      </YStack>
    </YStack>
  )
}