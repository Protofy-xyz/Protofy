import { YStack, XStack, Stack, Paragraph, Text, Button, Input, Theme, Label } from 'tamagui'
import { AlertDialog, DataTable, useAtom, API, createApiAtom, DataCard, Search, Popover, Tinted } from 'protolib'
import { useUpdateEffect } from 'usehooks-ts'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Plus } from '@tamagui/lucide-icons'
import moment from 'moment';
import CreateUser from './CreateUser'

export default function ListUsers({ initialUsers }) {
    const [createOpen, setCreateOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const router = useRouter()
    const _initialUsers = initialUsers.data ?? []
    const format = 'YYYY-MM-DD HH:mm:ss'
    const [users, setUsers] = useState([
        ["username", "type", "from", "created", "last login"]
        , ..._initialUsers.map(u => [u.username, u.type, u.from, moment(u.createdAt).format(format), u.lastLogin ? moment(u.lastLogin).format(format) : '-'])]);

    const [currentUsers, setCurrentUsers] = useState(users)
    const [currentUser, setCurrentUser] = useState<any>()
    const onSearch = async (text) => {
        setCurrentUsers(users.filter((user, i) => i === 0 || user[0].includes(text) || user[1].includes(text)))
    }

    const onCancelSearch = async () => {
        setCurrentUsers(users)
    }

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
                        <Text fontSize="$5">Users</Text>
                        <Text ml={"$2"} o={0.5}>[total: {currentUsers.length - 1}]</Text>
                    </Paragraph>
                </YStack>

                <XStack position={"absolute"} right={0}>
                    <Search onCancel={onCancelSearch} onSearch={onSearch} />
                    <XStack top={-3} o={0.5}>
                        <Button onPress={() => setCreateOpen(true)} chromeless={true}>
                            <Plus />
                        </Button>
                    </XStack>

                </XStack>
            </XStack>

            <XStack pt="$1" flexWrap='wrap'>
                <DataTable
                    onRowPress={(element) => {setCurrentUser(element);setEditOpen(true)}}
                    dataStyles={[{ whiteSpace: 'nowrap' }]}
                    firstRowIsHeader={true}
                    rows={currentUsers}
                />
            </XStack>
        </YStack>
    )
}