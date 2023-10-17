import { Button, Fieldset, Input, Label, Stack, XStack, YStack, Paragraph, Spinner, Text, Dialog, SelectProps, Select, Adapt, Sheet, getFontSize } from "tamagui";
import { Pencil, ChevronDown, ChevronUp, Check } from '@tamagui/lucide-icons';
import { AsyncView, usePendingEffect, API, Tinted, Notice, getPendingResult, SelectList } from 'protolib'
import { ProtoModel } from "protolib/base";
import React, { useEffect, useMemo, useState } from "react";
import { getErrorMessage } from "@my/ui";
import { ProtoSchema } from "protolib/base";
import { Schema } from "../base";
import { useUpdateEffect } from "usehooks-ts";

type EditableObjectProps = {
    initialData?: any,
    sourceUrl: string,
    onSave: Function,
    model: any,
    mode: 'add' | 'edit' | 'view',
    icons?: any,
    extraFields?: any,
    numColumns?: number,
    initialContent: any,
    objectId?: string,
    title?: any,
    loadingText?: any,
    loadingTop?:number,
    spinnerSize?:number,
    name?:string
}

const capitalize = s => s && s[0].toUpperCase() + s.slice(1)

export const EditableObject = ({ name, initialData, loadingTop, spinnerSize, loadingText, title, initialContent, sourceUrl, onSave, mode = 'view', model, icons = {}, extraFields, numColumns = 1, objectId, ...props }: EditableObjectProps) => {
    const [originalData, setOriginalData] = useState(initialData ?? getPendingResult('pending'))
    const [data, setData] = useState(mode == 'add'?{}:undefined)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<any>()

    usePendingEffect((s) => {mode != 'add' && API.get(sourceUrl, s)}, setOriginalData, initialContent)
    useEffect(() => {originalData.data && setData(originalData.data)}, [originalData])

    const elementObj = model.load(data)

    const extraFieldsObject = ProtoSchema.load(Schema.object(extraFields))
    const formFields = elementObj.getObjectSchema().merge(extraFieldsObject).is('display').getLayout(numColumns)

    const getInputElement = (ele,i, x) => {
        const elementDef = ele.schemaField._def
        console.log('ele: ', ele)
        if(elementDef.typeName == 'ZodUnion') {
            const _rawOptions = elementDef.options.map(o => o._def.value)
            const options = ele.displayOptions ? ele.displayOptions : elementDef.options.map(o => o._def.value)
            return <SelectList title={ele.name} elements={options} value={(data && data[ele.name]) ?? ''} setValue={(v) => setData({ ...data, [ele.name]: _rawOptions[options.indexOf(v)]})} />
        }

        return <Input focusStyle={{outlineWidth:1}} disabled={mode == 'edit' && ele.static} secureTextEntry={ele.secret} value={(data && data[ele.name]) ?? ''} onChangeText={(t) => setData({ ...data, [ele.name]: t })} placeholder={!data ? '' : ele.hint} autoFocus={x == 0 && i == 0}></Input>
    }

    const getElement = (ele, icon, i, x) => {
        return <Fieldset ml={!i ? "$0" : "$5"} key={i} gap="$2">
            <Label><Tinted><Stack mr="$2">{React.createElement(icon, { color: "var(--color9)", size: "$1", strokeWidth: 1 })}</Stack></Tinted> {ele.label}</Label>
            {getInputElement(ele, i, x)}
        </Fieldset>
    }
    return <Stack {...props}>
        <AsyncView forceLoad={mode=='add'} waitForLoading={1000} spinnerSize={spinnerSize} loadingText={loadingText ?? "Loading " + objectId} top={loadingTop??-30} atom={originalData}>
            {title??<Dialog.Title><Text><Tinted><Text color="$color9">{capitalize(mode)}</Text></Tinted><Text color="$color11"> {capitalize(name)}</Text></Text></Dialog.Title>}
            <YStack mt={"$7"} ai="center" jc="center">
                {error && (
                    <Notice>
                        <Paragraph>{getErrorMessage(error.error)}</Paragraph>
                    </Notice>
                )}
                <YStack ai="center" jc="center">
                    {
                        formFields.map((row, x) => <XStack key={x} mb={x != formFields.length - 1 ? '$5' : '$0'}>
                            {
                                row.map((ele, i) => {
                                    const icon = icons[ele.name] ? icons[ele.name] : Pencil
                                    return getElement(ele, icon, i, x)
                                })
                            }
                        </XStack>)
                    }
                </YStack>
                <YStack mt="$8" p="$2" pt="$0" width="100%" f={1} alignSelf="center">
                    <Tinted>
                        <Button f={1} onPress={async () => {
                            setLoading(true)
                            try {
                                await onSave(originalData.data, data)
                            } catch (e) {
                                setError(e)
                                console.log('e: ', e)
                            }
                            setLoading(false)
                        }}>
                            {loading ? <Spinner /> : mode == 'add' ? 'Create' : 'Save'}
                        </Button>
                    </Tinted>
                </YStack>
            </YStack></AsyncView></Stack>
}