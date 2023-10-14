import { Button, Fieldset, Input, Label, Stack, XStack, YStack, Paragraph, Spinner } from "tamagui";
import { Pencil } from '@tamagui/lucide-icons';
import { Tinted, Notice } from 'protolib'
import { ProtoModel } from "protolib/base";
import React, { useState } from "react";
import { getErrorMessage } from "@my/ui";
import { ProtoSchema } from "protolib/base";
import { Schema } from "../base";

type EditableObjectProps = {
    initialData: any,
    onSave: Function,
    model: ProtoModel<any>,
    mode: 'add' | 'edit',
    icons?: any,
    extraFields?: any,
    numColumns?: number
}

export const EditableObject = ({ initialData, onSave, mode = 'add', model, icons={}, extraFields, numColumns=1}: EditableObjectProps) => {
    const [data, setData] = useState(initialData)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<any>()


    const extraFieldsObject = ProtoSchema.load(Schema.object(extraFields)) 
    const formFields = model.getObjectSchema().merge(extraFieldsObject).is('editUI').getLayout(numColumns)
    return <YStack ai="center" jc="center">
        {error && (
            <Notice>
                <Paragraph>{getErrorMessage(error.error)}</Paragraph>
            </Notice>
        )}
        <YStack ai="center" jc="center">
            {
                formFields.map((row, x) => <XStack key={x} mb={x!=formFields.length-1?'$5':'$0'}>
                    {
                        row.map((ele, i) => {
                            const icon = icons[ele.name] ? icons[ele.name] : Pencil
                            return <Fieldset ml={!i?"$0":"$5"}  key={i} gap="$2">
                                <Label><Tinted><Stack mr="$2">{React.createElement(icon, {color: "var(--color9)", size: "$1", strokeWidth: 1})}</Stack></Tinted> {ele.label}</Label>
                                <Input disabled={mode=='edit' && ele.static} secureTextEntry={ele.secret} value={data[ele.name] ?? ''} onChangeText={(t) => setData({ ...data, [ele.name]: t })} placeholder={ele.hint} autoFocus={x == 0 && i == 0}></Input>
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
                        await onSave(data)
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
    </YStack>
}