import { YStack, XStack, Paragraph, Text, Button } from 'tamagui'
import { getPendingResult, AlertDialog, Chip, DataTable2, API, Search, Tinted, EditableObject, usePendingEffect, AsyncView, Notice} from 'protolib'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Plus, Mail, Tag, Key } from '@tamagui/lucide-icons'
import moment from 'moment';
import { UserModel } from '../usersModels'
import { z } from "zod";
import { PendingAtomResult } from '@/packages/protolib/lib/createApiAtom'
import {getErrorMessage} from '@my/ui'

const UserIcons = {username: Mail, type: Tag, passwod: Key, repassword: Key}
const format = 'YYYY-MM-DD HH:mm:ss'

export default function ListUsers({ initialItems }) {
    const [items, setItems] = useState<PendingAtomResult | undefined>(initialItems);
    const [currentItems, setCurrentItems] = useState<PendingAtomResult | undefined>(initialItems)
    const [currentItem, setCurrentItem] = useState<any>()
    const [createOpen, setCreateOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)

    usePendingEffect((s) => API.get('/adminapi/v1/accounts', s), setItems, initialItems)

    useEffect(() => {
        if(items && items.isLoaded) {
            setCurrentItems(items)
        }
    }, [items])
    const onSearch = async (text) => {
        setCurrentItems({
            ...items, 
            data: items.data.filter((item, i) => item.username.includes(text) || item.type.includes(text))
        })
    }

    const onCancelSearch = async () => {
        setCurrentItems(items)
    }

    const columns = DataTable2.columns(
        DataTable2.column("email", "username", true, row => <Chip text={row.username} color={'$color5'} />),
        DataTable2.column("type", "type", true, row => <Chip text={row.type.toUpperCase()} color={row.type == 'admin' ? '$blue5':'$color5'} />),
        DataTable2.column("from", "from", true, row => <Chip text={row.from.toUpperCase()} color={row.from == 'cmd' ? '$blue5':'$color5'} />),
        DataTable2.column("created", "createdAt", true, row => <Chip text={moment(row.createdAt).format(format)} color={'$color5'} />),
        DataTable2.column("last login", "lastLogin",true, row => row.lastLogin ? <Chip text={moment(row.lastLogin).format(format)} color={'$color5'} /> : <Chip text={'NEVER'} color={'$red5'} /> )
    )
        
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
                            await API.post('/adminapi/v1/accounts', UserModel.load(data).create().getData())
                            const users = await API.get('/adminapi/v1/accounts')
                            setItems(users)
                        } catch (e) {
                            throw getPendingResult('error', null, (e as z.ZodError).flatten())
                        }
                        setCreateOpen(false);
                    }} 
                    model={UserModel.load(currentItem)}
                    extraFields={{ 
                        repassword: z.string().min(6).label('repeat password').after('password').hint('**********').secret()
                    }}
                    icons={UserIcons}
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
                                await API.post('/adminapi/v1/accounts', UserModel.load(data).create().getData())
                                const users = await API.get('/adminapi/v1/accounts')
                                setItems(users)
                            } catch (e) {
                                throw getPendingResult('error', null, (e as z.ZodError).flatten())
                            }
                            setEditOpen(false);
                        }} 
                        model={UserModel.load(currentItem)}
                        extraFields={{ 
                            repassword: z.string().min(6).label('repeat password').after('password').hint('**********').secret()
                        }}
                        icons={UserIcons}
                    />
                </YStack>
            </AlertDialog>
            
            <XStack pt="$3" px="$4">
                <YStack left={-12} top={9} f={1}>
                    <Paragraph>
                        <Text fontSize="$6" color="$color11">Users [<Tinted><Text fontSize={"$5"} o={1} color="$color10">{currentItems?.data?.length}</Text></Tinted>]</Text>
                    </Paragraph>
                </YStack>

                <XStack position={"absolute"} right={0}>
                    <Search onCancel={onCancelSearch} onSearch={onSearch} />
                    <XStack top={-3}>
                        <Tinted>
                            <Button hoverStyle={{ o: 1 }} o={0.7} circular onPress={() => {setCurrentItem({from: 'admin'});setCreateOpen(true)}} chromeless={true}>
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
                        columns={columns}
                        rows={currentItems?.data}
                        onRowPress={(rowData)=>{const {password, ...data} = rowData;setCurrentItem(data);setEditOpen(true)}}
                    />
                </XStack>
            </AsyncView>           

        </YStack>
    )
}