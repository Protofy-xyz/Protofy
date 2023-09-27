
import { DefaultLayout } from '../layout/DefaultLayout'
import { XStack, YStack, Stack } from 'tamagui'
import { useAtom, useTouchSensors, SortableItem, Page, getPendingResult, EditableText, AsyncView, usePendingEffect, createApiAtom, API, Grid, SpotLight, Section, TamaCard, BigTitle } from 'protolib'
import { arrayMove, SortableContext, rectSortingStrategy} from '@dnd-kit/sortable';
import { DndContext, closestCenter } from '@dnd-kit/core';

const notesAtom = createApiAtom([])

export default function Notes({ initialNotes }) {
  const [notes,setNotes] = useAtom(notesAtom, initialNotes)
  usePendingEffect((s) => API.get('/api/v1/notes', s), setNotes, initialNotes)
  
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if(over && over.id && active && active.id) {
      setNotes((items) => {
        const oldIndex = items.data.findIndex(ele => ele.id == active.id);
        const newIndex = items.data.findIndex(ele => ele.id == over.id);
        return getPendingResult('loaded', arrayMove(items.data, oldIndex, newIndex));
      });
    }
  }

  const sensors = useTouchSensors()

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
            <AsyncView atom={notes}>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext
                  items={notes?.data}
                  strategy={rectSortingStrategy}
                >
                  <Grid itemMinWidth={400}>
                    {notes?.data?.map(({ title, description, id }, index) => <SortableItem key={id} id={id}>
                      <Stack style={{touchAction: 'none'}}>
                        <TamaCard grow={0} title={title} >
                            <EditableText placeHolder={''} text={description} />
                        </TamaCard>
                      </Stack>
                    </SortableItem>)}
                  </Grid>
                </SortableContext>
              </DndContext>
            </AsyncView>
          </YStack>
        </Section>
      </DefaultLayout>
    </Page>

  )
}