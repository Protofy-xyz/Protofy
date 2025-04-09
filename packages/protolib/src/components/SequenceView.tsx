import { Chip } from '../components/Chip'
import { Circle, Text, XStack, YStack, YStackProps } from '@my/ui'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { z } from 'protobase'

const SequenceCard = ({ model, item, index, onSelectItem, getCard }) => {
    const modelItem = model.load(item)
    const validProps = model.getObjectFields().filter((field) => {
        const fieldDef = model.getObjectSchema().getFieldDefinition(field)
        return fieldDef.typeName == "ZodString" && !fieldDef.id
    })

    return <Draggable
        key={modelItem.getId()}
        draggableId={modelItem.getId()}
        isDragDisabled={!modelItem.canTransition()}
        index={index}
    >
        {(provided) => (
            <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={{
                    userSelect: 'none',
                    margin: '0 0 8px 0',
                    ...provided.draggableProps.style,
                }}
            >
                {
                    getCard
                        ? getCard(item, index)
                        : <YStack
                            onPress={() => onSelectItem(modelItem)}
                            p="$3"
                            br="$4"
                            bc="$backgroundStrong"
                            boc="$gray4"
                            bw="$0.5"
                            hoverStyle={{ elevation: 5, scale: 1.01 }}
                            pressStyle={{ elevation: 0.01 }}
                            animation="bouncy"
                            transition='all 0.2s'
                            gap="$2"
                        >
                            <Text fos="$3" fontStyle='italic' color="$color9">
                                {modelItem.getId()}
                            </Text>
                            {
                                validProps.map((field) => <YStack key={field} mb="$4" fos="$4">
                                    <Text color="$color8" fontWeight="600" fontSize="$3">{field}: </Text>
                                    <Text fontWeight="400" fontSize="$3">
                                        {modelItem.get(field)}
                                    </Text>
                                </YStack>)
                            }
                        </YStack>
                }
            </div>
        )}
    </Draggable>
}


export const SequenceView = ({
    items,
    onStageChange = () => { },
    onSelectItem = () => { },
    model,
    getCard,
    onDragEnd = () => { },
    getStageBottom,
    getDroppableStageStyle = (col, provided) => ({}),
    getStageContainerProps = (stage): YStackProps => ({}),
    sort = (a, b) => true,
    ...props
}: {
    items: any
    onStageChange?: any
    onSelectItem?: any
    model?: any
    getCard?: any
    getStageBottom?: any
    onDragEnd?: any
    getDroppableStageStyle?: (col: any, provided: any) => React.CSSProperties
    getStageContainerProps?: (stage) => YStackProps
    sort?: (a, b) => boolean
    [key: string]: any
}) => {
    const itemsList = (items.data.items ?? []).sort(sort)

    const sequenceField = model.getSequeceField()
    const columns = model.getObjectSchema().getFieldDefinition(sequenceField).options?.map(
        (option: z.ZodLiteral<string>) => option.value
    );

    const getItemsBySequenceStages = (stageName) => itemsList?.filter((item) => item[model.getSequeceField()] === stageName);

    const onDragFinish = (result) => {
        const { source, destination } = result;
        if (!destination || (destination.droppableId === source.droppableId &&
            destination.index === source.index)) {
            return;
        }
        const updatedItems = [...itemsList]
        const [movedItem] = updatedItems.filter(a => a[sequenceField] == source.droppableId).splice(source.index, 1);
        const modelItem = model.load(movedItem)
        const newItemData = { ...movedItem, [sequenceField]: destination.droppableId }

        if (!modelItem.canTransition(newItemData)) return onDragEnd({ error: true, message: "Invalid transition", sourceData: movedItem, destinationData: newItemData })

        movedItem[sequenceField] = newItemData[sequenceField];
        updatedItems.splice(destination.index, 0, movedItem);

        onStageChange(model.load(movedItem))
        onDragEnd({ error: false, sourceData: movedItem, destinationData: newItemData, updatedItems, message: "Item moved" })
    };

    const themeNames = ["orange", "yellow", "green", "blue", "purple", "pink", "red"]

    const getTheme = (index) => {
        return themeNames[index % themeNames.length]
    }

    return (
        <DragDropContext onDragEnd={onDragFinish}>
            <XStack gap="$2" padding="$4" f={1} overflow='scroll' {...props}>
                {columns ? columns.map((col, i) => (
                    <YStack theme={getTheme(i) as any} key={col} bc="$background" br="$4" bw="$0.5" p="$2" pt="$2.5" borderColor="$gray4" {...getStageContainerProps(col)}>
                        <XStack gap="$2" mb="$2" ac="center" jc="flex-start" p="2px">
                            <Chip text={col} textProps={{ fow: "600" }} gap="$2" ai="center" px="$2">
                                <Circle size={10} bc="$color8" />
                            </Chip>
                            <Text fos="$3" color="$gray8">{getItemsBySequenceStages(col).length}</Text>
                        </XStack>
                        <Droppable droppableId={col}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    style={{
                                        width: '250px',
                                        minWidth: '250px',
                                        minHeight: '300px',
                                        padding: '2px',
                                        height: '100%',
                                        overflowY: 'auto',
                                        ...getDroppableStageStyle(col, provided)
                                    }}
                                >
                                    {getItemsBySequenceStages(col).map((item, index) => {
                                        return <SequenceCard key={item.id} model={model} item={item} index={index} onSelectItem={onSelectItem} getCard={getCard} />
                                    })}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                        {getStageBottom && getStageBottom(col, getItemsBySequenceStages(col))}
                    </YStack>
                ))
                    : <Text textAlign="center" f={1} mt="$10" fow="400" color="$color10">No sequence stages defined. Check if the sequence defined has stages or options.</Text>
                }
            </XStack>
        </DragDropContext>
    );
};