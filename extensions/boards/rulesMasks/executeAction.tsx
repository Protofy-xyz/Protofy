import React from 'react';
import { MaskDefinition, buildAutoMask } from 'protolib/components/GenericMask';

const executeActionMask: MaskDefinition = {
  from: 'board',
  id: 'rules.executeAction',
  title: 'Execute Action',
  category: 'Board',
  keywords: ['board', 'execute', 'action', 'execute_action'],
  context: 'executeAction',
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
    },
    done: {
      type: 'output',
      label: 'done',
      vars: ['value'],
    },
    error: {
      type: 'output',
      label: 'error',
      vars: ['value'],
    }
  },
};

export default buildAutoMask(executeActionMask);