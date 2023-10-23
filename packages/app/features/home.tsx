import { Theme, YStack, Text, Spacer, XStack, Paragraph } from 'tamagui'
import {
  TintSection,
  ContainerLarge,
  AnounceBubble,
  BigTitle,
  LinkGroup,
  LinkGroupItem,
  CopyBubble,
  XCenterStack,
  NextLink,
  TooltipContainer,
  TwitterIcon,
  MainButton,
  DiscordIcon,
  Section,
  SpotLight,
  GithubIcon,
  ButtonSimple,
  HorizontalBox,
  SectionBlock,
  HoveredGroup,
  BlockTitle,
  ActiveGroup,
  ButtonGroup,
  ActiveGroupButton,
  ActiveRender,
  SideBySide,
  TabGroup,
  IconStack,
  BackgroundGradient,
  ItemCard,
  SectionBox,
  ElevatedArea,
  BarChart,
  GridElement,
  RainbowText,
  OverlayCardBasic,
  FeatureItem,
  DataTable,
  TamaCard,
  Notice,
  PageGlow,
  withSession,
  useSession,
  Page,
  Grid,
  ThemeTint
} from 'protolib'
import { ChevronRight, Code, Cpu, FastForward, Layers, Star } from '@tamagui/lucide-icons'
import Link from 'next/link'
import { DefaultLayout } from '../layout/DefaultLayout'

