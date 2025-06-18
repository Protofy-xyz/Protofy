import { YStack, Text, Button, Input, XStack } from '@my/ui';
import { DashboardCard } from './DashboardCard';
import { useEffect, useState } from 'react';
import { getKey } from "@extensions/keys/coreContext";
import { KeyModel } from "@extensions/keys/keysSchemas";
import { API } from 'protobase';
import { useRemoteStateList } from '../lib/useRemoteState';
import { usePendingEffect } from '../lib/usePendingEffect';
import { useSubscription } from '../lib/mqtt';
import { Check, RefreshCcw, Trash2, Plus } from '@tamagui/lucide-icons';
import { Tinted } from './Tinted';
// import { getServiceToken } from '@extensions/apis/coreContext';

interface KeySetterProps {
    nameKey: string;
}

export const KeySetter: React.FC<KeySetterProps> = ({
    nameKey,
}) => {

    const [value, setValue] = useState("");
    const [currKey, setCurrKey] = useState<any>("");

    const loadKey = async () => {
        const keyRes = await getKey({
            key: nameKey
        });

        if (keyRes && keyRes.trim() !== "") {
            setCurrKey(keyRes);
        } else {
            setCurrKey("");
        }
    }

    const onEditKey = async (keyVal) => {
        const res = await API.post("/api/core/v1/keys/" + nameKey, { name: nameKey, value: keyVal });
        if (res?.data) {
            console.log("DEV: Key saved: ", res.data);
            setCurrKey(res?.data.value);
        }
    }

    useEffect(() => {
        loadKey()
    }, [])

    return <YStack p="$4">
        {
            currKey && currKey !== "" && currKey != "put your key here"
                ? <XStack ai="center" jc="space-between" gap="$4" flexWrap='wrap'>
                    <XStack ai="center" gap="$2">
                        <Text>{nameKey}</Text>
                        <Check color="$green10" size={14} strokeWidth={4} />
                    </XStack>
                    <XStack gap="$2" ai="center">
                        <Tinted tint="red">
                            <Button circular icon={Trash2} onPress={() => onEditKey("put your key here")}></Button>
                        </Tinted>
                        <Button bc="transparent" circular icon={RefreshCcw} onPress={loadKey}></Button>
                    </XStack>
                </XStack>
                : <YStack>
                    <XStack ai="center" jc="space-between" gap="$4" flexWrap='wrap'>
                        <YStack ai="center" gap="$2">
                            <Text col="$red8" fost="italic" pos="absolute" top="-25px" l={0}>Required!</Text>
                            <Text>{nameKey}</Text>
                        </YStack>
                        <XStack gap="$2" ai="center" flex={1}>
                            <Input
                                f={1}
                                placeholder='put your key here'
                                value={value}
                                bc="$bgContent"
                                secureTextEntry={true}
                                onChangeText={(text) => setValue(text)}
                            />
                            <Tinted>
                                <Button circular icon={Plus} onPress={() => onEditKey(value)}></Button>
                            </Tinted>
                        </XStack>
                    </XStack>
                </YStack>
        }
    </YStack>
};
