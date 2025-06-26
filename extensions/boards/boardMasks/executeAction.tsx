import React from 'react';
import { MaskDefinition, buildAutoMask } from 'protolib/components/GenericMask';

const executeActionMask: MaskDefinition = {
  from: 'board',
  id: 'executeAction',
  title: 'Execute Action',
  category: 'Board',
  keywords: ['board', 'execute', 'action', 'execute_action'],
  context: 'board.execute_action',
  icon: 'zap',
  params: {
    name: {
      type: 'input',
      label: 'action name',
      initialValue: { value: '', kind: 'StringLiteral' },
    },
    params: {
      type: 'input',
      label: 'params',
      initialValue: { value: '{}', kind: 'Identifier' },
    }
  },
};

export default buildAutoMask(executeActionMask);