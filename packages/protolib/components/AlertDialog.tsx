import { Paragraph, Spinner, Stack, Unspaced, XStack, YStack } from 'tamagui'
import { Button, Dialog, Spacer, getErrorMessage } from '@my/ui'
import { forwardRef, useEffect, useState } from 'react'
import { Tinted, Notice } from 'protolib'
import { X, UserPlus, Check, Mail} from '@tamagui/lucide-icons'

export const AlertDialog = forwardRef(({ onAccept = () => { }, onCancel = () => { }, title, trigger, description, children, cancelCaption = 'Cancel', acceptCaption = 'Accept', acceptTint, acceptButtonProps={}, open, setOpen, ...props }: any, ref: any) => {
    const [_open, _setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<any>()
    const seter = setOpen !== undefined ? setOpen : _setOpen
    const status = setOpen !== undefined ? open : _open

    useEffect(() => {
        if(!status) {
            setError(undefined)
        }
    }, [status])
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

                        {error && (
                        <Notice>
                            <Paragraph>{getErrorMessage(error.error)}</Paragraph>
                        </Notice>
                        )}

                        <XStack width={'100%'}>
                            {children}
                        </XStack>

                        <Spacer flex={1} height="$4" />
                        <YStack p="$2" pt="$0" width="100%" f={1} alignSelf="center">
                            <Tinted tint={acceptTint}>
                                <Button f={1} onPress={async () => {
                                    setLoading(true)
                                    try {
                                        await onAccept(setOpen !== undefined ? setOpen : _setOpen)
                                        seter(false)
                                    } catch(e) {
                                        setError(e)
                                        console.log('e: ', e)
                                    }
                                    setLoading(false)
                                }} aria-label="Close" {...acceptButtonProps}>
                                    {loading?<Spinner /> : acceptCaption}
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