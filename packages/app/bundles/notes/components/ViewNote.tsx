import { DefaultLayout } from '../../../layout/DefaultLayout'
import { YStack, Image } from 'tamagui'
import { Center, AsyncView, usePendingEffect, API, Page, Section, ContainerLarge } from 'protolib'
import { Note } from './Note'
import { useState } from 'react'
import protofito from '../resources/protofito-face.png';

export const ViewNote = ({id, initialElement}) => {
    const [element, setElement] = useState(initialElement)
    console.log('protofito face: ', protofito)
    usePendingEffect((s) => API.get('/api/v1/notes/' + id, s), setElement, element)

    return <Page>
        <DefaultLayout title="notes" footer={null}>
            <Section sectionProps={{ index: 0, p: 0 }}>
                <ContainerLarge contain="layout" pos="relative">
                    <YStack mt="$5" p="$5">
                        <AsyncView atom={element}>
                            <Note data={element.data} />
                            <Center mt="$10">
                                <Image source={{width: protofito.width/2, height: protofito.height/2, uri: protofito.src}} />
                            </Center>
                        </AsyncView>
                    </YStack>
                </ContainerLarge>
                {/* <YStack pe="none" zi={0} fullscreen className="bg-dot-grid mask-gradient-down" /> */}
            </Section>
        </DefaultLayout>
    </Page>
}