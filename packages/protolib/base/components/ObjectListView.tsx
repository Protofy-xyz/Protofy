
import { YStack, Stack } from 'tamagui'
import { ItemCard, AsyncView, Grid } from 'protolib'
import React from 'react';

export function ObjectListView({ elements, listItem }) {
  return (
    <AsyncView atom={elements}>
          <Grid itemMinWidth={300}>
            {elements?.data?.items?.map((data, index) => <Stack key={index+Math.random()} style={{ touchAction: 'none' }} $sm={{mx:"$0"}} mx={"$5"} p={"$1"} py={"$5"}>
                <ItemCard
                    maxWidth={700}
                    $md={{ maxWidth: 450 }}
                    $sm={{ minWidth: 'calc(100vw - 120px)', maxWidth: 'calc(100vw - 65px)' }}
                    minWidth={300}
                    containerElement={YStack}
                    hoverStyle={{bc:"$backgroundHover"}}
                >
                  {React.createElement(listItem, {data}, [])}
                </ItemCard>
              </Stack>)}
          </Grid>
    </AsyncView>
  )
}