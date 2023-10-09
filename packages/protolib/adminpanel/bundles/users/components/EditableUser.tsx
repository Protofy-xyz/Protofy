import { Fieldset, Input, Label, Spacer, Stack, XStack, YStack } from "tamagui";
import {Mail, Tag, SquareAsterisk, Key} from '@tamagui/lucide-icons';
import {Tinted} from 'protolib'

export default function EditableUser({data, setData, mode='add'}) {
    return <YStack ai="center" jc="center">
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
}