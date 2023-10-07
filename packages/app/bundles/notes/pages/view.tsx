import { DefaultLayout } from '../../../layout/DefaultLayout'
import { YStack } from 'tamagui'
import { withSession, AsyncView, createApiAtom, usePendingEffect, API, useAtom, Page, Section, ContainerLarge } from 'protolib'
import { NoteView } from '../components/NoteView'
import { NextPageContext } from 'next'
import { useMemo, useState } from 'react'
import {useRouter} from 'next/router'

export function ViewNote({ initialElement, id }) {
    const [element, setElement] = useState(initialElement)
    const router = useRouter()
    usePendingEffect((s) => API.get('/api/v1/notes/' + router.asPath.split('/')[2], s), setElement, element)

    return <Page>
        <DefaultLayout title="notes" footer={null}>
            <Section sectionProps={{ index: 0, p: 0 }}>
                <ContainerLarge contain="layout" pos="relative">
                    <YStack mt="$5" p="$5">
                        <AsyncView atom={element}>
                            <NoteView data={element.data} />
                        </AsyncView>
                    </YStack>
                </ContainerLarge>
                {/* <YStack pe="none" zi={0} fullscreen className="bg-dot-grid mask-gradient-down" /> */}
            </Section>
        </DefaultLayout>
    </Page>
}

export const getServerSideProps = async (context: NextPageContext) => {
    return withSession(context, undefined, {
        initialElement: await API.get('/api/v1/notes/'+context.query.name[1])
    }
)}
