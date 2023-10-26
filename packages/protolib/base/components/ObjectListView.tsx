
import { YStack, Stack } from 'tamagui'
import { ItemCard, AsyncView, Grid } from 'protolib'
import React from 'react';

export function ObjectListView({ elements, listItem, viewProps = {} }) {
  return (
    <AsyncView atom={elements}>
      <Grid itemMinWidth={300}>
        {elements?.data?.items?.map((data, index) => <ItemCard
          key={index + Math.random()}
          // style={{ touchAction: 'none' }}
          m={"$1"} 
          mx={"$5"} 
          my={"$5"}
          maxWidth={700}
          $md={{ maxWidth: 450 }}
          $sm={{ mx:"$0", minWidth: 'calc(100vw - 120px)', maxWidth: 'calc(100vw - 65px)' }}
          minWidth={300}
          containerElement={YStack}
          hoverStyle={{ bc: "$backgroundHover" }}
          {...viewProps}
        >
          {React.createElement(listItem, { data }, [])}
        </ItemCard>)}
      </Grid>
    </AsyncView>
  )
}