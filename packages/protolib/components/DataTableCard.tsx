import { Stack, XStack } from "tamagui"
import { DataCard } from "./DataCard"

export const DataTableCard = ({ items, model }) => {

    return <XStack flexWrap='wrap'>
        {items?.map((element, i) => {
            const modelItem = model.load(element)
            return (
                <Stack key={element.key} mt="$5" p={"$5"}>
                    <DataCard
                        compact={true}
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
                        name={modelItem.getId()}
                        isTemplate={false}
                    />
                </Stack>
            )
        })}
    </XStack>
}
