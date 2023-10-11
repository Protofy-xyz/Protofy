import { Button, Fieldset, Input, Label, Spacer, Stack, XStack, YStack, Paragraph, Spinner } from "tamagui";
import { Mail, Tag, Key } from '@tamagui/lucide-icons';
import { Tinted, Notice} from 'protolib'
import { ProtoModel } from "protolib/base";
import { UserModel } from "../usersModels";
import { useState } from "react";
import {getErrorMessage} from "@my/ui";

type EditableObjectProps = {
    initialData: any,
    onSave: Function,
    model: ProtoModel<any>,
    mode: 'add' | 'edit'
}

const EditableObject = ({ initialData, onSave, mode = 'add', model }: EditableObjectProps) => {
    const [data, setData] = useState(initialData)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<any>()
    return <YStack ai="center" jc="center">
        {error && (
            <Notice>
                <Paragraph>{getErrorMessage(error.error)}</Paragraph>
            </Notice>
        )}
        <XStack mb="$5">
            <Fieldset gap="$2">
                <Label><Tinted><Stack mr="$2"><Mail color="var(--color9)" size={"$1"} strokeWidth={1} /></Stack></Tinted> Email</Label>
                <Input disabled={mode == 'edit'} value={data.username ?? ''} onChangeText={(t) => setData({ ...data, username: t })} placeholder="user@example.com" inputMode="email" autoFocus={mode == 'add'}></Input>
            </Fieldset>
            <Spacer size="$5" />
            <Fieldset gap="$2">
                <Label><Tinted><Stack mr="$2"><Tag color="var(--color9)" size={"$1"} strokeWidth={1} /></Stack></Tinted> Type</Label>
                <Input value={data.type ?? ''} onChangeText={(t) => setData({ ...data, type: t })} placeholder="user, admin, ..." inputMode="email" autoFocus={mode == 'edit'}></Input>
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
                    {loading ? <Spinner /> : mode=='add' ? 'Create' :  'Save'}
                </Button>
            </Tinted>
        </YStack>
    </YStack>
}

export default function EditableUser({ data, onSave, mode = 'add' }: { data: any, onSave: Function, mode: 'add' | 'edit' }) {
    return <EditableObject initialData={data} mode={mode} onSave={onSave} model={UserModel.load(data)} />
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