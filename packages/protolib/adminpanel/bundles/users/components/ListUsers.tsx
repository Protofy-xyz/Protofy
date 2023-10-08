import { YStack, XStack, Stack, Paragraph, Text, Button, Input, Theme } from 'tamagui'
import { DataTable, useAtom, API, createApiAtom, DataCard, Search, Popover, Tinted } from 'protolib'
import { useUpdateEffect } from 'usehooks-ts'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Plus } from '@tamagui/lucide-icons'
import moment from 'moment';

export default function ListUsers({initialUsers}) {
    const router = useRouter()
    const _initialUsers = initialUsers.data ?? []
    const format = 'YYYY-MM-DD HH:mm:ss'
    const [users, setUsers] = useState([
        ["username", "type", "from", "created", "last login"]
        , ..._initialUsers.map(u => [u.username, u.type, u.from, moment(u.createdAt).format(format), u.lastLogin ? moment(u.lastLogin).format(format): '-'])]);

    const [currentUsers, setCurrentUsers] = useState(users)

    const onSearch = async (text) => {
        setCurrentUsers(users.filter((user, i) => i === 0 || user[0].includes(text) || user[1].includes(text)))
    }

    const onCancelSearch = async () => {
        setCurrentUsers(users)
    }

    return (
        <YStack f={1}>
            <XStack pt="$3" px="$4">
                <YStack left={-12} top={9} f={1}>
                    <Paragraph>
                        <Text fontSize="$5">Users</Text>
                        <Text ml={"$2"} o={0.5}>[total: 0]</Text>
                    </Paragraph>
                </YStack>

                <XStack position={"absolute"} right={0}>
                    <Search onCancel={onCancelSearch} onSearch={onSearch} />
                </XStack>
            </XStack>

            <XStack pt="$1" flexWrap='wrap'>
                <DataTable
                    dataStyles={[{whiteSpace: 'nowrap'}]}
                    firstRowIsHeader={true}
                    rows={currentUsers}
                />
            </XStack>
        </YStack>
    )
}