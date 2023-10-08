import { Stack, Unspaced, XStack, YStack } from 'tamagui'
import { Button, Dialog, Spacer } from '@my/ui'
import { forwardRef, useState } from 'react'
import { Tinted } from 'protolib'
import { X, UserPlus, Check, Mail} from '@tamagui/lucide-icons'

export const AlertDialog = forwardRef(({ onAccept = () => { }, onCancel = () => { }, title, trigger, description, children, cancelCaption = 'Cancel', acceptCaption = 'Accept', open, setOpen, ...props }: any, ref: any) => {
    const [_open, _setOpen] = useState(false)
    const seter = setOpen !== undefined ? setOpen : _setOpen
    return (<Dialog ref={ref} open={open !== undefined ? open : _open} onOpenChange={setOpen !== undefined ? setOpen : _setOpen}>
        <Dialog.Trigger>
            {trigger}
        </Dialog.Trigger>
        <Dialog.Portal>
            <Dialog.Overlay />
            <Dialog.Content scale={1} p="$5" ai="flex-start" jc="flex-start" {...props}>
                <YStack f={1}>
                    <YStack p={"$5"} f={1}>
                        <XStack width={"100%"} f={1}>
                            <XStack f={1}>
                                <Dialog.Title>{title}</Dialog.Title>
                            </XStack>

                            {/* <Button
                        onPress={() => { seter(false); onCancel() }}
                        backgroundColor={"$backgroundTransparent"}
                        size="$5"
                        circular
                        icon={X}
                    /> */}
                        </XStack>
                        <Dialog.Description mt="$3" mb="$6">
                            {description}
                        </Dialog.Description>

                        <XStack width={'100%'}>
                            {children}
                        </XStack>

                        <Spacer flex={1} height="$4" />
                        <YStack p="$2" pt="$0" width="100%" f={1} alignSelf="center">
                            <Tinted>
                                <Button f={1} onPress={() => onAccept(setOpen !== undefined ? setOpen : _setOpen)} aria-label="Close">
                                    {acceptCaption}
                                </Button>
                            </Tinted>
                        </YStack>
                    </YStack>


                </YStack>

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