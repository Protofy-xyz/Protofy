import { YStack, XStack, Stack, Paragraph, Text, Button, Input, Theme, Label, SizableText, ColorProp } from 'tamagui'
import { AlertDialog, Chip, DataTable2, useAtom, API, createApiAtom, DataCard, Search, Popover, Tinted } from 'protolib'
import { useUpdateEffect } from 'usehooks-ts'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { Plus, TerminalSquare } from '@tamagui/lucide-icons'
import moment from 'moment';
import CreateUser from './CreateUser'
import React from 'react'

export default function ListUsers({ initialUsers }) {
    const [createOpen, setCreateOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const router = useRouter()
    const _initialUsers = initialUsers.data ?? []
    const format = 'YYYY-MM-DD HH:mm:ss'
    const [users, setUsers] = useState(_initialUsers);

    const [currentUsers, setCurrentUsers] = useState(users)
    const [currentUser, setCurrentUser] = useState<any>()
    const onSearch = async (text) => {
        setCurrentUsers(users.filter((user, i) => user.username.includes(text) || user.type.includes(text)))
    }

    const onCancelSearch = async () => {
        setCurrentUsers(users)
    }

    const columns = [
        { name: "email", selector: "username", sortable: true, cell: row => <Chip text={row.username} color={'$color5'} /> },
        { name: "type", selector: "type", sortable: true, cell: row => <Chip text={row.type.toUpperCase()} color={row.type == 'admin' ? '$red5':'$blue5'} />},
        {
            name: "from", selector: "from", sortable: true, cell: row => {
                return <Chip text={row.from.toUpperCase()} color={row.from == 'cmd' ? '$orange5':'$blue5'} />
            }
        },
        { name: "created", selector: "createdAt", sortable: true, cell: row => <Chip text={moment(row.createdAt).format(format)} color={'$color5'} /> },
        { name: "last login", selector: "lastLogin", sortable: true, cell: row => row.lastLogin ? <Chip text={moment(row.lastLogin).format(format)} color={'$color5'} /> : <Chip text={'NEVER'} color={'$red5'} /> }
        // { Header: "from", accessor: "user.from"},
        // { Header: "created", accessor: "user.createdAt"}
    ]

    return (
        <YStack f={1}>
            <AlertDialog
                acceptCaption="Create"
                setOpen={setCreateOpen}
                open={createOpen}
                onAccept={async (setOpen) => {
                    setCreateOpen(false)
                }}
                title={<Text><Tinted><Text color="$color9">Create</Text></Tinted><Text color="$color11"> account</Text></Text>}
                description={""}
            >
                <YStack f={1} jc="center" ai="center">
                    <CreateUser />
                </YStack>
            </AlertDialog>
            <AlertDialog
                acceptCaption="Save"
                setOpen={setEditOpen}
                open={editOpen}
                onAccept={async (setOpen) => {
                    setEditOpen(false)
                }}
                title={'Edit user'}
                description={""}
            >
                <YStack f={1} jc="center" ai="center">
                    Pending
                </YStack>
            </AlertDialog>
            <XStack pt="$3" px="$4">
                <YStack left={-12} top={9} f={1}>
                    <Paragraph>
                        <Text fontSize="$6" color="$color11">Users [<Tinted><Text fontSize={"$5"} o={1} color="$color10">{currentUsers.length}</Text></Tinted>]</Text>
                    </Paragraph>
                </YStack>

                <XStack position={"absolute"} right={0}>
                    <Search onCancel={onCancelSearch} onSearch={onSearch} />
                    <XStack top={-3}>
                        <Tinted>
                            <Button hoverStyle={{ o: 1 }} o={0.7} circular onPress={() => setCreateOpen(true)} chromeless={true}>
                                <Plus />
                            </Button>
                        </Tinted>
                    </XStack>

                </XStack>
            </XStack>

            <XStack pt="$1" flexWrap='wrap'>
                <DataTable2
                    //onRowPress={(element) => {setCurrentUser(element);setEditOpen(true)}}
                    //dataStyles={[{ whiteSpace: 'nowrap' }]}
                    //firstRowIsHeader={true}
                    columns={columns}
                    rows={currentUsers}
                // rows={currentUsers}
                />
            </XStack>
        </YStack>
    )
}