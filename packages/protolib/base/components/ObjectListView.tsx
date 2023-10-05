
import { XStack, YStack, Stack } from 'tamagui'
import { useAtom, useTouchSensors, SortableItem, Page, getPendingResult, EditableText, AsyncView, usePendingEffect, createApiAtom, API, Grid, SpotLight, Section, TamaCard, BigTitle } from 'protolib'
import { arrayMove, SortableContext, rectSortingStrategy} from '@dnd-kit/sortable';
import { DndContext, closestCenter } from '@dnd-kit/core';

const listAtom = createApiAtom([])

export function ObjectListView({ initialElements, name }) {
  const [elements,setElements] = useAtom(listAtom, initialElements)
  usePendingEffect((s) => API.get('/api/v1/'+name, s), setElements, initialElements)
  
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if(over && over.id && active && active.id) {
      setElements((items) => {
        const oldIndex = items.data.findIndex(ele => ele.id == active.id);
        const newIndex = items.data.findIndex(ele => ele.id == over.id);
        return getPendingResult('loaded', arrayMove(items.data, oldIndex, newIndex));
      });
    }
  }

  const sensors = useTouchSensors()

  return (
    <AsyncView atom={elements}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={elements?.data}
          strategy={rectSortingStrategy}
        >
          <Grid itemMinWidth={400}>
            {elements?.data?.map(({ title, body, id }, index) => <SortableItem key={id} id={id}>
              <Stack style={{touchAction: 'none'}}>
                <TamaCard grow={0} title={title} >
                    <EditableText placeHolder={''} text={body} />
                </TamaCard>
              </Stack>
            </SortableItem>)}
          </Grid>
        </SortableContext>
      </DndContext>
    </AsyncView>
  )
}