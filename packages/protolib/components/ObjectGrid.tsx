import { H1, Paragraph, Stack, StackProps, Theme, XStack, YStack } from "tamagui"
import {Grid} from './Grid';
import { EditableObject } from "./EditableObject";
import {getPendingResult} from '../lib/createApiAtom'
import { ItemCard } from "./ItemCard";
import { useTint } from "@tamagui/logo";
import { useMemo } from "react";
import {Tinted} from './Tinted'

const GridElementCard = ({ index, data, width }) => {
    const element = data.element.data
    const modelItem = data.model.load(element)
    const tint = useTint()
    return <ItemCard
        cursor="pointer"
        topBarOutSideScrollArea={false}
        backgroundColor={"$color1"}
        elevation={"$0"}
        hoverStyle={{backgroundColor: '$'+tint.tint+'1',elevation:"$3"}}
        borderWidth={1}
        pointerEvents='none'
        pointerEventsControls="none"

    >
        <Stack mx={"$7"} mb={"$4"} key={element.key} width={width}>
            <EditableObject
                title={''}
                initialData={data.element}
                name={modelItem.getId()}
                spinnerSize={75}
                loadingText={<YStack ai="center" jc="center">Loading data...<Paragraph fontWeight={"bold"}></Paragraph></YStack>}
                objectId={modelItem.getId()}
                sourceUrl={data.sourceUrl + '/' + modelItem.getId()}
                mode={'preview'}
                model={data.model}
                extraFields={data.extraFields}
                icons={data.icons}
                customFields={data.customFields}
                columnWidth={data.itemMinWidth}
                
            />
        </Stack>
    </ItemCard>
}

export const ObjectGrid = ({itemMinWidth=400, spacing=20, model, items, sourceUrl, customFields, extraFields, icons, ...props}: any & StackProps) => {
    const data = items?.data?.items?.map((element, i) => {
        return {
            id: 'item_'+i,
            element: getPendingResult("loaded", element),
            model,
            sourceUrl,
            customFields, 
            extraFields,
            icons,
            itemMinWidth
        }
    })

    return <Stack {...props}>
        <Grid spacing={spacing} data={data} card={GridElementCard} itemMinWidth={itemMinWidth}/>
    </Stack>
}