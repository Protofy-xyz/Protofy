import { Button, Fieldset, Input, Label, Spacer, Stack, XStack, YStack, Paragraph, Spinner } from "tamagui";
import { Mail, Tag, Key } from '@tamagui/lucide-icons';
import { Tinted, Notice } from 'protolib'
import { ProtoModel } from "protolib/base";
import { UserModel } from "../usersModels";
import { useState } from "react";
import { getErrorMessage } from "@my/ui";
import {z} from 'zod'
import { ProtoSchema, Schema } from "protolib/base";

type EditableObjectProps = {
    initialData: any,
    onSave: Function,
    model: ProtoModel<any>,
    mode: 'add' | 'edit',
    icons?: any,
    extraFields?: ProtoSchema,
    numColumns?: number
}

const EditableObject = ({ initialData, onSave, mode = 'add', model, icons={}, extraFields, numColumns=2}: EditableObjectProps) => {
    const [data, setData] = useState(initialData)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<any>()
    // console.log('shapeoko:', model.getObjectShape())
    // console.log('shaaaaaaaaaaaape: ', Object.keys(extractFieldDetails(model.getObjectShape())))

    // const fields = extractFieldDetails(model.getObjectShape())

    // const elements = [[]]
    // let curIndex = 0
    // const generate = (fields, skipExtraFields?) => {
    //     Object.keys(fields).forEach((key) => {
    //         const field = fields[key]
    //         if(!field.hidden) {
    //             console.log('adding: ', key)
    //             if(elements[curIndex].length == numColumns) {
    //                 elements.push([])
    //                 curIndex++
    //             }
    //             elements[curIndex].push(field)
    //             //check if there are any after elements in extrafields for this element
    //             if(!skipExtraFields) {
    //                 extraFields.filter(ef => ef['after'] == key).forEach(ef => generate(ef['schema'], true))
    //             }

    //         }
    //     })
    // }


    console.log('final elements: ', model.getObjectSchema().merge(extraFields).isNot('hidden').getLayout(2))

    return <YStack ai="center" jc="center">
        {error && (
            <Notice>
                <Paragraph>{getErrorMessage(error.error)}</Paragraph>
            </Notice>
        )}

        {/* {
            elements.map((row, i) => <XStack key={i} mb={i==0?"$5":"$0"}>
                {
                    row.map((ele, i) => {
                        <Fieldset gap="$2">
                            <Label><Tinted><Stack mr="$2"><Mail color="var(--color9)" size={"$1"} strokeWidth={1} /></Stack></Tinted> {ele.label}</Label>
                            <Input value={data[ele.name] ?? ''} onChangeText={(t) => setData({ ...data, [data[ele.name]]: t })} placeholder="user@example.com" inputMode="email" autoFocus={mode == 'add'}></Input>
                        </Fieldset>
                    })
                }
            </XStack>)
        } */}
        <XStack mb="$5">
            <Fieldset gap="$2">
                <Label><Tinted><Stack mr="$2"><Mail color="var(--color9)" size={"$1"} strokeWidth={1} /></Stack></Tinted> Email</Label>
                <Input disabled={mode == 'edit'} value={data.username ?? ''} onChangeText={(t) => setData({ ...data, username: t })} placeholder="user@example.com" inputMode="email" autoFocus={mode == 'add'}></Input>
            </Fieldset>
            <Spacer size="$5" />
            <Fieldset gap="$2">
                <Label><Tinted><Stack mr="$2"><Tag color="var(--color9)" size={"$1"} strokeWidth={1} /></Stack></Tinted> Type</Label>
                <Input value={data.type ?? ''} onChangeText={(t) => setData({ ...data, type: t })} placeholder="user, admin, ..." autoFocus={mode == 'edit'}></Input>
            </Fieldset>
        </XStack>
        <XStack>
            <Fieldset gap="$2">
                <Label><Tinted><Stack mr="$2"><Key color="var(--color9)" size={"$1"} strokeWidth={1} /></Stack></Tinted> Password</Label>
                <Input value={data.password ?? ''} onChangeText={(t) => setData({ ...data, password: t })} placeholder="*********" secureTextEntry></Input>
            </Fieldset>
            <Spacer size="$5" />
            <Fieldset gap="$2">
                <Label><Tinted><Stack mr="$2"><Key color="var(--color9)" size={"$1"} strokeWidth={1} /></Stack></Tinted> Repeat password</Label>
                <Input value={data.repassword ?? ''} onChangeText={(t) => setData({ ...data, repassword: t })} placeholder="*********" secureTextEntry></Input>
            </Fieldset>
        </XStack>
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

export default function EditableUser({ data, onSave, mode = 'add' }: { data: any, onSave: Function, mode: 'add' | 'edit' }) {
    return <EditableObject 
        initialData={data} 
        mode={mode} 
        onSave={onSave} 
        model={UserModel.load(data)}
        extraFields={ProtoSchema.load(Schema.object({ 
            repassword: z.string().min(6).hint('Repeat password').after('password')
        }))}
        icons={{username: Mail, type: Tag, passwod: Key, repassword: Key}}
    />
}

/*
<YStack ai="center" jc="center">
        <XStack mb="$5">
            <Fieldset gap="$2">
                <Label><Tinted><Stack mr="$2"><Mail color="var(--color9)" size={"$1"} strokeWidth={1} /></Stack></Tinted> Email</Label>
                <Input disabled={mode=='edit'} value={data.username??''} onChangeText={(t)=>setData({...data, username: t})} placeholder="user@example.com" inputMode="email" autoFocus={mode=='add'}></Input>
            </Fieldset>
            <Spacer size="$5" />
            <Fieldset gap="$2">
                <Label><Tinted><Stack mr="$2"><Tag color="var(--color9)" size={"$1"} strokeWidth={1} /></Stack></Tinted> Type</Label>
                <Input value={data.type??''} onChangeText={(t)=>setData({...data, type: t})} placeholder="user, admin, ..." inputMode="email" autoFocus={mode=='edit'}></Input>
            </Fieldset>
        </XStack>
        <XStack>
            <Fieldset gap="$2">
                <Label><Tinted><Stack mr="$2"><Key color="var(--color9)" size={"$1"} strokeWidth={1} /></Stack></Tinted> Password</Label>
                <Input value={data.password??''} onChangeText={(t)=>setData({...data, password: t})} placeholder="*********" secureTextEntry></Input>
            </Fieldset>
            <Spacer size="$5" />
            <Fieldset  gap="$2">
                <Label><Tinted><Stack mr="$2"><Key color="var(--color9)" size={"$1"} strokeWidth={1} /></Stack></Tinted> Repeat password</Label>
                <Input value={data.repassword??''} onChangeText={(t)=>setData({...data, repassword: t})} placeholder="*********" secureTextEntry></Input>
            </Fieldset>
        </XStack>
    </YStack>
    */