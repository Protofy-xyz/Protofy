import { YStack, H1, Text, XStack, H3, Button } from "@my/ui";
import { SSR, withSession, Page } from "protolib";
import { DefaultLayout } from "../../../layout/DefaultLayout";
import { Protofy } from "protolib/base";

const isProtected = Protofy("protected", {{protected}})

const mainNew = {
    id: '1',
    headline: 'Economic Dawn for Bitcoin: SEC Greenlights First ETF Spot',
    description: 'The SEC approves the first-ever Bitcoin spot ETF, signaling a milestone for institutional investment in cryptocurrencies. Analysts ponder its long-term market impact.',
    author: 'Alexander Johnson',
    category: 'finance',
    date: "15/01/2024",
    image: 'https://raw.githubusercontent.com/Protofy-xyz/Protofy/assets/templates/newsfeed/image-1.png',
}

const sectionOneNews = [
    {
        id: '2',
        headline: 'Revolutionary AI Breakthrough: New Quantum Computing Milestone Achieved',
        description: 'Scientists unveil a groundbreaking advancement in quantum computing, potentially transforming the landscape of artificial intelligence. This leap forward promises to accelerate technological innovation.',
        author: 'Emily Zhang',
        category: 'technology',
        date: "12/01/2024",
        image: 'https://raw.githubusercontent.com/Protofy-xyz/Protofy/assets/templates/newsfeed/image-2.png',
    },
    {
        id: '3',
        headline: 'Next-Gen AI Unveiled: GPT-5 Sets New Standard in Language Understanding',
        description: 'The launch of GPT-5 marks a significant leap in language model capabilities, offering unprecedented accuracy and depth in natural language processing. Experts predict a major shift in AI applications.',
        author: 'David Chen',
        category: 'technology',
        date: "27/12/2023",
        image: 'https://raw.githubusercontent.com/Protofy-xyz/Protofy/assets/templates/newsfeed/image-3.png',
    },
    {
        id: '4',
        headline: "Fusion Energy Breakthrough: Clean Power's Future Brightens",
        description: 'A major breakthrough in fusion energy has been announced, potentially heralding a new era of clean, abundant power. Researchers celebrate a significant milestone towards sustainable energy.',
        author: 'Laura Gibson',
        category: 'science',
        date: "24/12/2023",
        image: 'https://raw.githubusercontent.com/Protofy-xyz/Protofy/assets/templates/newsfeed/image-4.png',
    },
    {
        id: '5',
        headline: 'Intense Political Battles Loom in the 2024 U.S. Presidential Election',
        description: 'The 2024 U.S. Presidential Election is shaping up to be a pivotal contest, with major implications for key issues such as the economy, abortion, and foreign policy. The race sees a mix of familiar faces and new challengers vying for the highest office.',
        author: 'Jordan Smit',
        category: 'politics',
        date: "11/11/2023",
        image: 'https://raw.githubusercontent.com/Protofy-xyz/Protofy/assets/templates/newsfeed/image-5.png',
    },
]

const sectionTwoNews = [
    {
        id: '6',
        headline: "Sánchez's Investiture Bid: A Path to Progressive Governance in Spain",
        description: "Amid a complex political landscape, Spain's acting Prime Minister Pedro Sánchez seeks confidence for a progressive government. His plan includes modernizing the economy, enhancing social welfare, and improving regional cohesion.",
        author: 'Maria Lopez',
        category: 'politics',
        date: "9/12/2023",
        image: 'https://raw.githubusercontent.com/Protofy-xyz/Protofy/assets/templates/newsfeed/image-6.png',
    },
    {
        id: '7',
        headline: "Microsoft Secures ChatGPT in Strategic Acquisition",
        description: "Microsoft has announced the acquisition of ChatGPT, signaling a major expansion in its AI capabilities. This strategic move is set to revolutionize the tech giant's role in the AI-driven digital landscape.",
        author: 'Sarah Johnson',
        category: 'technology',
        date: "2/9/2023",
        image: 'https://raw.githubusercontent.com/Protofy-xyz/Protofy/assets/templates/newsfeed/image-7.png',
    },
    {
        id: '8',
        headline: "Fernando Alonso's Resurgence: A Spectacular Comeback in the 2023 Formula 1 Season",
        description: "The 2023 Formula 1 season witnessed the remarkable resurgence of a true legend in motorsport, Fernando Alonso. The Spanish driver, who made his return to Formula 1 in 2021 after a brief hiatus, has not only defied expectations but has left a lasting mark on the sport.",
        author: 'Emily Turner',
        category: 'sports',
        date: "1/9/2023",
        image: 'https://raw.githubusercontent.com/Protofy-xyz/Protofy/assets/templates/newsfeed/image-8.png',
    }
]

