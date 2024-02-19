import React from 'react';
import { Button, YStack, Dialog } from '@my/ui'
import useTheme from './diagram/Theme';
import { Drama } from 'lucide-react';

type Props = {
    nodeData: any;
    type: string;
};

export default ({ nodeData, type }: Props) => {
    const generateMask = () => {
        fetch('/adminapi/v1/mask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: nodeData.name,
                data: Object.keys(nodeData).filter(k => k.startsWith('prop')).map(k => nodeData[k].key),
                type: type
            }),
        })
            .then(response => response.json())
            .then(data => console.log(data))
    }

    return <Dialog modal>
        <Dialog.Trigger asChild>
            <YStack justifyContent='center'>
                <Button chromeless alignSelf="center" theme={"blue"} mb="$3">
                    {/* create mask */}
                    <Drama fillOpacity={0} color={useTheme('interactiveColor')} />
                </Button>
            </YStack>
        </Dialog.Trigger>
        <Dialog.Portal zIndex={999999999} overflow='hidden'>
            <Dialog.Overlay />
            <Dialog.Content
                bordered
                elevate
                animateOnly={['transform', 'opacity']}
                enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                gap="$4"
                maxWidth={600}
            >
                <Dialog.Title>Create a mask</Dialog.Title>
                <Dialog.Description>
                    {'When you click on create, a mask will be generated for the "' + nodeData.name + '" component. Any unsaved changes will be lost.'}
                </Dialog.Description>

                <Dialog.Close displayWhenAdapted asChild>
                    <Button theme='blue' onPress={generateMask}>
                        Create
                    </Button>
                </Dialog.Close>

            </Dialog.Content>
        </Dialog.Portal>
    </Dialog>
}