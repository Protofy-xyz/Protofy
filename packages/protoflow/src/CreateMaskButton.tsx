import React, { useState, useMemo } from 'react';
import { Button, YStack, Dialog, Select, Input, XStack, Text } from '@my/ui'
import useTheme from './diagram/Theme';
import { Drama, X, Check, ChevronDown } from 'lucide-react';
import { getAllTypes } from './dynamicMasks/ProtolibProps';

type Props = {
    nodeData: any;
    maskType: string;
};
type BodyDataProps = {
    label: string;
    field: string;
    type?: string;
    fieldType: string;
};

export default ({ nodeData, maskType }: Props) => {
    const [newType, setNewType] = useState<string | undefined>(undefined)
    const [newField, setNewField] = useState<string>('')
    const [maskBodyData, setMaskBodyData] = useState<BodyDataProps[]>([])
    const items = [undefined, ...getAllTypes()]

    const clearNewData = () => {
        setNewType('')
        setNewField('')
    }
    const onAddType = () => {
        var newData: BodyDataProps = {
            label: newField,
            field: newField,
            fieldType: 'prop'

        }
        if (newType) {
            newData.type = newType
        }
        maskBodyData.push(newData)
        setMaskBodyData([...maskBodyData])
        clearNewData()
    }
    const onDelete = (deleteField) => {
        const newMaskBody = maskBodyData.filter(b => b.field != deleteField)
        setMaskBodyData(newMaskBody)
    }
    const onOpenChange = (open) => {
        if (!open) {
            setMaskBodyData([])
            clearNewData()
        }
    }
    const generateMask = () => {
        fetch('/adminapi/v1/mask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: nodeData.name,
                data: maskBodyData,
                type: maskType
            }),
        })
            .then(response => response.json())
            .then(data => console.log(data))
    }
    return <Dialog modal onOpenChange={onOpenChange}>
        <Dialog.Trigger asChild>
            <YStack justifyContent='center'>
                <Button chromeless alignSelf="center" theme={"blue"} mb="$3">
                    {/* create mask */}
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
                <YStack overflow="scroll" maxHeight="$18" overflowX="hidden">
                    {maskBodyData.map((ele) => (
                        <XStack
                            key={ele.field} justifyContent='space-between'
                            alignItems='center' borderBottomColor="$gray6"
                            borderBottomWidth="$0.25" marginBottom="$2" paddingBottom="$2"
                        >
                            <XStack flex={1} >
                                <Text marginRight="$4">
                                    {ele.field}
                                </Text>
                                <Text opacity={0.6}>
                                    {ele.type ?? 'default'}
                                </Text>
                            </XStack>
                            <Button size="$3" onPress={() => onDelete(ele.field)} theme='red' icon={X}></Button>
                        </XStack>))}
                </YStack>
                <XStack gap="$3" alignItems='center'>
                    <Input value={newField} onChangeText={setNewField} placeholder='field name...' />
                    <Select value={newType} onValueChange={setNewType} disablePreventBodyScroll>
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
                                                return (
                                                    <Select.Item
                                                        index={i}
                                                        key={item}
                                                        value={item?.toLowerCase() ?? 'default'}
                                                    >
                                                        <Select.ItemText>{item ?? 'default'}</Select.ItemText>
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
                    <Button size="$3" onPress={onAddType} theme='blue' icon={Check}></Button>
                </XStack>
                <Dialog.Close displayWhenAdapted asChild>
                    <Button theme='blue' onPress={generateMask}>
                        Create
                    </Button>
                </Dialog.Close>

            </Dialog.Content>
        </Dialog.Portal>
    </Dialog>
}