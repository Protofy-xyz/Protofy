import { Theme, YStack, Text, XStack, Paragraph, SizableText } from "@my/ui";
import { BigTitle} from 'protolib/dist/components/BigTitle'
import { UIWrapLib, UIWrap } from 'protolib/dist/visualui/visualuiWrapper'
import { API, Protofy } from 'protobase';
import { withSession } from 'protolib/dist/lib/Session';
import { Page } from 'protolib/dist/components/Page';
import { SSR } from 'protolib/dist/lib/SSR';
import { DefaultLayout, } from '../../../layout/DefaultLayout'
import { TintSection } from 'protolib/dist/components/TintSection';
import { ContainerLarge } from 'protolib/dist/components/Container';
import { Spacer } from 'protolib/dist/components/Spacer';
import { LinkGroup, LinkGroupItem } from 'protolib/dist/components/LinkGroup';
import { HCenterStack } from 'protolib/dist/components/HCenterStack';
import { NextLink } from 'protolib/dist/components/NextLink';
import { TooltipContainer } from 'protolib/dist/components/TooltipContainer';
import { DiscordIcon } from 'protolib/dist/components/icons/DiscordIcon';
import { Section } from 'protolib/dist/components/Section';
import { SpotLight } from 'protolib/dist/components/SpotLight';
import { GithubIcon } from 'protolib/dist/components/icons/GithubIcon';
import { ButtonSimple } from 'protolib/dist/components/ButtonSimple';
import { HorizontalBox } from 'protolib/dist/components/HorizontalBox';
import { SectionBlock } from 'protolib/dist/components/SectionBlock';
import { HoveredGroup } from 'protolib/dist/components/HoveredGroup';
import { BlockTitle } from 'protolib/dist/components/BlockTitle';
import { BackgroundGradient } from 'protolib/dist/components/BackgroundGradient';
import { ElevatedArea } from 'protolib/dist/components/ElevatedArea';
import { GridElement } from 'protolib/dist/components/GridElement';
import { RainbowText } from 'protolib/dist/components/RainbowText';
import { FeatureItem } from 'protolib/dist/components/FeatureItem';
import { PageGlow } from 'protolib/dist/components/PageGlow';
import { Grid } from 'protolib/dist/components/Grid';
import { useEdit } from 'protolib/dist/visualui/useEdit';
import { ChevronRight, Star } from "@tamagui/lucide-icons";
import Link from "next/link";
import { context } from "app/bundles/uiContext";
import { useRouter } from "solito/navigation";

const isProtected = Protofy("protected", {{protected}})
Protofy("pageType", "landing")

