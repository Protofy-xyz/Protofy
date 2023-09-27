import { XStack } from 'tamagui'
import { Button, Dialog, Spacer } from '@my/ui'
import { forwardRef } from 'react'

export const AlertDialog = forwardRef(({title,trigger, description, children, cancelCaption='Cancel', acceptCaption='Accept'}:any, ref:any) => {
    return (<Dialog ref={ref}>
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
                    <Dialog.Close displayWhenAdapted asChild>
                        <Button backgroundColor={"transparent"} theme="alt1" aria-label="Close">
                            {cancelCaption}
                        </Button>
                    </Dialog.Close>

                    <Dialog.Close displayWhenAdapted asChild>
                        <Button theme="alt1" aria-label="Close">
                            {acceptCaption}
                        </Button>
                    </Dialog.Close>
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
                    <Dialog.Adapt.Contents />
                </Dialog.Sheet.Frame>
                <Dialog.Sheet.Overlay />
            </Dialog.Sheet>
        </Dialog.Adapt>
    </Dialog>)
})