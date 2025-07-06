import React from 'react';
import { MaskDefinition, buildAutoMask } from 'protolib/components/GenericMask';

const onChangeMask: MaskDefinition = {
  from: 'board',
  id: 'onChange',
  title: 'onChange',
  category: 'Board',
  keywords: ['board', 'onChange', 'change'],
  context: 'board.onChange',
  icon: 'cable',
  params: {
    name: {
      type: 'input',
      label: 'state name',
      initialValue: { value: '', kind: 'StringLiteral' },
    },
    changed: {
      type: 'output',
      label: 'changed',
      vars: ['value'],
    }
  },
};

export default buildAutoMask(onChangeMask);