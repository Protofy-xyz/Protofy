import { Divider } from 'native-base';
import React from 'react';

export default function CommonDivider() {
  return (
    <Divider
      mt="5"
      _light={{
        color: 'coolGray.200',
      }}
      _dark={{
        color: 'coolGray.700',
      }}
    />
  );
}
