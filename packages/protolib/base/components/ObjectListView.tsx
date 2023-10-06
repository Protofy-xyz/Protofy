
import { XStack, YStack, Stack } from 'tamagui'
import { ItemCard, useAtom, useTouchSensors, SortableItem, Page, getPendingResult, EditableText, AsyncView, usePendingEffect, createApiAtom, API, Grid, SpotLight, Section, TamaCard, BigTitle } from 'protolib'
import { arrayMove, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { useState } from 'react';
import React from 'react';

export function ObjectListView({ elements, listItem }) {
  return (
    <AsyncView atom={elements}>
          <Grid itemMinWidth={300}>
            {elements?.data?.map((data, index) => <Stack style={{ touchAction: 'none' }} $sm={{mx:"$0"}} mx={"$5"} p={"$1"} py={"$5"}>
                <ItemCard
                    maxWidth={700}
                    $md={{ maxWidth: 450 }}
                    $sm={{ minWidth: 'calc(100vw - 120px)', maxWidth: 'calc(100vw - 65px)' }}
                    minWidth={300}
                    containerElement={YStack}
                >
                  {React.createElement(listItem, {data}, [])}
                </ItemCard>
              </Stack>)}
          </Grid>
    </AsyncView>
  )
}