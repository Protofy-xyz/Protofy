import { Stack, XStack } from "tamagui"
import { DataCard } from "./DataCard"

export const DataTableCard = ({ items }) => {
    return <XStack flexWrap='wrap'>
        {items?.map((element, i) => {
            return (
                <Stack key={element.key} mt="$5" p={"$5"}>
                    <DataCard
                        innerContainerProps={{
                            maxWidth: 700,
                            $md: { maxWidth: 450 },
                            $sm: { minWidth: 'calc(100vw - 65px)', maxWidth: 'calc(100vw - 65px)' },
                            minWidth: 350
                        }}
                        // onDelete={onDelete}
                        key={i}
                        // onSave={(content) => onSave(content, element.key)}
                        json={element}
                        name={element.username}
                        isTemplate={false}
                    />
                </Stack>
            )
        })}
    </XStack>
}
