import { Paragraph, Stack, StackProps, YStack } from "tamagui"
import { Grid } from './Grid';
import { EditableObject } from "./EditableObject";
import { getPendingResult } from '../lib/createApiAtom'
import { ItemCard } from "./ItemCard";
import { useTint } from "protolib";
import { useRef } from "react";
import Scrollbars from "react-custom-scrollbars-2";

const GridElementCard = ({ index, data, width }) => {
    const element = data.element.data
    const modelItem = data.model.load(element)
    const tint = useTint()

    return <ItemCard
        height={data.itemHeight}
        cursor="pointer"
        topBarOutSideScrollArea={false}
        backgroundColor={"$color1"}
        elevation={"$0"}
        hoverStyle={{ o: 0.8, backgroundColor: '$' + tint.tint + '1', elevation: "$1" }}
        borderWidth={1}
        pointerEvents='none'
        pointerEventsControls="none"
        onPress={() => data.onSelectItem(modelItem)}
        {...(data.getPicture ? {
            image: data.getPicture(element, width),
            hasPicture: true
        } : {})}
    >
        {data.getBody ? data.getBody(element, width) : 
        <Stack mb={"$4"} key={element.key} width={width}>
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
                columnWidth={width - data.contentMargin}
                columnMargin={0}
                onDelete={data.onDelete}
            />
        </Stack>
        }
    </ItemCard>
}

export const ObjectGrid = ({ gridElementCard=undefined, itemMinWidth = 400, itemHeight, rightGap = 30, contentMargin = 40, onSelectItem = (id) => { }, spacing = 20, getPicture, getBody, model, items, sourceUrl, customFields, onDelete, extraFields, icons, ...props }: any & StackProps) => {
    const containerRef = useRef(null)
    const data = items.map((element, i) => {
        return {
            id: 'item_' + i,
            element: getPendingResult("loaded", element),
            model,
            sourceUrl,
            customFields,
            extraFields,
            icons,
            itemMinWidth,
            getPicture,
            getBody,
            spacing,
            contentMargin,
            onSelectItem,
            onDelete,
            itemHeight
        }
    })

    return <Stack height={1} f={1} {...props}>
        <Scrollbars universal={true} ref={containerRef}>
            <Grid key={data.length} rightGap={rightGap} containerRef={containerRef} spacing={spacing} data={data} card={gridElementCard??GridElementCard} itemMinWidth={itemMinWidth} />
        </Scrollbars>
    </Stack>
}