
import { YStack } from 'tamagui'
import { Grid } from '../../components/Grid'
import { ItemCard } from '../../components/ItemCard'
import { AsyncView } from '../../components/AsyncView'
import React from 'react';

export function ObjectListView({ elements, listItem, viewProps = {}, gridProps = {} }) {
  return (
    <AsyncView atom={elements}>
      <Grid itemMinWidth={300} {...gridProps}>
        {elements?.data?.items?.map((data, index) => <ItemCard
          key={index + Math.random()}
          // style={{ touchAction: 'none' }}
          m={"$1"}
          mx={"$5"}
          my={"$5"}
          maxWidth={700}
          $md={{ maxWidth: 450 }}
          $sm={{ mx: "$0", minWidth: 'calc(100vw - 120px)', maxWidth: 'calc(100vw - 65px)' }}
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