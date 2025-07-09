import { Stack, StackProps } from "@my/ui"
import { DataCard } from "./DataCard"
import { useRef } from "react";
import { Grid } from './Grid';
import { Button } from "protoflow";
import { InteractiveIcon } from "./InteractiveIcon";

const GridElementCard = ({ index, data, width }) => {
    const element = data.element
    const modelItem = data.model.load(element)
    const onDelete = data.onDelete;
    const onSave = data.onSave;

    return <Stack key={element.key} width={width}>
        <DataCard
            backgroundColor={"$bgPanel"}
            compact={true}
            innerContainerProps={{
                mb: "$3",
                mt: "$5",
                mx: "$3",
            }}
            onDelete={onDelete}
            onSave={(content) => {
                //console.log("OnSave: ", {content,data});
                onSave ? onSave(content, modelItem) : null
            }}
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
            id: 'item_' + i,
            element,
            model,
            onDelete: props.onDelete,
            onSave: props.onSave
        }
    })

    return <Stack ml={"$5"} ref={containerRef} f={1}{...props}>
        <Stack mt={"$-7"} >
            <Grid key={data.length} rightGap={rightGap} containerRef={containerRef} spacing={spacing} data={data} card={GridElementCard} itemMinWidth={itemMinWidth} />
        </Stack>
    </Stack>
}
