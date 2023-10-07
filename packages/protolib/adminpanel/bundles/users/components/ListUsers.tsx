import { YStack, XStack, Stack, Paragraph, Text, Button, Input, Theme } from 'tamagui'
import { useAtom, API, createApiAtom, DataCard, Search, Popover, Tinted } from 'protolib'
import { useUpdateEffect } from 'usehooks-ts'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Plus } from '@tamagui/lucide-icons'

export default function DBAdmin({  }) {
    const router = useRouter()

    const onSearch = async (text) => {

    }

    const onCancelSearch = async () => {

    }

    return (
        <YStack f={1}>
            <XStack py="$4" px="$5">
                <YStack f={1}>
                    <Paragraph>
                        <Text fontSize="$5">{'test'}</Text>
                    </Paragraph>
                    <Paragraph>
                        <Text o={0.5}>[total: 0]</Text>
                    </Paragraph>
                </YStack>

                <XStack>
                    <Search onCancel={onCancelSearch} onSearch={onSearch} />
                </XStack>
            </XStack>

            <XStack flexWrap='wrap'>
                lol
            </XStack>
        </YStack>
    )
}