import { Stack, StackProps } from "tamagui"
import { DataCard } from "./DataCard"
import { useRef } from "react";
import { Grid } from './Grid';

const GridElementCard = ({ index, data, width }) => {
    const element = data.element
    const modelItem = data.model.load(element)
    const onDelete = data.onDelete;

    return <Stack key={element.key} width={width}>
        <DataCard
            compact={true}
            innerContainerProps={{
                marginBottom: "$3",
                 marginTop: "$5",
                marginHorizontal: "$3",
            }}
            onDelete={onDelete}
            // onSave={(content) => onSave(content, element.key)}
            json={element}
            name={modelItem.getId()}
            isTemplate={false}
        />
    </Stack>
}

export const DataTableCard = ({ itemMinWidth = 400, rightGap = 30, contentMargin = 40, spacing = 20, items, model, ...props }: any & StackProps) => {
    const containerRef = useRef(null)

    const data = items?.data?.items?.map((element, i) => {
        return {
            id: 'item_'+i,
            element,
            model,
            onDelete: props.onDelete
        }
    })

    return <Stack marginLeft={"$5"} ref={containerRef} flex={1}{...props}>
        <Grid key={data.length} rightGap={rightGap} containerRef={containerRef} spacing={spacing} data={data} card={GridElementCard} itemMinWidth={itemMinWidth}/>
    </Stack>
}
