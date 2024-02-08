import { Theme, YStack, Text, Spacer, XStack, Paragraph, SizableText } from "@my/ui";
import { UIWrapLib, UIWrap, SSR, TintSection, ContainerLarge, BigTitle, LinkGroup, LinkGroupItem, XCenterStack, NextLink, TooltipContainer, DiscordIcon, Section, SpotLight, GithubIcon, ButtonSimple, HorizontalBox, SectionBlock, HoveredGroup, BlockTitle, BackgroundGradient, ElevatedArea, GridElement, RainbowText, FeatureItem, PageGlow, withSession, Page, Grid, useEdit } from "protolib";
import { ChevronRight, Star } from "@tamagui/lucide-icons";
import Link from "next/link";
import { DefaultLayout } from "../../../layout/DefaultLayout";
import { Protofy } from "protolib/base";

const isProtected = Protofy("protected", false);

const Home = (props) => {
  return (
    <Page id="home-page">
      <DefaultLayout title="Protofy" description="Made with love from Barcelona">
        <PageGlow />
        <Section>
          <SpotLight />
          <ContainerLarge pb="$15" $gtLg={{ minHeight: 900 }} contain="layout" pos="relative">
            <BackgroundGradient height='100vh' direction="up" o="0.1" />
            <YStack f={1} ov="hidden" space="$3" position="relative" pt="$10" mb="$4">
              <YStack scaleX="1" ai="center" space="$2">
                <BigTitle scale={1.4} my="$1" $gtLg={{ scale: 1.4 }}>
                  <RainbowText rainbowType="rainbowSoft" lineHeight={150}>Protofy</RainbowText>
                </BigTitle>
                <XStack alignItems="center" justifyContent="center">
                  <SizableText
                    $xs={{ fontSize: 10, lineHeight: 10, my: '$3' }}
                    $sm={{ fontSize: 20, lineHeight: 10, my: '$3' }}
                    $md={{ fontSize: 30, lineHeight: 40, my: "$5" }}
                    $gtMd={{ fontSize: 60, lineHeight: 70 }}
                    o={0.8}
                    textAlign="center"
                    fontWeight="800"
                    my="$10">
                    <Text fontWeight="800">AI </Text>
                    <Text fontWeight="400">Supercharged </Text>
                    <Text fontWeight="800">LowCode </Text>
                    <Text fontWeight="400">Platform</Text>
                    <br />
                    <Text fontWeight="800"> CMS </Text>
                    <Text fontWeight="400">and </Text>
                    <Text fontWeight="800">Framework</Text>
                  </SizableText>
                </XStack>
                <YStack
                  maw="420px"
                  h="70px"
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
                    <LinkGroupItem id={1} href="/docs/core/configuration" themeColor="green_alt2" marginRight="11px">Web</LinkGroupItem>
                    <LinkGroupItem id={2} href="/docs/intro/why-a-compiler" themeColor="blue_alt2">Mobile</LinkGroupItem>
                    <Text marginHorizontal="13px">&</Text>
                    <LinkGroupItem id={3} href="/docs/components/stacks" themeColor="purple_alt2">IoT</LinkGroupItem>
                    <Spacer size="$0"></Spacer>
                    <Text>in a single framework!</Text>
                  </LinkGroup>
                </YStack>
              </YStack>
              <Spacer size="$4" />
              <XCenterStack>
                <NextLink target="_blank" href="https://github.com/Protofy-xyz/Protofy">
                  <TooltipContainer tooltipText="Github">
                    <GithubIcon width="60" height="60" />
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
                  {/* <NextLink href="#">
                    <MainButton buttonProps={{ w: 120, h: 52 }}>How?</MainButton>
                  </NextLink>
                  <NextLink href="#">
                    <MainButton buttonProps={{ w: 118, h: 52 }}>Docs</MainButton>
                  </NextLink> */}
                </XStack>
                <NextLink target="_blank" href="https://discord.gg/VpeZxMFfYW">
                  <TooltipContainer tooltipText="Discord">
                    <DiscordIcon plain={true} height="60" width="60" />
                  </TooltipContainer>
                </NextLink>
              </XCenterStack>

            </YStack>

          </ContainerLarge>
        </Section>

        <ElevatedArea>
          <XStack pos="absolute" als="center" marginTop="-45px">
            <Link target="_blank" href="https://github.com/Protofy-xyz/Protofy">
              <Theme reset>
                <ButtonSimple>
                  <GithubIcon width="16" />
                  <Text fontFamily="$silkscreen" fontSize="$4"> Star plz </Text>
                  <Star width="13" />
                </ButtonSimple>
              </Theme>
            </Link>
          </XStack>
          <HorizontalBox>
            <HoveredGroup>
              <SectionBlock $sm={{ width: '100%' }} id={1} pr="$10" hoveredTheme="green_alt1" nonHoveredTheme="green" flex={1} title="Open Source" href="#">
                <Text fontWeight="400">Published under the permissive </Text>
                <Text fontWeight="800">MIT </Text>
                <Text fontWeight="400">license. The things you build on top of </Text>
                <Text fontWeight="800">Protofy </Text>
                <Text fontWeight="400">are for yours to keep. We don't force any license on </Text>
                <Text fontWeight="800">your creations</Text>
                <Text fontWeight="400">.</Text>
              </SectionBlock>
              <SectionBlock $sm={{ width: '100%', mt: "$5" }} id={2} pr="$10" hoveredTheme="blue_alt1" nonHoveredTheme="blue" flex={1} title="Developer friendly" href="#">
                <Text fontWeight="400">Extend the system using </Text>
                <Text fontWeight="800">React </Text>
                <Text fontWeight="400">and Javascript / TypeScript, on top of </Text>
                <Text fontWeight="800">NextJS </Text>
                <Text fontWeight="400">, </Text>
                <Text fontWeight="800">Expo </Text>
                <Text fontWeight="400">and </Text>
                <Text fontWeight="800">Express </Text>
                <Text fontWeight="400">. Build beautiful interfaces with </Text>
                <Text fontWeight="800">Tamagui</Text>
              </SectionBlock>
              <SectionBlock $sm={{ width: '100%', mt: "$5" }} id={3} hoveredTheme="purple_alt1" nonHoveredTheme="purple" flex={1} title="LowCode" href="#">
                <Text fontWeight="400">You can create and manage the system entities using visual </Text>
                <Text fontWeight="800">forms and diagrams</Text>
                <Text fontWeight="400">, </Text>
                <Text fontWeight="800">programming </Text>
                <Text fontWeight="400">, or through </Text>
                <Text fontWeight="800">ChatGPT.</Text>
              </SectionBlock>
            </HoveredGroup>
          </HorizontalBox>
        </ElevatedArea>
        <TintSection index={2} contain="paint layout" zi="1000">
          <YStack pe="none" zi="0" fullscreen={true} className="bg-dot-grid mask-gradient-down" />
          <ContainerLarge position="relative">
            <YStack zi="1" space="$6" mb="$4">
              <BlockTitle title="Drag and Drop React UI editor" subtitle="Edit React pages using a visual editor that reads and writes to standard react code."></BlockTitle>
              <Spacer />
              <img src="/images/visualui.png" />
            </YStack>
            <Theme reset={true}>
              <ContainerLarge mt="$15" position="relative">
                <XStack ai="center" jc="center">

                </XStack>
              </ContainerLarge>
            </Theme>
          </ContainerLarge>
        </TintSection>

        <Section>
          <SpotLight />
          <BackgroundGradient height='100vh' direction="up" o={0.1} />
          <Theme reset={true}>
            <ContainerLarge pb="$20" space="$8">
              <YStack maw="950px" als="center">
                <Grid gap="25" itemMinWidth="280">
                  <GridElement title="Real time">
                    <Text fontWeight="800">MQTT </Text>
                    <Text fontWeight="400">and </Text>
                    <Text fontWeight="800">websockets </Text>
                    <Text fontWeight="400">provides real time messaging, server side events and </Text>
                    <Text fontWeight="800">IoT </Text>
                  </GridElement>
                  <GridElement title="SSR and CSR">Toggle between Server-side rendering and Client side rendering without changing the code</GridElement>
                  <GridElement title="Object system">Object system based on Zod and OOP to define system entities. Objects allows for Automatic forms, validation, apis and much more.</GridElement>
                  <GridElement title="Full stack">Includes frontend (web and mobile), backend, API system, database system, reverse proxy and realtime messaging</GridElement>
                  <GridElement title="Yarn workspace">Protofy is yarn workspace with some apps and some packages, integrated together into a batteries-included, full-featured full-stack system</GridElement>
                  <GridElement title="Easy to deploy">Run locally using npm for local devleopment, as a service with PM2 or use docker for cloud deploy.</GridElement>
                </Grid>
              </YStack>
            </ContainerLarge>
          </Theme>
        </Section>

        <ElevatedArea>
          <HorizontalBox>
            <HoveredGroup>
              <SectionBlock $sm={{ width: '100%' }} id={1} pr="$10" hoveredTheme="green_alt1" nonHoveredTheme="green" flex={1} title="Inclusive" href="#">
                Protofy is a Full Stack development platform designed to satisfy the needs of hardened developers, humans, and robots.
              </SectionBlock>
              <SectionBlock $sm={{ width: '100%', mt: "$5" }} id={2} pr="$10" hoveredTheme="blue_alt1" nonHoveredTheme="blue" flex={1} title="Developer friendly" href="#">
                Protofy uses ts-morph to parse javscript/typescript and react files and generate UI editors, diagrams and visual editors on top of real code.
              </SectionBlock>
              <SectionBlock $sm={{ width: '100%', mt: "$5" }} id={3} hoveredTheme="purple_alt1" nonHoveredTheme="purple" flex={1} title="LowCode" href="#">
                Protofy is designed to allow non-developers, developers and AI robots to cooperate in a single place. Providing a great experience for all type of users.
              </SectionBlock>
            </HoveredGroup>
          </HorizontalBox>
        </ElevatedArea>

        <TintSection index={2} contain="paint layout" zi="1000">
          {/* <YStack pe="none" zi={0} fullscreen={true} className="bg-dot-grid mask-gradient-down" /> */}
          <YStack pe="none" o={0.1} zi="0" fullscreen={true} className="bg-grid mask-gradient-up" />
          <ContainerLarge position="relative">
            <YStack ai="center" zi="1" space="$6" mb="$4">
              <BlockTitle title="ESPHome Yaml Visual Editor" subtitle="Configure ESP32 devices using ESPHome and the Protofy ESPHome Yaml Visual Editor. Configure, upload and manage devices from a web admin panel"></BlockTitle>
              <Spacer />
              <XStack $theme-dark={{ display: 'none' }}>
                <img height="100%" width="100%" src="/images/iot_light.png" />
              </XStack>
              <XStack $theme-light={{ display: 'none' }}>
                <img height="100%" width="100%" src="/images/iot.png" />
              </XStack>
            </YStack>
          </ContainerLarge>
        </TintSection>

        {/* <img src="/images/iot.png" /> */}
        <Section pt="$15" borderTopWidth="$0.25" borderColor="$color3">
          <SpotLight />
          <Theme reset={true}>
            <ContainerLarge position="relative">
              <XStack px="$6" pt="$8" gap="$4" $sm={{ flexDirection: "column", px: 0 }}>
                <YStack w="50%" $sm={{ w: "100%" }}>
                  <YStack gap="$4">
                    <FeatureItem margin="$4" label="Solid Foundation">
                      <Text fontWeight="400">Protofy is build on top of open and battle tested technologies like </Text>
                      <Text fontWeight="800">NextJS</Text>
                      <Text fontWeight="400">, </Text>
                      <Text fontWeight="800">Expo</Text>
                      <Text fontWeight="400">, </Text>
                      <Text fontWeight="800">Express </Text>
                      <Text fontWeight="400">and </Text>
                      <Text fontWeight="800">React</Text>
                    </FeatureItem>
                    <FeatureItem label="Procedural UI">High Level and procedural React widgets to generate forms and complex UI like EditableObject or DataView</FeatureItem>
                    <FeatureItem label="Automatic CRUD">Generate CRUD APIs from Zod Schemas. Customize the API using a lightweight object system</FeatureItem>
                  </YStack>
                </YStack>
                <YStack w="50%" $sm={{ w: `100%` }}>
                  <YStack gap="$4">
                    <FeatureItem label="AI Supercharged">All the Protofy dependencies are Open Source and were present in the ChatGPT training set. The ChatGPT integration allows to generate user interfaces, apis or IoT devices.</FeatureItem>
                    <FeatureItem label="Web and native">The UI system is based on Tamagui, a React universal UI system. You can use Tamagui to create native user interfaces for mobile and web.</FeatureItem>
                    <FeatureItem label="ESP32 IoT">Protofy provides a LowCode system to define and enroll ESPHome devices.</FeatureItem>
                  </YStack>
                </YStack>
              </XStack>
            </ContainerLarge>
          </Theme>
        </Section>
        <Section pt="$20" pb="$20">
          <Theme reset={true}>
            <BackgroundGradient height='100vh' direction="up" o="0.1" />
            <ContainerLarge position="relative">
              {/* <SectionBox mt="$20" zi={1000} bubble={true} gradient={true}> */}
              <YStack ai="center" jc="center">
                <BlockTitle title="AI Control Panel" subtitle="Control panel to manage the CMS, website and content. With ChatGPT for code generation, AI assistant and UI generation from sketches."></BlockTitle>
              </YStack>

              <XStack $theme-dark={{ display: 'none' }} mt="$5" p="$5">
                <img height="100%" width="100%" src="/images/ai_light.png" />
              </XStack>

              <XStack $theme-light={{ display: 'none' }} mt="$5" p="$5">
                <img height="100%" width="100%" src="/images/ai_dark.png" />
              </XStack>
              {/* </SectionBox> */}
            </ContainerLarge>
          </Theme>
        </Section>

        <Section py="$20" borderBottomWidth={1} borderTopWidth={1} borderColor="$color6">
          <YStack pe="none" zi="0" fullscreen={true} className="bg-dot-grid mask-gradient-up" />
          {/* <BackgroundGradient direction="down" o={0.1} /> */}
          <Theme reset={true}>
            <YStack ai="center" jc="center">
              <BlockTitle title="We build it for you" subtitle="At Protofy, we are experts at building mobile apps, webs and IoT devices. We have a team of very talented, agile, pasionate and innovative thinkers, ready to build your next project"></BlockTitle>
              <XStack mt="$8">
                <Link target="_blank" href="https://projects.protofy.xyz">
                  <XStack mt="$4" ai="center" jc="center">
                    <Paragraph mr="$2" color="$orange8" fontSize={20}>Go to Projects</Paragraph>
                    <ChevronRight color="$orange8" />
                  </XStack>
                </Link>
              </XStack>
              <XStack jc="center" space="$5" flexWrap="wrap">
                <YStack scale={0.7}>
                  <YStack borderWidth={1}>
                    <img src="/images/fillinggood.png" />
                  </YStack>
                  <Paragraph o={0.8} fontSize={30} mt="$5" fontWeight="500">DAMM - Filling good</Paragraph>
                </YStack>

                <YStack scale={0.7}>
                  <YStack borderWidth={1}>
                    <img src="/images/bluebox.png" />
                  </YStack>
                  <Paragraph o={0.8} fontSize={30} mt="$5" fontWeight="500">The Smart Lollipop</Paragraph>
                </YStack>

                <YStack scale={0.7}>
                  <YStack borderWidth={1}>
                    <img src="/images/taiga.png" />
                  </YStack>
                  <Paragraph o={0.8} fontSize={30} mt="$5" fontWeight="500">Taiga - Fountain</Paragraph>
                </YStack>

              </XStack>
            </YStack>
          </Theme>
        </Section>

      </DefaultLayout>
    </Page>
  );
};

const cw = UIWrapLib('@my/ui')

export default {
  route: Protofy("route", "/"),
  component: (props) =>
    useEdit(
      () => Home(props),
      {
        ...UIWrap("DefaultLayout", DefaultLayout, "../../../layout/DefaultLayout"),
        ...cw("YStack", YStack),
        ...cw("Spacer", Spacer),
        ...cw("Text", Text),
        ...cw("XStack", XStack),
        ...cw("Paragraph", Paragraph),
        ...cw("Theme", Theme),
        ...cw("SizableText", SizableText),
        ...UIWrap("ChevronRight", ChevronRight, "@tamagui/lucide-icons", "ChevronRight"),
        ...UIWrap("Star", Star, "@tamagui/lucide-icons", "Star")
      },
      "/packages/app/bundles/custom/pages/home.tsx"
    ),
  getServerSideProps: SSR(async (context) => withSession(context, isProtected ? Protofy("permissions", []) : undefined)),
};
