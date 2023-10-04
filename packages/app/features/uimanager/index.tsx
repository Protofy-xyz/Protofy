import dynamic from 'next/dynamic';
import userComponents from "../visualui/components";
// @ts-ignore
const CODE = `
import Page from "../uikit/Page"
const Home = () => {
  return (
  <Page>
  <DefaultLayout>
  <PageGlow />
  <Section sectionProps={{ index: 0, p: 0 }}>
          <SpotLight />
          <ContainerLarge contain="layout" pos="relative">
            <BackgroundGradient />
            <YStack
              f={1}
              ov="hidden"
              space="$3"
              position="relative"
              pt="$14"
              mb="$4"
              $sm={{
                maxWidth: '100%',
                mx: 'auto',
                pb: '$4',
              }}
            >
              <AnounceBubble y={-70} href="/takeout">
                <Text fontFamily="$silkscreen">
                  Introducing Takeout 🥡
                </Text>
                <Text ff="$body" fontSize="$3" color="$color10" $sm={{ dsp: 'none' }}>
                  our new pro starter kit
                </Text>
              </AnounceBubble>

              <YStack                   
                  enterStyle={{
                    opacity: 0,
                    scaleX: 0,
                  }}
                  opacity={1}
                  scaleX={1}
                  ai="flex-start" $gtSm={{ ai: 'center' }} space="$2">
                <BigTitle>
                  <RainbowText>Write less,</RainbowText>
                </BigTitle>
                <BigTitle>
                  runs faster
                </BigTitle>

              </YStack>

              <Spacer size="$4" />
              <CopyBubble text='npm create tamagui' />
              <Spacer size="$1" />

            </YStack>

            <Spacer size="$7" />
          </ContainerLarge>
        </Section>
  </DefaultLayout>
  </Page>
  )
  }`

const UiManager = dynamic(() => import('visualui'), { ssr: false })
export default ({ isVSCode = false, code = CODE, onSave = () => null }) => {
  return (
    <main className='h-screen flex flex-col items-center justify-center'>
      <UiManager userComponents={userComponents} isVSCode={isVSCode} _sourceCode={code} onSave={onSave}></UiManager>
    </main>
  )
}