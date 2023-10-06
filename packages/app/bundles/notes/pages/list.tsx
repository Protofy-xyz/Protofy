import { DefaultLayout } from '../../../layout/DefaultLayout'
import { XStack, YStack } from 'tamagui'
import { createApiAtom, API, Page, SpotLight, Section, BlockTitle, ContainerLarge, useAtom, usePendingEffect } from 'protolib'
import { ObjectListView } from 'protolib/base/components'
import { NotePreview } from '../components/NotePreview'

const listAtom = createApiAtom([])

export function ListNotes({ initialElements }) {
  const [elements, setElements] = useAtom(listAtom, initialElements)
  usePendingEffect((s) => API.get('/api/v1/notes', s), setElements, initialElements)

  return <Page>
    <DefaultLayout title="notes" footer={null}>
      <Section sectionProps={{ index: 0, p: 0 }}>
        <ContainerLarge contain="layout" pos="relative">
          <YStack mt="$5" p="$5">
            <XStack f={1} mb={"$5"} ml="$5" jc="center" ai="center">
              <BlockTitle title="Notes"></BlockTitle>
            </XStack>
            <ObjectListView listItem={NotePreview} elements={elements} />
          </YStack>
        </ContainerLarge>
        {/* <YStack pe="none" zi={0} fullscreen className="bg-dot-grid mask-gradient-down" /> */}
      </Section>
    </DefaultLayout>
  </Page>
}