import { YStack, XStack, Label, Button, Input, ScrollView } from '@my/ui'
import { Trash } from '@tamagui/lucide-icons'
import { useCallback } from 'react'
import { InteractiveIcon } from '../InteractiveIcon';

export const ParamsEditor = ({ params, setParams }) => {

    const handleAddParam = useCallback(() => {
        setParams([...params, { name: '', description: '' }]);
    }, [params, setParams]);

    const handleRemoveParam = useCallback((index) => {
        const newParams = [...params];
        newParams.splice(index, 1);
        setParams(newParams);
    }, [params, setParams]);

    const handleChangeParam = useCallback((index, field, value) => {
        const newParams = [...params];
        newParams[index] = { ...newParams[index], [field]: value };
        setParams(newParams);
    }, [params, setParams]);

    return (
        <YStack
            flex={1}
            height="100%"
            borderRadius="$3"
            p="$3"
            backgroundColor="$gray3"
            overflow="hidden"
        >

            <XStack alignItems="center" justifyContent="space-between">
                <Label size="$4">Parameters</Label>
                <Button onPress={handleAddParam}>Add param</Button>
            </XStack>

            {/* Filas (una por cada “param”) */}
            <ScrollView mt="$3" flex={1}>
                {params.map((param, i) => (
                    <XStack
                        key={i}
                        space="$2"
                        alignItems="center"
                        padding="$2"
                        borderRadius="$2"
                    >
                        <Input
                            placeholder="Name"
                            flex={1}
                            value={param.name}
                            onChange={(e) => handleChangeParam(i, 'name', e.target.value)}
                        />
                        <Input
                            placeholder="Description"
                            flex={2}
                            value={param.description}
                            onChange={(e) => handleChangeParam(i, 'description', e.target.value)}
                        />
                        <InteractiveIcon Icon={Trash} IconColor="var(--red10)" onPress={() => handleRemoveParam(i)}></InteractiveIcon>
                    </XStack>
                ))}
            </ScrollView>
        </YStack>
    );
};
