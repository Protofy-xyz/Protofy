import React, { useState, useMemo } from 'react';
import { Button, YStack, Dialog, Select, XStack, Input } from '@my/ui'
import useTheme from './diagram/Theme';
import { Drama, X, Check, ChevronDown } from '@tamagui/lucide-icons';
import { getAllFieldTypes } from './fields';

type Props = {
    nodeData: any;
    maskType: string;
};
type BodyDataProps = {
    label: string;
    field: string;
    type?: string;
    fieldType: string;
    staticLabel: boolean;
};

export default ({ nodeData, maskType }: Props) => {
    const initialData = Object.keys(nodeData).filter(k => k.startsWith('prop')).map(k => {
        return {
            label: nodeData[k].key,
            field: nodeData[k].key,
            fieldType: 'prop',
            staticLabel: true
        }
    })
    const [maskBodyData, setMaskBodyData] = useState<BodyDataProps[]>(initialData)
    const [newType, setNewType] = useState<string | undefined>(undefined)
    const [newField, setNewField] = useState<string>('')
    const items = [undefined, ...getAllFieldTypes()]

    const clearNewData = () => {
        setNewType('')
        setNewField('')
    }
    const onAddType = () => {
        if (!newField) return
        var newData: BodyDataProps = {
            label: newField,
            field: newField,
            fieldType: 'prop',
            staticLabel: true
        }
        if (newType) {
            newData.type = newType
        }
        maskBodyData.push(newData)
        setMaskBodyData([...maskBodyData])
        clearNewData()
    }
    const onChangeType = (index, key, value) => {
        var newBodyData = [...maskBodyData]

        if (key == 'field') {
            newBodyData[index]['label'] = value
        }

        if (key == 'type' && value == "default") {
            delete newBodyData[index][key]
        } else {
            newBodyData[index][key] = value
        }

        setMaskBodyData(newBodyData)
    }
    const onDelete = (deleteField) => {
        const newMaskBody = maskBodyData.filter(b => b.field != deleteField)
        setMaskBodyData(newMaskBody)
    }
    const onOpenChange = (open) => {
        if (!open) {
            setMaskBodyData(initialData)
            clearNewData()
        }
    }
    const generateMask = () => {
        const convertedData = maskBodyData.map(e => {
            return {
                ...e,
                field: 'prop-' + e.field
            }
        })
        const customPropsData = convertedData.filter(c => c.type)
        const defaultPropsData = convertedData.filter(c => !c.type)

        fetch('/adminapi/v1/mask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "id": nodeData.name,
                "title": nodeData.name,
                "path": "*",
                "type": maskType,
                "filter": {
                    "name": nodeData.name
                },
                "body": [
                    {
                        "type": "custom-field",
                        "data": customPropsData
                    },
                    {
                        "type": "prop",
                        "data": defaultPropsData
                    },
                    {
                        "type": "child",
                        "data": []
                    }
                ]
            }
            )
        })
            .then(response => response.json())
            .then(data => console.log(data))
    }

    return <Dialog modal onOpenChange={onOpenChange}>
        <Dialog.Trigger asChild>
            <YStack justifyContent='center'>
                <Button chromeless alignSelf="center" theme={"blue"} mb="$3">
                    <Drama fillOpacity={0} color={useTheme('interactiveColor')} />
                </Button>
            </YStack>
        </Dialog.Trigger>
        <Dialog.Portal zIndex={999999999} overflow='hidden'>
            <Dialog.Overlay />
            <Dialog.Content
                bordered
                elevate
                animateOnly={['transform', 'opacity']}
                enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                gap="$4"
                maxWidth={600}
            >
                <Dialog.Title>Create a mask</Dialog.Title>
                <Dialog.Description>
                    {'When you click on create, a mask will be generated for the "' + nodeData.name + '" component. Any unsaved changes will be lost.'}
                </Dialog.Description>
                <Dialog.Description>
                    {'Properties: '}
                </Dialog.Description>
                <YStack>
                    {/*@ts-ignore*/}
                    <YStack overflow="scroll" maxHeight="$18" overflowX="hidden" >
                        {maskBodyData.map((ele, index) => (
                            <PropEditor
                                onChange={onChangeType}
                                index={index}
                                item={ele}
                                selectItems={items}
                                onDelete={onDelete}
                            />
                        ))}
                    </YStack>
                    <XStack gap="$3" alignItems='center'>
                        <Input
                            value={newField}
                            onChangeText={setNewField}
                            placeholder='prop name...'
                        />
                        <TypeSelect value={newType} onValueChange={setNewType} items={items} />
                        <Button size="$4" onPress={onAddType} theme='blue'>Add</Button>
                    </XStack>
                </YStack>
                <Dialog.Close displayWhenAdapted asChild>
                    <Button theme='blue' onPress={generateMask}>
                        Create
                    </Button>
                </Dialog.Close>
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog >
}

const PropEditor = ({ item, selectItems, onChange, index, onDelete }) => {
    const [field, setField] = useState(item.field)
    
    return <XStack
        key={item.field}
        gap="$3"
        marginBottom="$3"
    >
        <Input
            value={field}
            onBlur={() => onChange(index, 'field', field)}
            onChangeText={setField}
            placeholder='prop name...'
        />
        <TypeSelect value={item?.type} onValueChange={(val) => onChange(index, 'type', val)} items={selectItems} />
        <Button size="$4" onPress={() => onDelete(item.field)} icon={X}></Button>
    </XStack>
}

const TypeSelect = ({ value, onValueChange, items }) => <Select value={value ?? 'default'} onValueChange={onValueChange} disablePreventBodyScroll>
    <Select.Trigger width={220} iconAfter={ChevronDown}>
        <Select.Value placeholder="default" />
    </Select.Trigger>
    <Select.Content zIndex={9999999999}>
        <Select.Viewport>
            <Select.Group>
                <Select.Label>Types</Select.Label>
                {useMemo(
                    () =>
                        items.map((item, i) => {
                            const itemName = item ?? 'default'
                            return (
                                <Select.Item
                                    index={i}
                                    key={item}
                                    value={item?.toLowerCase() ?? 'default'}
                                >
                                    <Select.ItemText>
                                        {itemName}
                                    </Select.ItemText>
                                    <Select.ItemIndicator marginLeft="auto">
                                        <Check size={16} />
                                    </Select.ItemIndicator>
                                </Select.Item>
                            )
                        }),
                    [items]
                )}
            </Select.Group>
        </Select.Viewport>
    </Select.Content>
</Select>