import { FormEvent, useEffect, useRef, useState } from 'react'
import { Button, Input, Text, Paragraph, Separator, Spinner, Stack, XStack, YStack, Spacer } from 'tamagui'
import { Page, hasSessionCookie, Session,useSession, useSessionContext, createSession, Auth, Center, HorizontalBox, Notice, Section, SpotLight, ElevatedArea, BackgroundGradient, LogoIcon, PendingResult, getPendingResult} from 'protolib'
import { DefaultLayout } from '../../layout/DefaultLayout'
import Link from 'next/link'
import { ProtofyLogoSVG, getErrorMessage, getValidation} from '@my/ui'
import { useAtom } from 'jotai'
import { useRouter } from 'next/router';

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
                    <SignUp />
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

function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')
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
      const newSession = createSession(authState.data.session.user, authState.data.session.token)
      setSession(newSession)
      setSessionContext(authState.data.context)
    }
  }, [authState])

  useEffect(() => {
    if(session.loggedIn) {
      router.push(router.query?.return ?? '/')
    }
  }, [session])

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    Auth.register(email, password, rePassword, setAuthState)
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
          <XStack mx="$4" jc="center" space ai="center">
            <Separator />
            <Paragraph size="$2">Create a new account</Paragraph>
            <Separator />
          </XStack>
          <YStack>
            <form onSubmit={handleSignUp}>
              <YStack space="$2" mt={'$5'}>
                <Input
                  {...getValidation('username', authState)}
                  ref={emailRef}
                  autoComplete="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.nativeEvent.text)}
                  // @ts-ignore
                  required
                />
                <Input
                  {...getValidation('password', authState)}
                  autoComplete="password-new"
                  secureTextEntry
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.nativeEvent.text)}
                  // @ts-ignore
                  required
                />
                <Input
                  autoComplete="password-new"
                  secureTextEntry
                  placeholder="Repeat Password"
                  value={rePassword}
                  onChange={(e) => setRePassword(e.nativeEvent.text)}
                  // @ts-ignore
                  required
                />
                <Button
                  // @ts-ignore
                  type="submit"
                  loading={authState.isLoading}
                  disabled={
                     authState.isLoading || !password.length || !rePassword.length || !email.length
                  }
                  mt={"$5"}
                >
                  {session.loggedIn || authState.isLoading?<Spinner /> : "Sign up"}
                </Button>
              </YStack>
            </form>
          </YStack>
        </>
        <YStack space="$2" >
          <Paragraph theme="alt2" ta="center" size="$2">
            Already registered?
            {` `}
            <Link href="/auth/login" style={{ fontWeight: '800' }}>
              Sign in.
            </Link>
          </Paragraph>
        </YStack>
      </YStack>
    </YStack>
  )
}