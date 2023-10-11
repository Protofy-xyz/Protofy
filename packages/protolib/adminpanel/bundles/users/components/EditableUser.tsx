import { Button, Fieldset, Input, Label, Spacer, Stack, XStack, YStack, Paragraph, Spinner } from "tamagui";
import { Mail, Tag, Key, Pencil, TextCursor } from '@tamagui/lucide-icons';
import { Tinted, Notice } from 'protolib'
import { ProtoModel } from "protolib/base";
import { UserModel } from "../usersModels";
import React, { useState } from "react";
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

    const formFields = model.getObjectSchema().merge(extraFields).isNot('hidden').getLayout(2)
    console.log('form fields: ', formFields)
    return <YStack ai="center" jc="center">
        {error && (
            <Notice>
                <Paragraph>{getErrorMessage(error.error)}</Paragraph>
            </Notice>
        )}
        <YStack ai="center" jc="center">
            {
                formFields.map((row, x) => <XStack key={x} mb={x==0?"$5":"$0"}>
                    {
                        row.map((ele, i) => {
                            const icon = icons[ele.name] ? icons[ele.name] : Pencil
                            console.log('ele: ', ele)
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

export default function EditableUser({ data, onSave, mode = 'add' }: { data: any, onSave: Function, mode: 'add' | 'edit' }) {
    return <EditableObject 
        initialData={data} 
        mode={mode} 
        onSave={onSave} 
        model={UserModel.load(data)}
        extraFields={ProtoSchema.load(Schema.object({ 
            repassword: z.string().min(6).hint('Repeat password').after('password').hint('**********').secret()
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