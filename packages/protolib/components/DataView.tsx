import { YStack, XStack, Paragraph, Text, Button } from 'tamagui'
import { getPendingResult, AlertDialog, Chip, DataTable2, API, Search, Tinted, EditableObject, usePendingEffect, AsyncView, Notice} from 'protolib'
import { useEffect, useState } from 'react'
import { Plus } from '@tamagui/lucide-icons'
import moment from 'moment';
import { z } from "zod";
import { PendingAtomResult } from '@/packages/protolib/lib/createApiAtom'
import {getErrorMessage} from '@my/ui'
import { useUpdateEffect } from 'usehooks-ts';

export function DataView({ initialItems, sourceUrl, icons={}, model, defaultCreateData={}, extraFields={}, columns, onEdit=(data) => data, onAdd=(data) => data}) {
    const [items, setItems] = useState<PendingAtomResult | undefined>(initialItems);
    const [currentItems, setCurrentItems] = useState<PendingAtomResult | undefined>(initialItems)
    const [currentItem, setCurrentItem] = useState<any>()
    const [createOpen, setCreateOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [sort, setSort] = useState<any>()
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState('')

    const fetch = () => {
        API.get(sourceUrl+'?page='+(currentPage-1)+(sort?'&orderBy='+sort.orderBy+'&direction='+sort.direction:'')+(search?'&search='+search:''), setItems)
    }

    usePendingEffect((s) => API.get(sourceUrl, s), setItems, initialItems)

    useEffect(() => {
        if(items && items.isLoaded) {
            setCurrentItems(items)
        }
    }, [items])

    useUpdateEffect(() => fetch(), [currentPage, sort, search])

    const onSearch = async (text) => setSearch(text)
    const onCancelSearch = async () => setCurrentItems(items)

    return (
        <YStack f={1}>
            <AlertDialog
                p="$3"
                setOpen={setCreateOpen}
                open={createOpen}
                hideAccept={true}
                title={<Text><Tinted><Text color="$color9">Create</Text></Tinted><Text color="$color11"> account</Text></Text>}
                description={""}
            >
                <YStack f={1} jc="center" ai="center">
                <EditableObject 
                    initialData={currentItem} 
                    mode={'add'} 
                    onSave={async (data) => {
                        try {
                            await API.post(sourceUrl, onAdd(model.load(data).create().getData()))
                            const items = await API.get(sourceUrl)
                            setItems(items)
                        } catch (e) {
                            throw getPendingResult('error', null, e instanceof z.ZodError ? e.flatten(): e)
                        }
                        setCreateOpen(false);
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
                        initialData={currentItem} 
                        mode={'edit'} 
                        onSave={async (data) => {
                            try {
                                await API.post(sourceUrl, onEdit(model.load(data).create().getData()))
                                const items = await API.get(sourceUrl)
                                setItems(items)
                            } catch (e) {
                                throw getPendingResult('error', null, e instanceof z.ZodError ? e.flatten(): e)
                            }
                            setEditOpen(false);
                        }} 
                        model={model.load(currentItem)}
                        extraFields={extraFields}
                        icons={icons}
                    />
                </YStack>
            </AlertDialog>

            <XStack pt="$3" px="$4">
                <YStack left={-12} top={9} f={1}>
                    <Paragraph>
                        <Text fontSize="$6" color="$color11">Users [<Tinted><Text fontSize={"$5"} o={1} color="$color10">{currentItems?.data?.items?.length}</Text></Tinted>]</Text>
                    </Paragraph>
                </YStack>

                <XStack position={"absolute"} right={0}>
                    <Search onCancel={onCancelSearch} onSearch={onSearch} />
                    <XStack top={-3}>
                        <Tinted>
                            <Button hoverStyle={{ o: 1 }} o={0.7} circular onPress={() => {setCurrentItem(defaultCreateData);setCreateOpen(true)}} chromeless={true}>
                                <Plus />
                            </Button>
                        </Tinted>
                    </XStack>

                </XStack>
            </XStack>

            {items && items.isError && (
                <Notice>
                    <Paragraph>{getErrorMessage(items.error)}</Paragraph>
                </Notice>
            )}


            <AsyncView atom={currentItems}>
                <XStack pt="$1" flexWrap='wrap'>
                    <DataTable2.component
                        handleSort={(selectedColumn, sortDirection, sortedRows) => {
                            setSort({orderBy:selectedColumn.selector ??selectedColumn.name, direction: sortDirection})
                        }}
                        handlePageChange={(page) => setCurrentPage(page)}
                        currentPage={1}
                        totalRows={currentItems?.data.total}
                        columns={columns}
                        rows={currentItems?.data.items}
                        onRowPress={(rowData)=>{setCurrentItem(rowData);setEditOpen(true)}}
                    />
                </XStack>
            </AsyncView>           

        </YStack>
    )
}