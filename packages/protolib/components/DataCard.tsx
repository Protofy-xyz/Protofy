import { Theme, XStack, Paragraph, Stack, Spinner, Text, Dialog, Button, Popover, YStack } from 'tamagui'
import { useTint } from '../lib/Tints'
import { Check, FileEdit, X, Trash2 } from '@tamagui/lucide-icons'
import { useMemo, useState } from 'react'
import { ItemCard } from './ItemCard'
import JSONViewer from './jsonui/JSONViewer'
import { getPendingResult } from '../base/PendingResult'
import React from 'react'
import { IconContainer } from './IconContainer'

export const DataCard = React.forwardRef(({ compact=false, innerContainerProps = {}, extraIcons = [], iconProps = {}, itemCardProps = {}, minimal, json, name, onSave = (content) => { }, onDelete = () => { }, hideDeleteIcon, isTemplate = false, ...props }: any, ref: any) => {
    const { tint } = useTint()
    const [editable, setEditable] = useState(isTemplate)
    const [content, setContent] = useState(json)
    const [childKey, setChildKey] = useState(0);
    const [loadingState, setLoadingState] = useState(getPendingResult('pending'))
    const [originalContent, setOriginalContent] = useState(json)
    const [menuOpened, setMenuOpened] = useState(false)
    const onCancel = () => {
        setChildKey(prevKey => prevKey + 1);
        setContent(originalContent)
        setEditable(!editable)
    }

    const onDone = async () => {
        setChildKey(prevKey => prevKey + 1);
        setEditable(!editable)
        setOriginalContent(content)
        setLoadingState(await onSave(content) as any)
    }

    const onJsonUpdate = (obj) => {
        setContent(obj)
    }

    const memoizedJSONViewer = useMemo(() => {
        return (
            <JSONViewer
                compact={compact}
                key={childKey}
                onChange={onJsonUpdate}
                editable={editable}
                data={content}
                collapsible
            />
        );
    }, [compact, childKey, onJsonUpdate, editable, content]);

    return (
        <Stack ref={ref} {...props}>
            <ItemCard
                topBarOutSideScrollArea={minimal}
                backgroundColor={props.backgroundColor ?? "$color1"}
                {...itemCardProps}
                elevation={minimal ? 0 : 1}
                borderWidth={minimal ? 0 : 1}
                pointerEvents='none'
                pointerEventsControls="none"
                topBar={<Theme name={tint as any}>
                    <XStack justifyContent="flex-start" alignItems={'center'} paddingHorizontal="$3" width="100%">
                        <Paragraph flex={1} marginRight={"-$5"} opacity={0.8}>{!minimal ? name : ''}</Paragraph>
                        <Theme reset>
                            <XStack left={"-$10"}>
                                {!hideDeleteIcon ? <Popover onOpenChange={setMenuOpened} open={menuOpened} placement="bottom-end">
                                    {!isTemplate ? <Popover.Trigger>
                                        <XStack cursor="pointer" onPress={() => setMenuOpened(true)}>
                                            <Stack marginRight={"$3"} opacity={0.5} cursor="pointer" hoverStyle={{ opacity: 0.8 }}>
                                                <Trash2 size={"$1"} />
                                            </Stack>
                                        </XStack>

                                    </Popover.Trigger> : null}

                                    <Popover.Content padding={0} space={0} top={"$2"}>
                                        <YStack alignItems="center" justifyContent="center" padding={"$5"} paddingVertical={"$5"}>
                                            <Paragraph marginBottom="$3">
                                                <Text>
                                                    Are you sure?
                                                </Text>
                                            </Paragraph>
                                            <Button onPress={() => { onDelete(name) && setMenuOpened(false) }}><Trash2 size={"$1"} color="var(--red10)" /> Delete</Button>
                                        </YStack>
                                    </Popover.Content>

                                    {/* optionally change to sheet when small screen */}

                                </Popover> : null}

                                <XStack {...iconProps}>
                                    {editable ? <IconContainer paddingHorizontal={"$3"} onPress={() => { isTemplate ? onDelete(name, isTemplate) : onCancel() }}>
                                        <X color="var(--red9)" size={"$1"} />
                                    </IconContainer> : null}
                                    {!editable ? <IconContainer onPress={() => setEditable(!editable)}>
                                        <FileEdit size={"$1"} />
                                    </IconContainer> : <IconContainer onPress={onDone}>
                                        <Check color="var(--color9)" size={"$1"} />
                                    </IconContainer>}
                                    {extraIcons}
                                </XStack>
                            </XStack>
                        </Theme>
                    </XStack>
                </Theme>}
            >
                <Stack
                    f={1}
                    {...innerContainerProps}
                >
                    <Theme name={tint as any}>
                        <XStack y={0} p={"$0"} pt="$0" maxHeight={-1} overflow={"hidden"}>
                            {loadingState?.isLoading ?
                                <Spinner /> :
                                loadingState?.isError ?
                                    <Text>ERROR</Text> : memoizedJSONViewer
                            }
                        </XStack>
                    </Theme>
                </Stack>
            </ItemCard>
        </Stack>)
})