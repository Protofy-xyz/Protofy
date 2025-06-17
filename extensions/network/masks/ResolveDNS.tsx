import React from 'react';
import { MaskDefinition, buildAutoMask } from 'protolib/components/GenericMask';

const resolveDnsMask: MaskDefinition = {
  from: 'network',
  id: 'resolveDNS',
  title: 'Resolve DNS',
  category: 'Network',
  keywords: ['dns', 'network', 'resolve', 'hostname'],
  context: 'context.network.resolveDNS',
  icon: 'globe',
  params: {
    hostname: {
      type: 'input',
      label: 'Hostname',
      initialValue: { value: '', kind: 'StringLiteral' },
    },
    rrtype: {
      type: 'select',
      label: 'RRType',
      options: ['A','AAAA','ANY','CAA','CNAME','MX','NAPTR','NS','PTR','SOA','SRV','TXT'],
      initialValue: { value: 'A', kind: 'StringLiteral' },
    },
    done: {
      type: 'output',
      label: 'Done',
      vars: ['records'],
    },
    error: {
      type: 'output',
      label: 'Error',
      vars: ['err'],
    },
  },
};

export default buildAutoMask(resolveDnsMask);