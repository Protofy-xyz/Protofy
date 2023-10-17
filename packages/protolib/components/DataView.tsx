import { Theme, YStack, XStack, Paragraph, Text, Button, Stack, Checkbox, Dialog, ScrollView } from 'tamagui'
import { Chip, DataTableCard, getPendingResult, AlertDialog, DataTable2, API, Search, Tinted, EditableObject, usePendingEffect, AsyncView, Notice, ActiveGroup, ActiveGroupButton, ButtonGroup, XCenterStack, ActiveRender } from 'protolib'
import { useEffect, useState } from 'react'
import { Plus, LayoutGrid, List, Trash2, Cross, CheckCheck, Check } from '@tamagui/lucide-icons'
import { z } from "zod";
import { PendingAtomResult } from '@/packages/protolib/lib/createApiAtom'
import { getErrorMessage, useToastController } from '@my/ui'
import { useUpdateEffect } from 'usehooks-ts';
import { usePageParams} from 'protolib/next'

import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';

export function DataView({ onSelectItem, itemData, rowIcon, disableViewSelector=false, initialItems, sourceUrl, numColumnsForm = 1, name, hideAdd = false, pageState, icons = {}, model, extraFields = {}, columns, onEdit = (data) => data, onAdd = (data) => data }:any) {
    const [items, setItems] = useState<PendingAtomResult | undefined>(initialItems);
    const [currentItems, setCurrentItems] = useState<PendingAtomResult | undefined>(initialItems)
    const [createOpen, setCreateOpen] = useState(false)
    const [state, setState] = useState(pageState)
    const {push, mergePush, removePush} = usePageParams(pageState, state, setState)
    const [selected, setSelected] = useState([])
    const [currentItemData, setCurrentItemData] = useState(itemData)
    const fetch = async () => {
        API.get({ url: sourceUrl, ...state }, setItems)
    }

    usePendingEffect((s) => {API.get({ url: sourceUrl, ...pageState }, s)}, setItems, initialItems)

    useEffect(() => {
        if (items && items.isLoaded) {
            setCurrentItems(items)
        }
    }, [items])

    useUpdateEffect(() => {
        fetch();
    }, [state])

    const onSearch = async (text) => push("search", text)
    const onCancelSearch = async () => setCurrentItems(items)
    const toast = useToastController()
    const tableColumns = rowIcon?[DataTable2.column("", "", false, row => <Stack o={0.6}>{React.createElement(rowIcon, {size: "$1"})}</Stack>, true, '50px'), ...columns]:columns

    const conditionalRowStyles = [
        {
          when: row => selected.includes(model.load(row).getId()),
          style: {
            backgroundColor: 'var(--color4)'
          },
          '&:hover': {
            backgroundColor: 'var(--color4)'
          }
        },
    ];
    return (
        <YStack f={1}>
            <ActiveGroup initialState={!state || state.view == 'list'?0:1}>
                <AlertDialog
                    p="$3"
                    setOpen={setCreateOpen}
                    open={createOpen}
                    hideAccept={true}
                    description={""}
                >
                    <YStack f={1} jc="center" ai="center">
                    <ScrollView maxHeight={"90vh"}>
                        <EditableObject
                            name={name}
                            numColumns={numColumnsForm}
                            mode={'add'}
                            onSave={async (originalData, data) => {
                                try {
                                    const user = model.load(data)
                                    const result = await API.post(sourceUrl, onAdd(user.create().getData()))
                                    if (result.isError) {
                                        throw result.error
                                    }
                                    fetch()
                                    setCreateOpen(false);
                                    toast.show('User created', {
                                        message: user.getId()
                                    })
                                } catch (e) {
                                    throw getPendingResult('error', null, e instanceof z.ZodError ? e.flatten() : e)
                                }
                            }}
                            model={model}
                            extraFields={extraFields}
                            icons={icons}
                        />
                        </ScrollView>
                    </YStack>
                </AlertDialog>
                <AlertDialog
                    hideAccept={true}
                    acceptCaption="Save"
                    setOpen={(s) => {
                        setCurrentItemData(undefined); 
                        removePush('item')
                    }}
                    open={state.item}
                    description={""}
                >
                    <YStack f={1} jc="center" ai="center">
                    <ScrollView maxHeight={"90vh"}>
                        <EditableObject
                            initialData={currentItemData}
                            name={name}
                            minHeight={350} minWidth={490}
                            spinnerSize={75}
                            loadingText={<YStack ai="center" jc="center">Loading data for {name}<Paragraph fontWeight={"bold"}>{state.item}</Paragraph></YStack>}
                            objectId={state.item}
                            sourceUrl={sourceUrl+'/'+state.item}
                            numColumns={numColumnsForm}
                            mode={'edit'}
                            onSave={async (original, data) => {
                                try {
                                    setCurrentItemData(undefined)
                                    const id = model.load(data).getId()
                                    const result = await API.post(sourceUrl + '/' + id, onEdit(model.load(original).update(model.load(data)).getData()))
                                    if (result.isError) {
                                        throw result.error
                                    }
                                    fetch()
                                    const {item, ...rest} = state; 
                                    setState(rest)
                                    toast.show('User updated', {
                                        message: "Saved new settings for user: " + id
                                    })
                                } catch (e) {
                                    throw getPendingResult('error', null, e instanceof z.ZodError ? e.flatten() : e)
                                }
                            }}
                            model={model}
                            extraFields={extraFields}
                            icons={icons}
                        />
                        </ScrollView>
                    </YStack>
                </AlertDialog>

                <XStack pt="$3" px="$7" mb="$5">
                    <YStack left={-12} top={9} f={1}>
                        <Paragraph>
                            <Text fontSize="$6" color="$color11">{name.charAt(0).toUpperCase() + name.slice(1)}s [<Tinted><Text fontSize={"$5"} o={1} color="$color10">{currentItems?.data?.total}</Text></Tinted>]</Text>
                        </Paragraph>
                    </YStack>

                    <XStack position={"absolute"} right={0}>
                        <Search top={1} initialState={state?.search} onCancel={onCancelSearch} onSearch={onSearch} />
                        {!hideAdd && <XStack marginLeft="$3" top={-3}>
                                {!disableViewSelector && <ButtonGroup marginRight="$3">
                                    <ActiveGroupButton onSetActive={() => push('view','list')} activeId={0}>
                                        <List size="$1" strokeWidth={1} />
                                    </ActiveGroupButton>
                                    <ActiveGroupButton onSetActive={() => push('view', 'cards')} activeId={1}>
                                        <LayoutGrid size='$1' strokeWidth={1} />
                                    </ActiveGroupButton>
                                </ButtonGroup>}
                                <Tinted>
                                <Button hoverStyle={{ o: 1 }} o={0.7} circular onPress={() => {
                                    setCreateOpen(true)
                                }} chromeless={true}>
                                    <Plus />
                                </Button>
                            </Tinted>
                        </XStack>}

                    </XStack>
                </XStack>

                {items && items.isError && (
                    <Notice>
                        <Paragraph>{getErrorMessage(items.error)}</Paragraph>
                    </Notice>
                )}

                <AsyncView atom={currentItems}>
                    <Stack pr={"$1"} f={1}>
                        <Scrollbars universal={true} height={"100%"} >
                            <ActiveRender activeId={1}>
                                    <DataTableCard model={model} items={currentItems?.data?.items} />
                            </ActiveRender>
                            <ActiveRender activeId={0}>
                                <XStack mr="$3" pt="$1" flexWrap='wrap'>
                                    <Tinted>
                                    <DataTable2.component
                                        pagination={true}
                                        conditionalRowStyles={conditionalRowStyles}
                                        rowsPerPage={state.itemsPerPage}
                                        handleSort={(column, orderDirection) => mergePush({ orderBy: column.selector, orderDirection })}
                                        handlePerRowsChange={(itemsPerPage) => push('itemsPerPage', itemsPerPage)}
                                        handlePageChange={(page) => push('page', parseInt(page, 10) - 1 )}
                                        currentPage={parseInt(state.page, 10) + 1}
                                        totalRows={currentItems?.data?.total}
                                        columns={[DataTable2.column(
                                            <Theme reset><Stack ml="$3" o={0.8}>
                                            <Checkbox focusStyle={{outlineWidth:0}} checked={selected.length > 1} onPress={(e) => {

                                                if(selected.length) {
                                                    setSelected([])
                                                } else {
                                                    console.log('selection all: ', currentItems?.data?.items.map(x => model.load(x).getId()))
                                                    setSelected(currentItems?.data?.items.map(x => model.load(x).getId()))
                                                }
                                            }}>
                                                <Checkbox.Indicator>
                                                    <CheckCheck />
                                                </Checkbox.Indicator>
                                            </Checkbox>
                                        </Stack></Theme>, "", false, row => <Theme reset><Stack ml="$3" o={0.8}>
                                            <Checkbox focusStyle={{outlineWidth:0}} onPress={() => {
                                                const id = model.load(row).getId()
                                                setSelected(selected.indexOf(id) != -1 ? selected.filter((ele) => ele !== id) : [...selected, id])
                                            }} checked={selected.includes(model.load(row).getId())}>
                                                <Checkbox.Indicator>
                                                    <Check />
                                                </Checkbox.Indicator>
                                            </Checkbox>
                                        </Stack></Theme>, true, '65px'),...tableColumns]}
                                        rows={currentItems?.data?.items}
                                        onRowPress={(rowData) => onSelectItem ? onSelectItem(model.load(rowData)) : push('item', model.load(rowData).getId())}
                                    />
                                    </Tinted>
                                </XStack>
                            </ActiveRender>
                        </Scrollbars>
                    </Stack>

                </AsyncView>
            </ActiveGroup>
        </YStack>
    )
}