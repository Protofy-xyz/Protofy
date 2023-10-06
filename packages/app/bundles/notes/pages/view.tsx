import { DefaultLayout } from '../../../layout/DefaultLayout'
import { XStack, YStack } from 'tamagui'
import { AsyncView, createApiAtom, usePendingEffect, API, useAtom, Page, SpotLight, Section, BlockTitle, ContainerLarge } from 'protolib'
import { ObjectListView } from 'protolib/base/components'
import { NotePreview } from '../components/NotePreview'
import { NoteView } from '../components/NoteView'

const dataAtom = createApiAtom(null)

export function ViewNote({ initialElement, id }) {

    const [element, setElement] = useAtom(dataAtom, initialElement)
    usePendingEffect((s) => API.get('/api/v1/notes/' + id, s), setElement, element)

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