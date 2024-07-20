import { Paragraph, Spinner, Button, Spacer, XStack, YStack, Dialog } from 'tamagui'
import { getErrorMessage } from "../lib/error";
import { forwardRef, useEffect, useState } from 'react'
import { Tinted } from './Tinted'
import { Notice } from './Notice'
import Center from './Center'
import dynamic from 'next/dynamic';
//@ts-ignore
const Chat = dynamic(() => import('./Chat'), { ssr: false })

export const AlertDialog = forwardRef(({
    showCancel,
    hideAccept,
    onAccept = () => { },
    onCancel = () => { },
    title,
    trigger,
    description,
    children,
    cancelCaption = 'Cancel',
    acceptCaption = 'Accept',
    acceptTint,
    cancelTint = 'gray',
    acceptButtonProps = {},
    cancelButtonProps = {},
    open,
    setOpen,
    disableDrag = false,
    integratedChat = false,
    ...props
}: any, ref: any) => {

    const [_open, _setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<any>()
    
    const seter = setOpen !== undefined ? setOpen : _setOpen
    const status = setOpen !== undefined ? open : _open

    useEffect(() => {
        if (!status) {
            setError(undefined)
        }
    }, [status])
    const openState = open !== undefined ? open : _open
    return (<Dialog ref={ref} open={openState} onOpenChange={setOpen !== undefined ? setOpen : _setOpen}>
        {trigger && <Dialog.Trigger>
            {trigger}
        </Dialog.Trigger>}
        <Dialog.Portal >
            <Dialog.Overlay />
            <Dialog.Content scale={1} padding="$7" alignItems="flex-start" justifyContent="flex-start" {...props}>
                {integratedChat && openState && <Tinted>
                    {/* @ts-ignore */}
                    <Chat tags={['doc', title]} zIndex={999999999} onScreen={openState} mode="popup"/>
                </Tinted> }
                <YStack flex={1} width={"100%"}>
                    <YStack flex={1}>
                        {title && <XStack width={"100%"} flex={1}>
                            <XStack flex={1}>
                                <Dialog.Title>{title}</Dialog.Title>
                            </XStack>
                        </XStack>}
                        {description && <Dialog.Description marginTop="$3" marginBottom="$6">
                            <Center>{description}</Center>
                        </Dialog.Description>}

                        {error && (
                            <Notice>
                                <Paragraph>{getErrorMessage(error.error)}</Paragraph>
                            </Notice>
                        )}

                        <XStack flex={1}>
                            {children}
                        </XStack>

                        {!hideAccept && <YStack padding="$2" paddingTop="$0" width="100%" flex={1} alignSelf="center">
                            <Spacer flex={1} height="$2" />
                            <XStack>
                                {showCancel &&
                                    <Tinted tint={cancelTint}>
                                        <Button marginRight="$5" flex={1} onPress={() => {
                                            seter(false)
                                        }} aria-label="Close" {...cancelButtonProps}>
                                            {cancelCaption}
                                        </Button>
                                    </Tinted>}
                                <Tinted tint={acceptTint}>
                                    <Button id="alert-dlg-accept" flex={1} onPress={async () => {
                                        setLoading(true)
                                        try {
                                            const keepOpen = await onAccept(setOpen !== undefined ? setOpen : _setOpen)
                                            if(keepOpen !== true) seter(false)
                                        } catch (e) {
                                            setError(e)
                                            console.log('e: ', e)
                                        }
                                        setLoading(false)
                                    }} aria-label="Close" {...acceptButtonProps}>
                                        {loading ? <Spinner /> : acceptCaption}
                                    </Button>
                                </Tinted>
                            </XStack>
                        </YStack>}
                    </YStack>
                </YStack>
                <Dialog.Close />
            </Dialog.Content>

        </Dialog.Portal>
        {/* @ts-ignore */}
        <Dialog.Adapt when="sm" >
            <XStack position='absolute'>
                <Dialog.Sheet disableDrag={disableDrag}>
                    {/* ml -18 because there is an bug centering the dialog on sm screen */}
                    <Dialog.Sheet.Frame marginLeft="-18px">
                        <YStack padding={"$5"} paddingBottom="$12" flex={1}>
                            <Dialog.Adapt.Contents />
                        </YStack>
                    </Dialog.Sheet.Frame>
                    <Dialog.Sheet.Overlay />
                </Dialog.Sheet>
            </XStack>
        </Dialog.Adapt>
    </Dialog>)
})