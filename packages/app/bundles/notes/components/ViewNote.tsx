import { DefaultLayout } from '../../../layout/DefaultLayout'
import { YStack } from 'tamagui'
import { AsyncView, usePendingEffect, API, Page, Section, ContainerLarge } from 'protolib'
import { Note } from './Note'
import { useState } from 'react'

export const ViewNote = ({id, initialElement}) => {
    const [element, setElement] = useState(initialElement)

    usePendingEffect((s) => API.get('/api/v1/notes/' + id, s), setElement, element)

    return <Page>
        <DefaultLayout title="notes" footer={null}>
            <Section sectionProps={{ index: 0, p: 0 }}>
                <ContainerLarge contain="layout" pos="relative">
                    <YStack mt="$5" p="$5">
                        <AsyncView atom={element}>
                            <Note data={element.data} />
                        </AsyncView>
                    </YStack>
                </ContainerLarge>
                {/* <YStack pe="none" zi={0} fullscreen className="bg-dot-grid mask-gradient-down" /> */}
            </Section>
        </DefaultLayout>
    </Page>
}