import { Theme, YStack, Text, Spacer, XStack, Paragraph, SizableText } from "@my/ui";
import { TintSection, ContainerLarge, AnounceBubble, BigTitle, LinkGroup, LinkGroupItem, CopyBubble, XCenterStack, NextLink, TooltipContainer, TwitterIcon, MainButton, DiscordIcon, Section, SpotLight, GithubIcon, ButtonSimple, HorizontalBox, SectionBlock, HoveredGroup, BlockTitle, ActiveGroup, ButtonGroup, ActiveGroupButton, ActiveRender, SideBySide, TabGroup, IconStack, BackgroundGradient, ItemCard, SectionBox, ElevatedArea, BarChart, GridElement, RainbowText, OverlayCardBasic, FeatureItem, DataTable, TamaCard, Notice, PageGlow, withSession, useSession, Page, Grid, ThemeTint, useEdit, Head1, Head2 } from "protolib";
import { ChevronRight, Code, Cpu, FastForward, Layers, Star } from "@tamagui/lucide-icons";
import Link from "next/link";
import { DefaultLayout } from "../../../layout/DefaultLayout";
import { Protofy } from "protolib/base";
import { SSR } from "app/conf";

const isProtected = Protofy("protected", false);

const Home = () => {
  return (
    <Page>
      <DefaultLayout title="Protofy" description="Made with love from Barcelona">
        <PageGlow />
        <Section sectionProps={{ index: 0, p: 0 }}>
          <SpotLight />
          <ContainerLarge contain="layout" pos="relative">
            <BackgroundGradient />
            <YStack f={1} ov="hidden" space="$3" position="relative" pt="$14" mb="$4">
              <YStack opacity={1} scaleX={1} ai="center" space="$2">
                <BigTitle scale={1.4} $gtLg={{scale:1.4}}>
                  <RainbowText rainbowType="rainbowSoft" lineHeight={150}>Protofy</RainbowText>
                </BigTitle>
                <XStack alignItems="center" justifyContent="center">
                  <SizableText 
                    $xs={{fontSize: 10, lineHeight: 10, my: '$3'}}
                    $sm={{fontSize: 20, lineHeight: 10, my: '$3'}}
                    $md={{fontSize: 40, lineHeight: 40, my: "$5"}} 
                    $gtMd={{fontSize: 70, lineHeight: 70}} o={0.8} 
                    textAlign="center" 
                    fontWeight={"800"} 
                    my="$10"><Text fontWeight={800}>LowCode</Text> Development Platform and <Text fontWeight={800}>CMS</Text></SizableText>
                </XStack>
                <YStack
                  px={0}
                  maw={420}
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
                  }}>
                  <LinkGroup>
                    <LinkGroupItem id={1} href="/docs/core/configuration" themeColor="green_alt2">
                      Web
                    </LinkGroupItem>
                    <Text> </Text>
                    <LinkGroupItem id={2} href="/docs/intro/why-a-compiler" themeColor="blue_alt2">
                      Mobile
                    </LinkGroupItem>
                    <Text> & </Text>
                    <LinkGroupItem id={3} href="/docs/components/stacks" themeColor="purple_alt2">
                      IoT
                    </LinkGroupItem>
                    <Spacer size={"$0"}></Spacer>
                    <Text>in a single framework!</Text>
                  </LinkGroup>
                </YStack>
              </YStack>
              <Spacer size="$4" />
              <XCenterStack>
                <NextLink target="_blank" href="https://github.com/Protofy-xyz/Protofy">
                  <TooltipContainer tooltipText="Github">
                    <GithubIcon />
                  </TooltipContainer>
                </NextLink>
                <XStack
                  ai="center"
                  jc="center"
                  space="$2"
                  $xxs={{
                    // words web-only
                    // @ts-ignore
                    order: "-1",
                    mx: "50%",
                  }}>
                  <NextLink href="#">
                    <MainButton buttonProps={{ w: 120, h: 52 }}>How?</MainButton>
                  </NextLink>
                  <NextLink href="#">
                    <MainButton buttonProps={{ w: 118, h: 52 }}>Docs</MainButton>
                  </NextLink>
                </XStack>
                <NextLink target="_blank" href="https://discord.gg/VpeZxMFfYW">
                  <TooltipContainer tooltipText="Discord">
                    <DiscordIcon plain={true} width={23} />
                  </TooltipContainer>
                </NextLink>
              </XCenterStack>
            </YStack>
            <Spacer size="$7" />
          </ContainerLarge>
        </Section>
        <ElevatedArea>
          <XStack pos="absolute" als="center" y={-45}>
            <Link target="_blank" href="https://github.com/Protofy-xyz/Protofy">
            </Link>
          </XStack>
          <HorizontalBox>
            <HoveredGroup>
              <SectionBlock $sm={{width:'100%'}} id={1} pr="$10" hoveredTheme="green_alt1" nonHoveredTheme="green" flex={1} title={"Open Source"} href="#">
                Published under the permissive MIT license. The things you build on top of Protofy are for yours to keep. We don't force any license on your creations. 
              </SectionBlock>
              <SectionBlock $sm={{width:'100%', mt: "$5"}} id={2} pr="$10" hoveredTheme="blue_alt1" nonHoveredTheme="blue" flex={1} title={"Developer friendly"} href="#">
                Extend the system using React and Javascript / TypeScript, on top of NextJS, Expo and Express. Build beautiful interfaces with Tamagui.
              </SectionBlock>
              <SectionBlock $sm={{width:'100%', mt: "$5"}} id={3} hoveredTheme="purple_alt1" nonHoveredTheme="purple" flex={1} title={"LowCode"} href="#">
                Protofy provides a beautiful admin panel to manage your project. You can create and manage the system entities visually.
              </SectionBlock>
            </HoveredGroup>
          </HorizontalBox>
        </ElevatedArea>
        <TintSection index={2} contain="paint layout" zi={1000}>
          <YStack pe="none" zi={0} fullscreen={true} className="bg-dot-grid mask-gradient-down" />
          <ContainerLarge position="relative">
            <YStack zi={1} space="$6" mb="$4">
              <BlockTitle title="Visual interface editor with drag and drop" subtitle="Edit React pages using a visual editor that reads and writes to standard react code."></BlockTitle>
              <Spacer />
              <ThemeTint>
                <ActiveGroup>
                  <ButtonGroup>
                    <ActiveGroupButton activeId={0}>lorem</ActiveGroupButton>
                    <ActiveGroupButton activeId={1}>ipsum</ActiveGroupButton>
                    <ActiveGroupButton activeId={2}>dolor</ActiveGroupButton>
                  </ButtonGroup>
                  <ActiveRender activeId={0}>
                    <XCenterStack mt="$5">lorem</XCenterStack>
                  </ActiveRender>
                  <ActiveRender activeId={1}>
                    <XCenterStack mt="$5">ipsum</XCenterStack>
                  </ActiveRender>
                  <ActiveRender activeId={2}>
                    <XCenterStack mt="$5">dolor</XCenterStack>
                  </ActiveRender>
                </ActiveGroup>
              </ThemeTint>
              <SideBySide>
                <TabGroup containerProps={{ p: "$5" }} title="Before" tabs={["hello", "world"]}>
                  <Head1>hello</Head1>
                  <Head2>world</Head2>
                </TabGroup>
                <IconStack als="center" p="$2.5" mb={0} elevation="$2"></IconStack>
                <TabGroup containerProps={{ p: "$5" }} title="After" tabs={["hello", "world"]}>
                  <Head1>Hello</Head1>
                  <Head2>World</Head2>
                </TabGroup>
              </SideBySide>
            </YStack>
          </ContainerLarge>
        </TintSection>
        <Section sectionProps={{ index: 3, p: 0 }}>
          <ContainerLarge position="relative">
            <XStack ai="center" jc="center">
              <ItemCard elevation="$3" pointerEvents="none" pointerEventsControls="none">
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
          <YStack pe="none" zi={0} fullscreen={true} className="bg-grid mask-gradient-up" />
        </Section>
        <Section sectionProps={{ index: 4, p: 0 }}>
          <ElevatedArea>
            <ContainerLarge position="relative">
              <SectionBox zi={1} bubble={true} gradient={true}>
                <BlockTitle title="Protofito is the king" subtitle={"Some cool charts"}></BlockTitle>
              </SectionBox>
            </ContainerLarge>
          </ElevatedArea>
        </Section>
        <Section sectionProps={{ index: 5, p: 0 }}>
          <Theme reset={true}>
            <ContainerLarge py="$20" space="$8">
              <YStack maw={950} als="center">
                <Grid gap={25} itemMinWidth={280}>
                  <GridElement title="Fully typed">Typed inline styles, themes, tokens, shorthands, media queries, animations, and hooks that optimize.</GridElement>
                  <GridElement title="SSR">Server-side rendering works by default, including responsive styles, themes and variants.</GridElement>
                  <GridElement title="Server Components">Beta support for React Server Components for bundle size reduction.</GridElement>
                  <GridElement title="Introspection">Multi-level debug pragma and props, compile-time JSX props for quick file:line:component jump.</GridElement>
                  <GridElement title="Compatibility">Runs entirely without plugins, with optional optimizing plugins for Metro, Vite, and Webpack.</GridElement>
                  <GridElement title="Full Featdured">A styled factory, variants, tokens, fonts, themes, media queries, shorthands and more.</GridElement>
                </Grid>
              </YStack>
            </ContainerLarge>
          </Theme>
        </Section>
        <Section sectionProps={{ index: 6, p: 0 }}>
          <ContainerLarge my={-5} position="relative" space="$8">
            <SectionBox mt="$20" zi={1000} bubble={true} gradient={true}>
              <XStack ai="center" jc="center">
                <BlockTitle title={"Hello world"} subtitle="badum ts!"></BlockTitle>
              </XStack>
              <Theme reset={true}>
                <XStack p="$10" space="$5">
                  <OverlayCardBasic title="test" subtitle="lorem ipsum dolor sit amet wgj ewgjewj weqg wejfjewfj wefj wejfwjefjwqe f wqefj" caption="go" href="http://google.com" />
                </XStack>
              </Theme>
            </SectionBox>
          </ContainerLarge>
        </Section>
        <Section sectionProps={{ index: 7, p: 0 }}>
          <Theme reset={true}>
            <ContainerLarge position="relative">
              <XStack px="$6" pt="$8" space="$4" $sm={{ flexDirection: "column", px: 0 }}>
                <YStack w="50%" $sm={{ w: "100%" }}>
                  <YStack space="$4">
                    <FeatureItem label="Press & hover events">onHoverIn, onHoverOut, onPressIn, and onPressOut.</FeatureItem>
                    <FeatureItem label="Pseudo styles">Style hover, press, and focus, in combination with media queries.</FeatureItem>
                    <FeatureItem label="Media queries">For every style/variant.</FeatureItem>
                  </YStack>
                </YStack>
                <YStack w="50%" $sm={{ w: `100%` }}>
                  <YStack space="$4">
                    <FeatureItem label="Themes">Change theme on any component.</FeatureItem>
                    <FeatureItem label="Animations">Animate every component, enter and exit styling, works with pseudo states.</FeatureItem>
                    <FeatureItem label="DOM escape hatches">Support for className and other HTML attributes.</FeatureItem>
                  </YStack>
                </YStack>
              </XStack>
            </ContainerLarge>
          </Theme>
        </Section>
        <Section sectionProps={{ index: 8, p: 0 }}>
          <ContainerLarge position="relative">
            <XStack ai="center" jc="center"></XStack>
          </ContainerLarge>
        </Section>
        <Section sectionProps={{ index: 8, p: 0 }}>
          <Theme reset={true}>
            <ContainerLarge position="relative">
              <XStack ai="center" jc="center">
                <TamaCard title="hello title" description="description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut tincidunt massa. Nam vitae justo gravida, fermentum mauris eu, ultricies turpis. Aenean auctor, metus vitae tempor pharetra, arcu turpis egestas lorem, non fringilla nisl nisl non enim. Orci varius natoque penatibus et magnis dis parturient montes
                </TamaCard>
              </XStack>
            </ContainerLarge>
          </Theme>
        </Section>
        <Section sectionProps={{ index: 9, p: 0 }}>
          <Theme reset={true}>
            <ContainerLarge position="relative">
              <XStack ai="center" jc="center">
                <Notice>hello world!</Notice>
              </XStack>
            </ContainerLarge>
          </Theme>
        </Section>
      </DefaultLayout>
    </Page>
  );
};

export default {
  route: Protofy("route", "/"),
  component: () =>
    useEdit(
      Home,
      {
        DefaultLayout,
        YStack,
        Spacer,
        Text,
        XStack,
        Paragraph,
        Theme,
        SizableText
      },
      "/packages/app/bundles/custom/pages/home.tsx"
    ),
  getServerSideProps: SSR(async (context) => withSession(context, isProtected ? Protofy("permissions", []) : undefined)),
};
