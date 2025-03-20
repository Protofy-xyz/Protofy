import { YStack, Text, XStack, Tooltip, Paragraph } from '@my/ui';
import { Tinted } from '../Tinted';
import { Sparkles } from "@tamagui/lucide-icons";
import { BoardModel } from 'protolib/bundles/boards/boardsSchemas';
import { useRouter } from 'solito/navigation';
import { getIconUrl } from '../IconSelect';
import { ItemMenu } from '../ItemMenu';

export default ({ element, width, onDelete, ...props }: any) => {
    const board = new BoardModel(element);
    const router = useRouter();

    return (
        <YStack
            cursor="pointer"
            bg="$color2"
            elevation={4}
            br="$4"
            width={'100%'}
            f={1}
            display="flex"
            maxWidth={width ?? 474}
            p="$4"
            gap="$4"
            {...props}
        >
            <XStack jc={"space-between"} ai={"center"} >
                <XStack gap="$2" ai={"center"} >
                    <Text fos="$8" fow="600" >{board?.get("name")}</Text>
                    <Tinted> <Sparkles color={board.get("autopilot") ? "$color8" : "$gray8"} /></Tinted>
                </XStack>
                <ItemMenu
                    type={"bulk"}
                    mt={"1px"}
                    ml={"-5px"}
                    element={board}
                    deleteable={() => true}
                    onDelete={onDelete}
                />
            </XStack>
            <YStack gap="$2">
                <Text fow="600">Values</Text>
                {
                    board?.get("cards")?.length
                        ? <XStack gap="$2" f={1} mah={"$9"} flexWrap="wrap" overflow="scroll">
                            {board.get("cards")?.map((card: any, index: number) => (
                                <Tinted key={card.name}>
                                    <Tooltip>
                                        <Tooltip.Trigger>
                                            <YStack
                                                h={"$3"}
                                                w={"$3"}
                                                br={card.type == "action" ? "$10" : "$2"}
                                                jc={"center"}
                                                ai={"center"}
                                                bc={card.color?? "$color6"}
                                            >
                                                <img
                                                    src={getIconUrl(card.icon)}
                                                    width={20}
                                                    height={20}
                                                />
                                            </YStack>
                                        </Tooltip.Trigger>
                                        <Tooltip.Content>
                                            <Tooltip.Arrow />
                                            <Paragraph fow="600">{card.type}</Paragraph>
                                            <Paragraph>{card.name}</Paragraph>
                                        </Tooltip.Content>
                                    </Tooltip>
                                </Tinted>
                            ))}
                        </XStack>
                        : <Text color={"$color9"}>No values</Text>
                }
            </YStack>
            <YStack gap="$2" >
                <Text fow="600">Rules</Text>
                {
                    board.get("rules")?.length
                        ?
                        <YStack gap="$3" mah={300} overflow="scroll">
                            {board.get("rules")?.map((rule: any, index: number) => (
                                <XStack key={rule} gap={"$2"}  >
                                    <YStack display='flex' w="20px" >
                                        <Text > {index + 1 + "."}</Text>
                                    </YStack>
                                    <Text>{rule}</Text>
                                </XStack>)
                            )}
                        </YStack>
                        : <Text color={"$color9"}>No rules added yet</Text>
                }
            </YStack>
        </YStack>
    )
}