const PageComponent = (props) => {
  const router = useRouter();
  context.onRender(() => {

  });
  return (
    <Page id="home-page">
      <DefaultLayout title="Protofy" description="Made with love from Barcelona">
        <PageGlow />
        <Section>
          <SpotLight />
          <ContainerLarge paddingBottom={"$15"} $gtLg={{#curlyBraces}} minHeight: 900 {{/curlyBraces}} contain="layout" position="relative">
            <BackgroundGradient height={'100vh'} direction="up" opacity={0.1} />
            <YStack flex={1} overflow="hidden" space="$3" position="relative" paddingTop="$10" marginBottom="$4">
              <YStack opacity={1} scaleX={1} alignItems="center" space="$2">
                <BigTitle scale={1.4} marginVertical={"$1"} $gtLg={{#curlyBraces}} scale: 1.4 {{/curlyBraces}}>
                  <RainbowText rainbowType="rainbowSoft" lineHeight={150}>Protofy</RainbowText>
                </BigTitle>
                <XStack alignItems="center" justifyContent="center">
                  <SizableText
                    $xs={{#curlyBraces}} fontSize: 10, lineHeight: 10, marginVertical: '$3' {{/curlyBraces}}
                    $sm={{#curlyBraces}} fontSize: 20, lineHeight: 10, marginVertical: '$3' {{/curlyBraces}}
                    $md={{#curlyBraces}} fontSize: 30, lineHeight: 40, marginVertical: "$5" {{/curlyBraces}}
                    $gtMd={{#curlyBraces}} fontSize: 60, lineHeight: 70 {{/curlyBraces}} opacity={0.8}
                    textAlign="center"
                    fontWeight={"800"}
                    my="$10"><Text fontWeight={"800"}>AI <Text fontWeight={"400"}>Supercharged</Text> LowCode <Text fontWeight={"400"}>Platform</Text><br /> CMS <Text fontWeight={"400"}>and</Text> Framework</Text></SizableText>
                </XStack>
                <YStack
                  paddingHorizontal={0}
                  maxWidth={420}
                  height={70}
                  $gtSm={{#curlyBraces}}
                    maxWidth: 500,
                  {{/curlyBraces}}
                  $gtMd={{#curlyBraces}}
                    h: 90,
                    paddingHorizontal: 90,
                    maxWidth: 700,
                  {{/curlyBraces}}
                  $gtLg={{#curlyBraces}}
                    maxWidth: 900,
                  {{/curlyBraces}}>
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
              <HCenterStack>
                <NextLink target="_blank" href="https://github.com/Protofy-xyz/Protofy">
                  <TooltipContainer tooltipText="Github">
                    <GithubIcon width={60} height={60} />
                  </TooltipContainer>
                </NextLink>
                <NextLink target="_blank" href="https://discord.gg/VpeZxMFfYW">
                  <TooltipContainer tooltipText="Discord">
                    <DiscordIcon plain={true} height={60} width={60} />
                  </TooltipContainer>
                </NextLink>
              </HCenterStack>

            </YStack>

          </ContainerLarge>
        </Section>

        <ElevatedArea>
          <XStack position="absolute" alignSelf="center" y={-45}>
            <Link target="_blank" href="https://github.com/Protofy-xyz/Protofy">
              <Theme reset>
                <ButtonSimple>
                  <GithubIcon width={16} />
                  <Text fontFamily="$silkscreen" fontSize={"$4"}> Star plz </Text>
                  <Star width={13} />
                </ButtonSimple>
              </Theme>
            </Link>
          </XStack>
          <HorizontalBox>
            <HoveredGroup>
              <SectionBlock $sm={{#curlyBraces}} width: '100%' {{/curlyBraces}} id={1} pr="$10" hoveredTheme="green_alt1" nonHoveredTheme="green" flex={1} title={"Open Source"} href="#">
                Published under the permissive <strong>MIT</strong> license. The things you build on top of <strong>Protofy</strong> are for yours to keep. We don't force any license on <strong>your creations</strong>.
              </SectionBlock>
              <SectionBlock $sm={{#curlyBraces}} width: '100%',  marginTop: "$5" {{/curlyBraces}} id={2} pr="$10" hoveredTheme="blue_alt1" nonHoveredTheme="blue" flex={1} title={"Developer friendly"} href="#">
                Extend the system using <strong>React</strong> and Javascript / TypeScript, on top of <strong>NextJS</strong>, <strong>Expo</strong> and <strong>Express</strong>. Build beautiful interfaces with <strong>Tamagui</strong>.
              </SectionBlock>
              <SectionBlock $sm={{#curlyBraces}} width: '100%',  marginTop: "$5" {{/curlyBraces}} id={3} hoveredTheme="purple_alt1" nonHoveredTheme="purple" flex={1} title={"LowCode"} href="#">
                You can create and manage the system entities using visual <strong>forms and diagrams</strong>, <strong>programming</strong>, or through <strong>ChatGPT</strong>.
              </SectionBlock>
            </HoveredGroup>
          </HorizontalBox>
        </ElevatedArea>
        <TintSection index={2} contain="paint layout" zi={1000}>
          <YStack pointerEvents="none" zi={0} fullscreen={true} className="bg-dot-grid mask-gradient-down" />
          <ContainerLarge position="relative">
            <YStack zi={1} space="$6" marginBottom="$4">
              <BlockTitle title="Drag and Drop React UI editor" subtitle="Edit React pages using a visual editor that reads and writes to standard react code."></BlockTitle>
              <Spacer />
              <img src="/images/visualui.png" />
            </YStack>
            <Theme reset={true}>
              <ContainerLarge marginTop={"$15"} position="relative">
                <XStack alignItems="center" justifyContent="center">

                </XStack>
              </ContainerLarge>
            </Theme>
          </ContainerLarge>
        </TintSection>

        <Section>
          <SpotLight />
          <BackgroundGradient height={'100vh'} direction="up" opacity={0.1} />
          <Theme reset={true}>
            <ContainerLarge paddingBottom="$20" space="$8">
              <YStack maxWidth={950} alignSelf="center">
                <Grid gap={25} itemMinWidth={280}>
                  <GridElement title="Real time"><strong>MQTT</strong> and <strong>websockets</strong> provides real time messaging, server side events and <strong>IoT</strong></GridElement>
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
              <SectionBlock $sm={{#curlyBraces}} width: '100%' {{/curlyBraces}} id={1} pr="$10" hoveredTheme="green_alt1" nonHoveredTheme="green" flex={1} title={"Inclusive"} href="#">
                Protofy is a Full Stack development platform designed to satisfy the needs of hardened developers, humans, and robots.
              </SectionBlock>
              <SectionBlock $sm={{#curlyBraces}} width: '100%',  marginTop: "$5" {{/curlyBraces}} id={2} pr="$10" hoveredTheme="blue_alt1" nonHoveredTheme="blue" flex={1} title={"Developer friendly"} href="#">
                Protofy uses ts-morph to parse javscript/typescript and react files and generate UI editors, diagrams and visual editors on top of real code.
              </SectionBlock>
              <SectionBlock $sm={{#curlyBraces}} width: '100%',  marginTop: "$5" {{/curlyBraces}} id={3} hoveredTheme="purple_alt1" nonHoveredTheme="purple" flex={1} title={"LowCode"} href="#">
                Protofy is designed to allow non-developers, developers and AI robots to cooperate in a single place. Providing a great experience for all type of users.
              </SectionBlock>
            </HoveredGroup>
          </HorizontalBox>
        </ElevatedArea>

        <TintSection index={2} contain="paint layout" zi={1000}>
          {/* <YStack pointerEvents="none" zi={0} fullscreen={true} className="bg-dot-grid mask-gradient-down" /> */}
          <YStack pointerEvents="none" opacity={0.1} zi={0} fullscreen={true} className="bg-grid mask-gradient-up" />
          <ContainerLarge position="relative">
            <YStack alignItems="center" zi={1} space="$6" marginBottom="$4">
              <BlockTitle title="ESPHome Yaml Visual Editor" subtitle="Configure ESP32 devices using ESPHome and the Protofy ESPHome Yaml Visual Editor. Configure, upload and manage devices from a web admin panel"></BlockTitle>
              <Spacer />
              <XStack $theme-dark={{#curlyBraces}} display: 'none' {{/curlyBraces}}>
                <img height="100%" width="100%" src="/images/iot_light.png" />
              </XStack>
              <XStack $theme-light={{#curlyBraces}} display: 'none' {{/curlyBraces}}>
                <img height="100%" width="100%" src="/images/iot.png" />
              </XStack>
            </YStack>
          </ContainerLarge>
        </TintSection>

        {/* <img src="/images/iot.png" /> */}
        <Section paddingTop={"$15"} borderTopWidth={1} borderColor={"$color3"}>
          <SpotLight />
          <Theme reset={true}>
            <ContainerLarge position="relative">
              <XStack paddingHorizontal="$6" paddingTop="$8" space="$4" $sm={{#curlyBraces}} flexDirection: "column", paddingHorizontal: 0 {{/curlyBraces}}>
                <YStack w="50%" $sm={{#curlyBraces}} width: "100%" {{/curlyBraces}}>
                  <YStack space="$4">
                    <FeatureItem label="Solid Foundation">Protofy is build on top of open and battle tested technologies like <strong>NextJS</strong>, <strong>Expo</strong>, <strong>Express</strong> and <strong>React</strong></FeatureItem>
                    <FeatureItem label="Procedural UI">High Level and procedural React widgets to generate forms and complex UI like EditableObject or DataView</FeatureItem>
                    <FeatureItem label="Automatic CRUD">Generate CRUD APIs from Zod Schemas. Customize the API using a lightweight object system</FeatureItem>
                  </YStack>
                </YStack>
                <YStack w="50%" $sm={{#curlyBraces}} width: `100%` {{/curlyBraces}}>
                  <YStack space="$4">
                    <FeatureItem label="AI Supercharged">All the Protofy dependencies are Open Source and were present in the ChatGPT training set. The ChatGPT integration allows to generate user interfaces, apis or IoT devices.</FeatureItem>
                    <FeatureItem label="Web and native">The UI system is based on Tamagui, a React universal UI system. You can use Tamagui to create native user interfaces for mobile and web.</FeatureItem>
                    <FeatureItem label="ESP32 IoT">Protofy provides a LowCode system to define and enroll ESPHome devices.</FeatureItem>
                  </YStack>
                </YStack>
              </XStack>
            </ContainerLarge>
          </Theme>
        </Section>
        <Section paddingTop={"$20"} paddingBottom={"$20"}>
          <Theme reset={true}>
            <BackgroundGradient height={'100vh'} direction="up" opacity={0.1} />
            <ContainerLarge position="relative">
              {/* <SectionBox marginTop="$20" zi={1000} bubble={true} gradient={true}> */}
              <YStack alignItems="center" justifyContent="center">
                <BlockTitle title={"AI Control Panel"} subtitle="Control panel to manage the CMS, website and content. With ChatGPT for code generation, AI assistant and UI generation from sketches."></BlockTitle>
              </YStack>

              <XStack $theme-dark={{#curlyBraces}} display: 'none' {{/curlyBraces}} marginTop={"$5"} padding={"$5"}>
                <img height="100%" width="100%" src="/images/ai_light.png" />
              </XStack>

              <XStack $theme-light={{#curlyBraces}} display: 'none' {{/curlyBraces}} marginTop={"$5"} padding={"$5"}>
                <img height="100%" width="100%" src="/images/ai_dark.png" />
              </XStack>
              {/* </SectionBox> */}
            </ContainerLarge>
          </Theme>
        </Section>

        <Section paddingVertical={"$20"} borderBottomWidth={1} borderTopWidth={1} borderColor={"$color6"}>
          <YStack pointerEvents="none" zi={0} fullscreen={true} className="bg-dot-grid mask-gradient-up" />
          {/* <BackgroundGradient direction="down" opacity={0.1} /> */}
          <Theme reset={true}>
            <YStack alignItems="center" justifyContent="center">
              <BlockTitle title={"We build it for you"} subtitle="At Protofy, we are experts at building mobile apps, webs and IoT devices. We have a team of very talented, agile, pasionate and innovative thinkers, ready to build your next project"></BlockTitle>
              <XStack marginTop={"$8"}>
                <Link target="_blank" href="https://projects.protofy.xyz">
                  <XStack marginTop={"$4"} alignItems="center" justifyContent="center">
                    <Paragraph marginRight={"$2"} color="$orange8" fontSize={20}>Go to Projects</Paragraph>
                    <ChevronRight color="$orange8" />
                  </XStack>
                </Link>
              </XStack>
              <XStack justifyContent="center" space="$5" flexWrap="wrap">
                <YStack scale={0.7}>
                  <YStack borderWidth={1}>
                    <img src="/images/fillinggood.png" />
                  </YStack>
                  <Paragraph opacity={0.8} fontSize={30} marginTop={"$5"} fontWeight={"500"}>DAMM - Filling good</Paragraph>
                </YStack>

                <YStack scale={0.7}>
                  <YStack borderWidth={1}>
                    <img src="/images/bluebox.png" />
                  </YStack>
                  <Paragraph opacity={0.8} fontSize={30} marginTop={"$5"} fontWeight={"500"}>The Smart Lollipop</Paragraph>
                </YStack>

                <YStack scale={0.7}>
                  <YStack borderWidth={1}>
                    <img src="/images/taiga.png" />
                  </YStack>
                  <Paragraph opacity={0.8} fontSize={30} marginTop={"$5"} fontWeight={"500"}>Taiga - Fountain</Paragraph>
                </YStack>

              </XStack>
            </YStack>
          </Theme>
        </Section>

      </DefaultLayout>
    </Page>
    )
    }
    
export default {
      route: Protofy("route", "{{route}}"),
        component: (props) => PageComponent(props),
        getServerSideProps: SSR(async (context) => withSession(context, isProtected?Protofy("permissions", {{{permissions}}}):undefined))
    }