
import { DefaultLayout } from '../layout/DefaultLayout'
import { XStack, YStack } from 'tamagui'
import { Page, SpotLight, Section, BigTitle } from 'protolib'
import { ObjectListView } from 'protolib/base'

export default function Notes({ initialElements }) {
  return (
    <Page>
      <DefaultLayout title="notes" header={null} footer={null}>
        <Section sectionProps={{ index: 0, p: 0 }}>
          <SpotLight />
          <YStack pe="none" zi={0} fullscreen className="bg-dot-grid mask-gradient-down" />
          <YStack mt="$5" p="$5">
            <XStack f={1} mb={"$5"} ml="$5" ai="center">
              <BigTitle>
                <span className="all ease-in ms250 rainbow clip-text">Notes</span>
              </BigTitle>
            </XStack>
            <ObjectListView initialElements={initialElements} name={'notes'}/>
          </YStack>
        </Section>
      </DefaultLayout>
    </Page>

  )
}