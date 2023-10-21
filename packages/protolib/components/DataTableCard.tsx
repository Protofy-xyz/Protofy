import { Stack, XStack } from "tamagui"
import { DataCard } from "./DataCard"
import { useContext } from "react";
import { DataViewContext } from "./DataView";
import {Grid} from './Grid';

const GridElementCard = ({ index, data, width }) => {
    const element = data.element
    const modelItem = data.model.load(element)

    return <Stack key={element.key} width={width} mt="$5" p={"$5"}>
    <DataCard
        compact={true}
        innerContainerProps={{
            maxWidth: 600,
            $md: { maxWidth: 450 },
            $sm: { minWidth: 'calc(100vw - 65px)', maxWidth: 'calc(100vw - 65px)' },
            minWidth: 350
        }}
        // onDelete={onDelete}
        // onSave={(content) => onSave(content, element.key)}
        json={element}
        name={modelItem.getId()}
        isTemplate={false}
    />
</Stack>
}

export const DataTableCard = ({ }) => {
    const { items, model } = useContext(DataViewContext);

    const data = items?.data?.items?.map((element, i) => {
        return {
            id: 'item_'+i,
            element,
            model
        }
    })

    return <Grid spacing={15} data={data} card={GridElementCard} itemMinWidth={400} columns={2}/>
}