const PageComponent = (props) => {
    return (
        <Page>
            <DefaultLayout headerTitle="Protofy-Store" title="ProtofyStore" description="Made with love from Barcelona"
                footer={<></>}
                header={<></>}
            >
                <YStack height={"40vh"} backgroundColor={"$backgroundHover"} cursor="pointer">
                    <YStack position="absolute" left={0} right={0} style={{#curlyBraces}} display: "inline-block" {{/curlyBraces}}>
                        <img style={{#curlyBraces}} width: '100%', objectFit: 'cover', height: '35vh', objectPosition: 'top' {{/curlyBraces}} src={mainNew.image} />
                        <YStack
                            position="absolute"
                            left={0}
                            bottom={0}
                            right={0}
                            top={0}
                            style={{#curlyBraces}}
                                content: '',
                                background: "linear-gradient(to right, rgba(0,0,0,0.6), transparent), linear-gradient(to top, rgba(0,0,0,0.6), transparent)"
                                {{/curlyBraces}}
                        />
                    </YStack>
                    <YStack pt="8%" $md={{#curlyBraces}} px: '4%' {{/curlyBraces}} $gtMd={{#curlyBraces}} px: '4%' {{/curlyBraces}} $gtLg={{#curlyBraces}} maxWidth: 1100, px: 0, alignSelf: 'center', ai: 'flex-start', jc: 'flex-start' {{/curlyBraces}}>
                        <H1 mb="$4" color="white" $sm={{#curlyBraces}} fontSize: 32 {{/curlyBraces}}>{mainNew.headline}</H1>
                        <Text color="#D7D7D7" theme="alt1" fontSize={24}>{mainNew.description}</Text>
                    </YStack>
                </YStack>
                <YStack px="3%" gap={"$5"} w="100%" backgroundColor={"$backgroundHover"} ai="center" pb="$8">
                    {/* Section1 */}
                    <XStack gap={"$5"} $md={{#curlyBraces}} flexWrap: 'wrap' {{/curlyBraces}}>
                        {
                            sectionOneNews.map((n) => (
                                <YStack id={n.id} f={1} h={500} bc={"$background"} elevation={3} width="100%" $gtSm={{#curlyBraces}} width: 400 {{/curlyBraces}} $gtMd={{#curlyBraces}} maxWidth: 250 {{/curlyBraces}} cursor="pointer">
                                    <YStack position="absolute" top="$2" right="$2" zi={1} bg="$gray12Light" br={30} borderColor="$gray8" bw="$1" maxWidth={120} px="$3" py="$2"><Text color="white">{n.category}</Text></YStack>
                                    <YStack f={1} height="100%" style={{#curlyBraces}} backgroundImage: `url('${n.image}')`, backgroundSize: "cover", backgroundPosition: "center" {{/curlyBraces}} />
                                    <YStack f={1} height="100%" p="$4" >
                                        <H3 numberOfLines={4} lineHeight={20} fontSize={18} mb="$4">{n.headline}</H3>
                                        <Text fontSize={16} numberOfLines={3} theme="alt2">{n.description}</Text>
                                        <Button maxWidth={170} borderRadius={30} mt="$4" fontWeight={"600"}>{"Read More"}<Text ml="$2" theme="alt2">{"->"}</Text></Button>
                                    </YStack>
                                </YStack>
                            ))
                        }
                    </XStack>
                    {/* Section2 */}
                    <XStack gap={"$5"} jc="center" $md={{#curlyBraces}} flexDirection: 'column' {{/curlyBraces}} >
                        <YStack id={sectionTwoNews[0].id} $gtMd={{#curlyBraces}} maxWidth: 530 {{/curlyBraces}} f={1} display="flex" h={500} elevation={3} width="100%" bc="$background" cursor="pointer">
                            <YStack position="absolute" top="$2" right="$2" zi={1} bg="$gray12Light" borderColor="$gray8" bw="$1" br={30} maxWidth={120} px="$3" py="$2"><Text color="white">{sectionTwoNews[0].category}</Text></YStack>
                            <YStack f={1} height="100%" style={{#curlyBraces}} backgroundImage: `url('${sectionTwoNews[0].image}')`, backgroundSize: "cover", backgroundPosition: "center" {{/curlyBraces}} />
                            <YStack f={1} height="100%" p="$4" jc="space-between">
                                <YStack>
                                    <H3 lineHeight={20} numberOfLines={4} fontSize={18} mb="$4">{sectionTwoNews[0].headline}</H3>
                                    <Text fontSize={16} numberOfLines={3} theme="alt2">{sectionTwoNews[0].description}</Text>
                                </YStack>
                                <XStack jc="space-between">
                                    <Text fontSize={14} numberOfLines={1} theme="alt1">{sectionTwoNews[0].date}</Text>
                                    <Text ta="right" fontSize={14} numberOfLines={1} theme="alt1">{sectionTwoNews[0].author}</Text>
                                </XStack>
                            </YStack>
                        </YStack>
                        <XStack display="flex" gap="$5" f={1} width="100%" $sm={{#curlyBraces}} flexDirection: 'column' {{/curlyBraces}}>
                            <YStack w="100%" id={sectionTwoNews[1].id} f={1} h={500} bc={"$background"} elevation={3} width="100%" $gtMd={{#curlyBraces}} maxWidth: 250 {{/curlyBraces}} cursor="pointer">
                                <YStack position="absolute" top="$2" right="$2" zi={1} bg="$gray12Light" borderColor="$gray8" bw="$1" br={30} maxWidth={120} px="$3" py="$2"><Text color="white">{sectionTwoNews[1].category}</Text></YStack>
                                <YStack f={1} height="100%" style={{#curlyBraces}} backgroundImage: `url('${sectionTwoNews[1].image}')`, backgroundSize: "cover", backgroundPosition: "center" {{/curlyBraces}} />
                                <YStack f={1} height="100%" p="$4" jc="space-between">
                                    <YStack>
                                        <H3 lineHeight={20} numberOfLines={4} fontSize={18} mb="$4">{sectionTwoNews[1].headline}</H3>
                                        <Text fontSize={16} numberOfLines={3} theme="alt2">{sectionTwoNews[1].description}</Text>
                                    </YStack>
                                    <XStack jc="space-between">
                                        <Text fontSize={14} numberOfLines={1} theme="alt1">{sectionTwoNews[1].date}</Text>
                                        <Text ta="right" fontSize={14} numberOfLines={1} theme="alt1">{sectionTwoNews[1].author}</Text>
                                    </XStack>
                                </YStack>
                            </YStack>
                            <YStack w="100%" id={sectionTwoNews[2].id} f={1} h={500} bc={"$background"} elevation={3} width="100%" $gtMd={{#curlyBraces}} maxWidth: 250 {{/curlyBraces}} cursor="pointer">
                                <YStack position="absolute" top="$2" right="$2" zi={1} bg="$gray12Light" borderColor="$gray8" bw="$1" br={30} maxWidth={120} px="$3" py="$2"><Text color="white">{sectionTwoNews[2].category}</Text></YStack>
                                <YStack f={1} height="100%" style={{#curlyBraces}} backgroundImage: `url('${sectionTwoNews[2].image}')`, backgroundSize: "cover", backgroundPosition: "center" {{/curlyBraces}} />
                                <YStack f={1} height="100%" p="$4" jc="space-between" >
                                    <YStack>
                                        <H3 lineHeight={20} numberOfLines={4} fontSize={18} mb="$4">{sectionTwoNews[2].headline}</H3>
                                        <Text fontSize={16} numberOfLines={3} theme="alt2">{sectionTwoNews[2].description}</Text>
                                    </YStack>
                                    <XStack jc="space-between">
                                        <Text fontSize={14} numberOfLines={1} theme="alt1">{sectionTwoNews[2].date}</Text>
                                        <Text ta="right" fontSize={14} numberOfLines={1} theme="alt1">{sectionTwoNews[2].author}</Text>
                                    </XStack>
                                </YStack>
                            </YStack>
                        </XStack>
                    </XStack>
                </YStack>
            </DefaultLayout>
        </Page >
    )
}


export default {
    route: Protofy("route", "{{route}}"),
    component: (props) => PageComponent(props),
    getServerSideProps: SSR(async (context) => withSession(context, isProtected?Protofy("permissions",
    {{permissions}}):undefined))
}