export function HomeScreen ({pageSession}) {
  return (
    <Page>
      <DefaultLayout title="Protofy"
        description="Made with love from Barcelona">
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
                  animation="bouncy"
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

                <YStack
                  px={0}
                  maw={420}
                  // prevent layout shift
                  h={70}
                  $gtSm={{
                    maw: 500,
                  }}
                  $gtMd={{
                    h: 90,
                    px: 90,
                    maw: 700,
                  }}
                  $gtLg={{
                    maw: 900,
                  }}
                >
                  <LinkGroup>
                    <LinkGroupItem
                      id={0}
                      href="/docs/core/configuration"
                      themeColor="green_alt2"
                    >
                      styles
                    </LinkGroupItem>
                    <Text>
                      {' '}
                    </Text>
                    <LinkGroupItem
                      id={1}
                      href="/docs/intro/why-a-compiler"
                      themeColor="blue_alt2"
                    >
                      optimizing compiler
                    </LinkGroupItem>
                    <Text>
                      {' & '}
                    </Text>
                    <LinkGroupItem
                      id={2}
                      href="/docs/components/stacks"
                      themeColor="purple_alt2"
                    >
                      UI kit
                    </LinkGroupItem>
                    <Spacer size={'$0'}></Spacer>
                    <Text>
                      {'that unify React Native + Web'}
                    </Text>
                  </LinkGroup>
                </YStack>
              </YStack>

              <Spacer size="$4" />
              <CopyBubble text='npm create tamagui' />
              <Spacer size="$1" />

              <XCenterStack>
                <NextLink target="_blank" href="https://twitter.com/tamagui_js">
                  <TooltipContainer tooltipText='Twitter'>
                    <TwitterIcon width={23} />
                  </TooltipContainer>
                </NextLink>
                <XStack
                  ai="center"
                  jc="center"
                  space="$2"
                  //@ts-ignore
                  $xxs={{
                    // words web-only
                    // @ts-ignore
                    order: '-1',
                    mx: '50%',
                  }}
                >
                  <NextLink prefetch={false} href="/docs/intro/why-a-compiler">
                    <MainButton buttonProps={{ w: 120, h: 52 }}>How?</MainButton>
                  </NextLink>

                  <NextLink prefetch={false} href="/docs/intro/introduction">
                    <MainButton buttonProps={{ w: 118, h: 52 }}>Docs</MainButton>
                  </NextLink>
                </XStack>

                <NextLink target="_blank" href="https://discord.gg/4qh6tdcVDa">
                  <TooltipContainer tooltipText='Discord'>
                    <DiscordIcon plain width={23} />
                  </TooltipContainer>
                </NextLink>

              </XCenterStack>
            </YStack>

            <Spacer size="$7" />
          </ContainerLarge>
        </Section>
        {/* subheader */}
        <ElevatedArea>
          <XStack pos="absolute" als="center" y={-45}>
            <Link target="_blank" href="https://github.com/Protofy-xyz">
              <Theme reset>
                <ButtonSimple icon={<GithubIcon width={16} />} iconAfter={Star}>
                  Star plz
                </ButtonSimple>
              </Theme>
            </Link>
          </XStack>
          <HorizontalBox>
            <HoveredGroup>
              <SectionBlock
                id={0}
                pr="$10"
                hoveredTheme='green_alt1'
                nonHoveredTheme='green'
                flex={1}
                title={<>Core <ChevronRight size={12} /></>}
                href="/docs/core/configuration"
                icon={<Code size={16} color="var(--color9)" />}
              >
                Light design-system and style library for React Native + Web with themes,
                animations and much, much more
              </SectionBlock>

              <SectionBlock
                id={1}
                pr="$10"
                hoveredTheme='blue_alt1'
                nonHoveredTheme='blue'
                flex={1}
                title={<>Static <ChevronRight size={12} /></>}
                href="/docs/intro/why-a-compiler"
                icon={<Cpu size={16} color="var(--color9)" />}
              >
                Flatten your component tree with partial evaluation, outputs minimal CSS. Easy
                install with Next, Webpack, Vite, Babel and Metro.
              </SectionBlock>

              <SectionBlock
                id={2}
                hoveredTheme='purple_alt1'
                nonHoveredTheme='purple'
                flex={1}
                title={<>Tamagui <ChevronRight size={12} /></>}
                href="/docs/components/stacks"
                icon={<Layers size={16} color="var(--color9)" />}
              >
                A total UI kit for Native and Web. Composable components, themeable, sizable,
                adapts to each platform properly.
              </SectionBlock>
            </HoveredGroup>
          </HorizontalBox>
        </ElevatedArea>
        <TintSection index={2} contain="paint layout" zi={1000}>
          <YStack pe="none" zi={0} fullscreen className="bg-dot-grid mask-gradient-down" />
          <ContainerLarge position="relative">
            <YStack zi={1} space="$6" mb="$4">
              <BlockTitle
                title="A better style system"
                subtitle={<>
                  A multi-faceted optimizing compiler enables
                  <br />
                  <strong>Lorem ipsum dolor</strong>.
                </>}
              ></BlockTitle>

              <Spacer />

              <ThemeTint>
                <ActiveGroup>
                  <ButtonGroup>
                    <ActiveGroupButton activeId={0}>lorem</ActiveGroupButton>
                    <ActiveGroupButton activeId={1}>ipsum</ActiveGroupButton>
                    <ActiveGroupButton activeId={2}>dolor</ActiveGroupButton>
                  </ButtonGroup>
                  <ActiveRender activeId={0}><XCenterStack mt="$5">lorem</XCenterStack></ActiveRender>
                  <ActiveRender activeId={1}><XCenterStack mt="$5">ipsum</XCenterStack></ActiveRender>
                  <ActiveRender activeId={2}><XCenterStack mt="$5">dolor</XCenterStack></ActiveRender>
                </ActiveGroup>
              </ThemeTint>

              <SideBySide>
                <TabGroup containerProps={{ p: '$5' }} title="Before" tabs={['hello', 'world']}>
                  <h1>hello</h1>
                  <h2>world</h2>
                </TabGroup>
                <IconStack als="center" p="$2.5" mb={0} elevation="$2">
                  <FastForward color="var(--colorHover)" size="$1" />
                </IconStack>
                <TabGroup containerProps={{ p: '$5' }} title="After" tabs={['hello', 'world']}>
                  <h1>Hello</h1>
                  <h2>World</h2>
                </TabGroup>
              </SideBySide>
            </YStack>
          </ContainerLarge>
        </TintSection>
        <Section sectionProps={{ index: 3, p: 0 }}>

          <ContainerLarge position="relative">
            <XStack ai="center" jc="center">
              <ItemCard
                // imageSrc={image.src}
                elevation="$3"
                pointerEvents='none'
                pointerEventsControls="none"
                bottomBar={<XStack px="$3" width="100%" ai="center" jc="center">
                  <Paragraph>Read more...</Paragraph>
                </XStack>}
              >
                <YStack als="center" y={-3} miw={165} jc="center">
                  <Paragraph fontWeight="700">Billie Jean</Paragraph>
                  <Paragraph color="$color11" size="$3">
                    Michael Jackson
                  </Paragraph>
                  <Paragraph color="$color11" o={0.65} size="$3">
                    Thriller
                  </Paragraph>
                </YStack>

              </ItemCard>
            </XStack>
          </ContainerLarge>
          <YStack pe="none" zi={0} fullscreen className="bg-grid mask-gradient-up" />
        </Section>

        <Section sectionProps={{ index: 4, p: 0 }}>
          <ElevatedArea>
            <ContainerLarge position="relative">
              <SectionBox zi={1} bubble gradient>
                <BlockTitle
                  title="Protofito is the king"
                  subtitle={<>
                    Some cool charts
                  </>}
                ></BlockTitle>

                <BarChart
                  animateEnter
                  large
                  selectedElement='Tamagui'
                  data={[
                    { color: '$pink9', name: 'Tamagui', value: 0.12 },
                    { color: '$purple9', name: 'react-native-web', value: 0.063 },
                    { color: '$blue9', name: 'Dripsy', value: 0.108 },
                    { color: '$orange9', name: 'NativeBase', value: 0.73 },
                  ]}
                />
              </SectionBox>
            </ContainerLarge>
          </ElevatedArea>
        </Section>
        <Section sectionProps={{ index: 5, p: 0 }}>
          <Theme reset>
            <ContainerLarge py="$20" space="$8">
              <YStack maw={950} als="center">
                <Grid gap={25} itemMinWidth={280}>
                  <GridElement title="Fully typed">
                    Typed inline styles, themes, tokens, shorthands, media queries,
                    animations, and hooks that optimize.
                  </GridElement>

                  <GridElement title="SSR">
                    Server-side rendering works by default, including responsive styles,
                    themes and variants.
                  </GridElement>

                  <GridElement title="Server Components">
                    Beta support for React Server Components for bundle size reduction.
                  </GridElement>

                  <GridElement title="Introspection">
                    Multi-level debug pragma and props, compile-time JSX props for quick
                    file:line:component jump.
                  </GridElement>

                  <GridElement title="Compatibility">
                    Runs entirely without plugins, with optional optimizing plugins for Metro,
                    Vite, and Webpack.
                  </GridElement>

                  <GridElement title="Full Featdured">
                    A styled factory, variants, tokens, fonts, themes, media queries,
                    shorthands and more.
                  </GridElement>
                </Grid>
              </YStack>
            </ContainerLarge>
          </Theme>
        </Section>
        <Section sectionProps={{ index: 6, p: 0 }}>
          <ContainerLarge my={-5} position="relative" space="$8">
            <SectionBox mt="$20" zi={1000} bubble gradient>
              <XStack ai="center" jc="center">
                <BlockTitle
                  title={<>Hello <RainbowText>world</RainbowText></>}
                  subtitle="badum ts!"
                ></BlockTitle>
              </XStack>
              <Theme reset>
                <XStack p="$10" space="$5">
                  <OverlayCardBasic
                    title="test"
                    subtitle="lorem ipsum dolor sit amet wgj ewgjewj weqg wejfjewfj wefj wejfwjefjwqe f wqefj"
                    caption="go"
                    href="http://google.com"
                  />
                </XStack>
              </Theme>
            </SectionBox>
          </ContainerLarge>
        </Section>
        <Section sectionProps={{ index: 7, p: 0 }}>
          <Theme reset>
            <ContainerLarge position="relative">
              <XStack px="$6" pt="$8" space="$4" $sm={{ flexDirection: 'column', px: 0 }}>
                <YStack w="50%" $sm={{ w: '100%' }}>
                  <YStack space="$4">
                    <FeatureItem label="Press & hover events">
                      onHoverIn, onHoverOut, onPressIn, and onPressOut.
                    </FeatureItem>
                    <FeatureItem label="Pseudo styles">
                      Style hover, press, and focus, in combination with media queries.
                    </FeatureItem>
                    <FeatureItem label="Media queries">For every style/variant.</FeatureItem>
                  </YStack>
                </YStack>
                <YStack w="50%" $sm={{ w: `100%` }}>
                  <YStack space="$4">
                    <FeatureItem label="Themes">Change theme on any component.</FeatureItem>
                    <FeatureItem label="Animations">
                      Animate every component, enter and exit styling, works with pseudo states.
                    </FeatureItem>
                    <FeatureItem label="DOM escape hatches">
                      Support for className and other HTML attributes.
                    </FeatureItem>
                  </YStack>
                </YStack>
              </XStack>
            </ContainerLarge>
          </Theme>
        </Section>
        <Section sectionProps={{ index: 8, p: 0 }}>
          <ContainerLarge position="relative">
            <XStack ai="center" jc="center">
              <DataTable
                title="test hello"
                rows={[['paco', 'perez', 'c/la pera'], ['luis', 'roldan', 'c/la parra'], ['paco', 'perez', 'c/la pera'], ['luis', 'roldan', 'c/la parra'], ['paco', 'perez', 'c/la pera'], ['luis', 'roldan', 'c/la parra'], ['paco', 'perez', 'c/la pera'], ['luis', 'roldan', 'c/la parra'], ['paco', 'perez', 'c/la pera'], ['luis', 'roldan', 'c/la parra'], ['paco', 'perez', 'c/la pera'], ['luis', 'roldan', 'c/la parra']]}
              />
            </XStack>
          </ContainerLarge>
        </Section>
        
        <Section sectionProps={{ index: 8, p: 0 }}>
          <Theme reset>
            <ContainerLarge position="relative">
              <XStack ai="center" jc="center">
                <TamaCard
                  title="hello title"
                  icon={<DiscordIcon />}
                  description="description"
                >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut tincidunt massa. Nam vitae justo gravida, fermentum mauris eu, ultricies turpis. Aenean auctor, metus vitae tempor pharetra, arcu turpis egestas lorem, non fringilla nisl nisl non enim. Orci varius natoque penatibus et magnis dis parturient montes
                </TamaCard>
              </XStack>
            </ContainerLarge>
          </Theme>
        </Section>
        <Section sectionProps={{ index: 9, p: 0 }}>
          <Theme reset>
            <ContainerLarge position="relative">
              <XStack ai="center" jc="center">
                <Notice>hello world!</Notice>
              </XStack>
            </ContainerLarge>
          </Theme>
        </Section>
      </DefaultLayout>
    </Page>
  )
}