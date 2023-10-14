import { Button, Fieldset, Input, Label, Stack, XStack, YStack, Paragraph, Spinner, Text, Dialog } from "tamagui";
import { Pencil } from '@tamagui/lucide-icons';
import { AsyncView, usePendingEffect, API, Tinted, Notice, getPendingResult } from 'protolib'
import { ProtoModel } from "protolib/base";
import React, { useEffect, useState } from "react";
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
    useEffect(() => {mode != 'add' && setData(originalData.data)}, [originalData])

    const elementObj = model.load(data)

    const extraFieldsObject = ProtoSchema.load(Schema.object(extraFields))
    const formFields = model.load({}).getObjectSchema().merge(extraFieldsObject).is('display').getLayout(numColumns)
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
                        (data || mode == 'add') && formFields.map((row, x) => <XStack key={x} mb={x != formFields.length - 1 ? '$5' : '$0'}>
                            {
                                row.map((ele, i) => {
                                    const icon = icons[ele.name] ? icons[ele.name] : Pencil
                                    return <Fieldset ml={!i ? "$0" : "$5"} key={i} gap="$2">
                                        <Label><Tinted><Stack mr="$2">{React.createElement(icon, { color: "var(--color9)", size: "$1", strokeWidth: 1 })}</Stack></Tinted> {ele.label}</Label>
                                        <Input focusStyle={{outlineWidth:1}} disabled={mode == 'edit' && ele.static} secureTextEntry={ele.secret} value={data[ele.name] ?? ''} onChangeText={(t) => setData({ ...data, [ele.name]: t })} placeholder={ele.hint} autoFocus={x == 0 && i == 0}></Input>
                                    </Fieldset>
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