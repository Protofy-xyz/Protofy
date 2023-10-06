import { Stack, XStack, YStack } from 'tamagui'
import { Button, Dialog, Spacer } from '@my/ui'
import { forwardRef, useState } from 'react'

export const AlertDialog = forwardRef(({onAccept=() => {}, onCancel=() => {},title,trigger, description, children, cancelCaption='Cancel', acceptCaption='Accept', open, setOpen}:any, ref:any) => {
    const [_open, _setOpen] = useState(false) 
    return (<Dialog ref={ref} open={open !== undefined ? open : _open} onOpenChange={setOpen !== undefined ? setOpen : _setOpen}>
        <Dialog.Trigger>
            {trigger}
        </Dialog.Trigger>
        <Dialog.Portal>
            <Dialog.Overlay />
            <Dialog.Content scale={1.2} p="$5" ai="flex-start" jc="flex-start" width={450}>
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.Description mt="$3" mb="$6">
                    {description}
                </Dialog.Description>
                
                <XStack width={'100%'}>
                    {children}
                </XStack>
                
                
                <Spacer flex={1} height="$4" />
                <XStack alignSelf="flex-end" gap="$4">
                    <Dialog.Close onPress={onCancel} displayWhenAdapted asChild>
                        <Button backgroundColor={"transparent"} theme="alt1" aria-label="Close">
                            {cancelCaption}
                        </Button>
                    </Dialog.Close>

        
                    <Button onPress={() => onAccept(setOpen !== undefined ? setOpen : _setOpen)} theme="alt1" aria-label="Close">
                        {acceptCaption}
                    </Button>
    
                </XStack>
{/* 
                <Unspaced>
                    <Dialog.Close asChild>
                        <Button
                            position="absolute"
                            top="$4"
                            right="$4"
                            size="$2"
                            circular
                            icon={X}
                        />
                    </Dialog.Close>
                </Unspaced> */}

                <Dialog.Close />
            </Dialog.Content>
        </Dialog.Portal>

        <Dialog.Adapt when="sm">
            <Dialog.Sheet>
                <Dialog.Sheet.Frame>
                    <YStack p={"$5"} f={1}>
                        <Dialog.Adapt.Contents />
                    </YStack>

                </Dialog.Sheet.Frame>
                <Dialog.Sheet.Overlay />
            </Dialog.Sheet>
        </Dialog.Adapt>
    </Dialog>)
})