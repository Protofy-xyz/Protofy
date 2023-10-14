import { Theme, YStack, XStack, Paragraph, Text, Button, Stack, Checkbox } from 'tamagui'
import { Chip, DataTableCard, getPendingResult, AlertDialog, DataTable2, API, Search, Tinted, EditableObject, usePendingEffect, AsyncView, Notice, ActiveGroup, ActiveGroupButton, ButtonGroup, XCenterStack, ActiveRender } from 'protolib'
import { useEffect, useState } from 'react'
import { Plus, LayoutGrid, List, Trash2, Cross, CheckCheck, Check } from '@tamagui/lucide-icons'
import { z } from "zod";
import { PendingAtomResult } from '@/packages/protolib/lib/createApiAtom'
import { getErrorMessage, useToastController } from '@my/ui'
import { useUpdateEffect } from 'usehooks-ts';
import { useRouter } from 'next/router';
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';

export function DataView({ rowIcon, disableViewSelector=false, initialItems, sourceUrl, numColumnsForm = 1, name, hideAdd = false, pageState, icons = {}, model, defaultCreateData = {}, extraFields = {}, columns, onEdit = (data) => data, onAdd = (data) => data }:any) {
    const [items, setItems] = useState<PendingAtomResult | undefined>(initialItems);
    const [currentItems, setCurrentItems] = useState<PendingAtomResult | undefined>(initialItems)
    const [currentItem, setCurrentItem] = useState<any>()
    const [createOpen, setCreateOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const { push, query } = useRouter();
    const [state, setState] = useState(pageState)
    const [selected, setSelected] = useState([])

    const fetch = async () => {
        return API.get({ url: sourceUrl, ...state })
    }
    usePendingEffect((s) => API.get({ url: sourceUrl, ...pageState }, s), setItems, initialItems)

    useEffect(() => {
        if (items && items.isLoaded) {
            setCurrentItems(items)
        }
    }, [items])

    useUpdateEffect(() => {
        const update = async () => {
            setItems(await fetch())
            push({
                query: {
                    ...query,
                    ...state
                }
            }, undefined, { shallow: true })
        }
        update()
    }, [state])

    const onSearch = async (text) => setState({ ...state, search: text })
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
                    title={<Text><Tinted><Text color="$color9">Create</Text></Tinted><Text color="$color11"> {name}</Text></Text>}
                    description={""}
                >
                    <YStack f={1} jc="center" ai="center">
                        <EditableObject
                            numColumns={numColumnsForm}
                            initialData={currentItem}
                            mode={'add'}
                            onSave={async (data) => {
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
                            model={model.load(currentItem)}
                            extraFields={extraFields}
                            icons={icons}
                        />
                    </YStack>
                </AlertDialog>
                <AlertDialog
                    hideAccept={true}
                    acceptCaption="Save"
                    setOpen={setEditOpen}
                    open={editOpen && currentItem}
                    title={<Text><Tinted><Text color="$color9">Edit</Text></Tinted><Text color="$color11"> account</Text></Text>}
                    description={""}
                >
                    <YStack f={1} jc="center" ai="center">
                        <EditableObject
                            numColumns={2}
                            initialData={currentItem}
                            mode={'edit'}
                            onSave={async (data) => {
                                try {
                                    const id = model.load(data).getId()
                                    const result = await API.post(sourceUrl + '/' + id, onEdit(model.load(currentItem).update(model.load(data)).getData()))
                                    if (result.isError) {
                                        throw result.error
                                    }
                                    fetch()
                                    setEditOpen(false);
                                    toast.show('User updated', {
                                        message: "Saved new settings for user: " + id
                                    })
                                } catch (e) {
                                    throw getPendingResult('error', null, e instanceof z.ZodError ? e.flatten() : e)
                                }
                            }}
                            model={model.load(currentItem)}
                            extraFields={extraFields}
                            icons={icons}
                        />
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
                                    <ActiveGroupButton onSetActive={() => setState({...state, view: 'list'})} activeId={0}>
                                        <List size="$1" strokeWidth={1} />
                                    </ActiveGroupButton>
                                    <ActiveGroupButton onSetActive={() => setState({...state, view: 'cards'})} activeId={1}>
                                        <LayoutGrid size='$1' strokeWidth={1} />
                                    </ActiveGroupButton>
                                </ButtonGroup>}
                                <Tinted>
                                <Button hoverStyle={{ o: 1 }} o={0.7} circular onPress={() => {
                                    setCurrentItem(defaultCreateData);
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
                    <Scrollbars height={"100%"} >
                        <ActiveRender activeId={1}>
                            <DataTableCard items={currentItems?.data?.items} />
                        </ActiveRender>
                        <ActiveRender activeId={0}>
                            <XStack pt="$1" flexWrap='wrap'>
                                <Tinted>
                                <DataTable2.component
                                    conditionalRowStyles={conditionalRowStyles}
                                    rowsPerPage={state.itemsPerPage}
                                    handleSort={(column, orderDirection) => setState({ ...state, orderBy: column.selector, orderDirection })}
                                    handlePerRowsChange={(itemsPerPage) => setState({ ...state, itemsPerPage })}
                                    handlePageChange={(page) => setState({ ...state, page: parseInt(page, 10) - 1 })}
                                    currentPage={parseInt(state.page, 10) + 1}
                                    totalRows={currentItems?.data?.total}
                                    columns={[DataTable2.column(
                                        <Theme reset><Stack ml="$3" o={0.6}>
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
                                    </Stack></Theme>, "", false, row => <Theme reset><Stack ml="$3" o={0.6}>
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
                                    onRowPress={(rowData) => { setCurrentItem(rowData); setEditOpen(true) }}
                                />
                                </Tinted>
                            </XStack>
                        </ActiveRender>
                    </Scrollbars>
                </AsyncView>
            </ActiveGroup>
        </YStack>
    )
}