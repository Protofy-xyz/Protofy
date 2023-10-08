import { Fieldset, Input, Label, Spacer, Stack, XStack, YStack } from "tamagui";
import {Mail, Tag, SquareAsterisk, Key} from '@tamagui/lucide-icons';
import {Tinted} from 'protolib'

export default function CreateUser({ }) {
    return <YStack ai="center" jc="center">
        <XStack mb="$5">
            <Fieldset gap="$2">
                <Label><Tinted><Stack mr="$2"><Mail color="var(--color9)" size={"$1"} strokeWidth={1} /></Stack></Tinted> Email</Label>
                <Input placeholder="user@example.com" inputMode="email" autoFocus></Input>
            </Fieldset>
            <Spacer size="$5" />
            <Fieldset gap="$2">
                <Label><Tinted><Stack mr="$2"><Tag color="var(--color9)" size={"$1"} strokeWidth={1} /></Stack></Tinted> Type</Label>
                <Input placeholder="user, admin, ..." inputMode="email" autoFocus></Input>
            </Fieldset>
        </XStack>
        <XStack>
            <Fieldset gap="$2">
                <Label><Tinted><Stack mr="$2"><Key color="var(--color9)" size={"$1"} strokeWidth={1} /></Stack></Tinted> Password</Label>
                <Input placeholder="*********" secureTextEntry autoFocus></Input>
            </Fieldset>
            <Spacer size="$5" />
            <Fieldset  gap="$2">
                <Label><Tinted><Stack mr="$2"><Key color="var(--color9)" size={"$1"} strokeWidth={1} /></Stack></Tinted> Repeat password</Label>
                <Input placeholder="*********" secureTextEntry autoFocus></Input>
            </Fieldset>
        </XStack>
    </YStack>
}