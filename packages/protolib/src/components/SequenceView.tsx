import { useEffect, useState } from 'react';
import { Chip } from '../components/Chip'
import { Circle, Text, XStack, YStack, YStackProps } from '@my/ui'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { API, z } from 'protobase'
import { usePageParams } from '../next';

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
    model: any
    getCard?: any
    getStageBottom?: any
    onDragEnd?: any
    getDroppableStageStyle?: (col: any, provided: any) => React.CSSProperties
    getStageContainerProps?: (stage) => YStackProps
    sort?: (a, b) => boolean
    [key: string]: any
}) => {

    const [positions, setPositions] = useState({})
    const { query } = usePageParams({})
    const queryString = new URLSearchParams(query).toString();

    const positionsOrder = Object.keys(positions).reduce((acc, key) => {
        return acc.concat(positions[key])
    }, [])

    const itemsList = (items.data.items ?? [])
        .sort((a, b) => {
            const aIndex = positionsOrder.indexOf(a[model.getIdField()])
            const bIndex = positionsOrder.indexOf(b[model.getIdField()])
            if (aIndex === -1 && bIndex === -1) return 0
            if (aIndex === -1) return 1
            if (bIndex === -1) return -1
            return aIndex - bIndex
        })
        .sort(sort)

    const sequenceField = model.getSequeceField()
    const sequenceFieldDefRaw = model.getObjectSchema().getFieldDefinition(sequenceField)
    const sequenceFieldDef = {
        ...sequenceFieldDefRaw,
        ...sequenceFieldDefRaw?.innerType?._def
    }
    const columns = sequenceFieldDef.options?.map(
        (option: z.ZodLiteral<string>) => option.value
    );

    const getItemsBySequenceStages = (stageName) => itemsList?.filter((item) => item[model.getSequeceField()] === stageName);

    const saveNewOrder = (finalItems, movedItem, newItemData) => {
        const positionsByColumn = finalItems.reduce((acc, item) => {
            const col = item[sequenceField];
            if (!acc[col]) acc[col] = [];
            acc[col].push(item[model.getIdField()]);
            return acc;
        }, {});

        setPositions(positionsByColumn);

        API.post('/api/core/v1/sequences/' + model.getModelName() + '?' + queryString, positionsByColumn);

        onStageChange(model.load(movedItem), { positionsByColumn });

        onDragEnd({
            error: false,
            sourceData: movedItem,
            destinationData: newItemData,
            updatedItems: finalItems,
            message: "Item moved",
            positionsByColumn
        });
    }

    const onDragFinish = (result) => {
        const { source, destination } = result;
        if (!destination || (destination.droppableId === source.droppableId &&
            destination.index === source.index)) {
            return;
        }

        const updatedItems = [...itemsList];
        const itemsInSourceCol = updatedItems.filter(i => i[sequenceField] === source.droppableId);
        const [movedItem] = itemsInSourceCol.splice(source.index, 1);
        const modelItem = model.load(movedItem);
        const newItemData = { ...movedItem, [sequenceField]: destination.droppableId };

        if (!modelItem.canTransition(newItemData)) {
            return onDragEnd({
                error: true,
                message: "Invalid transition",
                sourceData: movedItem,
                destinationData: newItemData
            });
        }

        movedItem[sequenceField] = newItemData[sequenceField];

        if (source.droppableId === destination.droppableId) {
            itemsInSourceCol.splice(destination.index, 0, movedItem);
            const reorderedItems = updatedItems.filter(i => i[sequenceField] !== source.droppableId);
            const merged = reorderedItems.concat(itemsInSourceCol);
            saveNewOrder(merged, movedItem, newItemData);
        } else {
            const itemsInDestinationCol = updatedItems.filter(i => i[sequenceField] === destination.droppableId);
            const indexInAll = updatedItems.findIndex(i => i[model.getIdField()] === movedItem[model.getIdField()]);
            updatedItems.splice(indexInAll, 1);

            itemsInDestinationCol.splice(destination.index, 0, movedItem);
            const otherItems = updatedItems.filter(i => i[sequenceField] !== source.droppableId && i[sequenceField] !== destination.droppableId);
            const merged = otherItems.concat(itemsInSourceCol, itemsInDestinationCol);
            saveNewOrder(merged, movedItem, newItemData);
        }
    };

    const themeNames = ["orange", "yellow", "green", "blue", "purple", "pink", "red"]

    const getTheme = (index) => {
        return themeNames[index % themeNames.length]
    }

    const getPostions = async () => {
        const sequenceName = model.getModelName()
        const res = await API.get('/api/core/v1/sequences/' + sequenceName + '?' + queryString)
        if (!res.isError && res.data) {
            setPositions(res.data)
        }
    }

    useEffect(() => {
        getPostions()
    }, [queryString])

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