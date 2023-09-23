import { YStack, XStack, Stack, Input, Theme, Paragraph, Text } from 'tamagui'
import { API, withSession, createApiAtom, usePendingEffect, PanelMenuItem, redirect, useHydratedAtom, DataCard, ItemCard, BigTitle, Search } from 'protolib'
import { PanelLayout } from '@/layout/PanelLayout'
import { Cross, Database, Key, Plus, PlusCircle } from '@tamagui/lucide-icons'
import { atom, useAtom } from 'jotai'
import { useUpdateEffect } from 'usehooks-ts'
import { useRouter } from 'next/router'
import { SSR } from '@/conf'
import { Link } from '@components/Link'
import { useState } from 'react'
import { useTint } from '@tamagui/logo'
import { FullFileBrowser } from 'chonky';
import dynamic from 'next/dynamic'
import { setChonkyDefaults } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';


const FileBrowser = dynamic(() => import('../../../components/FileBrowser'), {
    ssr: false,
  })
// import FileBrowser from '../../../components/FileBrowser'

// Somewhere in your `index.ts`:
setChonkyDefaults({ iconComponent: ChonkyIconFA });

const [filesArr, filesAtom] = createApiAtom([])
const currentDbAtom = atom(0)

const Menu = () => {
    return (<YStack pt="$10">

        <Link
            href={"/admin/files/"}
            onPressApp={() => {}}
        >
            <PanelMenuItem
                selected={true}
                icon={<Database color="$color11" strokeWidth={1.5} />}
                text={'Files'}
            />
        </Link>

    </YStack>)
}

export default function Admin({ pageSession, filesState}) {
    const router = useRouter()
    const [files, setFiles] = useHydratedAtom(filesArr, filesState, filesAtom)

    usePendingEffect(() => API.get('/adminapi/v1/databases', setFiles), files)

    return (<PanelLayout menuContent={<Menu />}>
        <XStack py="$4" px="$5">
            {/* <YStack f={1}>
                <Paragraph>
                    <Text fontSize="$5">{currentDB}</Text>
                </Paragraph>
                <Paragraph>
                    <Text o={0.5}>[total: {content?.data?.length}]</Text>
                </Paragraph>
            </YStack> */}

            {/* <XStack>
                <Search onCancel={onCancelSearch} onSearch={onSearch} />
            </XStack> */}
        </XStack>
        <XStack f={1} flexWrap='wrap'>
            <FileBrowser />
        </XStack>
    </PanelLayout>)
}

export const getServerSideProps = SSR(async (context) => {
    return withSession(context, ['admin'])
})