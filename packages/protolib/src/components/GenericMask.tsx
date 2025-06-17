import React from 'react';
import {
  Node,
  NodeParams,
  NodeOutput,
  filterObject,
  restoreObject,
} from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme';

/* ────────────────────────────────
 * 1. GenericMask — renderiza un nodo en base
 *    a una definición declarativa
 * ──────────────────────────────── */

export type MaskParam =
  | {
      /* ------------- entradas ------------- */
      type: 'input' | 'select';
      label?: string;
      options?: string[];              // solo ‘select’
      initialValue?: { value: any; kind: string };
    }
  | {
      /* ------------- salidas -------------- */
      type: 'output';
      label?: string;
      vars: string[];                  // p. ej. ['records']
    };

export type MaskDefinition = {
  id: string;
  from: string;
  title?: string;
  icon?: string;
  params: Record<string, MaskParam>;
};

export interface GenericMaskProps {
  node?: any;
  nodeData?: any;
  children?: React.ReactNode;
  def: MaskDefinition;
}

export const buildAutoMask = (
  def: MaskDefinition & { context: string; category?: string; keywords?: string[] }
) =>
  AutoMask({
    from: def.from,
    id: def.id,
    category: def.category,
    keywords: def.keywords,
    context: def.context,
    params: Object.fromEntries(
      Object.entries(def.params).map(([k, p]) => {
        if (p.type === 'output') {
          return [
            k,
            {
              type: 'output' as const,
              params: [{ name: p.vars[0], description: p.label ?? k }],
            },
          ];
        }
        /* input / select */
        return [
          k,
          {
            type: 'input' as const,
            initialValue: p.initialValue,
          },
        ];
      })
    ),
    getComponent: (n, d, c) => <GenericMask node={n} nodeData={d} def={def}>{c}</GenericMask>,
  });

export const GenericMask: React.FC<GenericMaskProps> = ({ node = {}, nodeData = {}, children, def }) => {
  const color = useColorFromPalette(8);
  const icon = def.icon ?? 'cross';

  const paramList = Object.entries(def.params)
    .filter(([, p]) => p.type === 'input' || p.type === 'select')
    .map(([key, p]) => ({
      label: (p as any).label ?? key,
      field: `mask-${key}`,
      type: p.type,
      data: p.type === 'select' ? (p as any).options : undefined,
    }));

  const outputList = Object.entries(def.params)
    .filter(([, p]) => p.type === 'output')
    .map(([key, p]) => ({
      handleId: `mask-${key}`,
      label: (p as any).label ?? key,
      vars: (p as any).vars ?? [],
    }));

  return (
    <Node
      icon={icon}
      node={node}
      isPreview={!node.id}
      title={def.title ?? def.id}
      color={color}
      id={node.id}
      skipCustom
      style={{ minWidth: 250 }}
    >
      {paramList.length > 0 && <NodeParams id={node.id} params={paramList} />}
      {outputList.length > 0 && <div style={{ height: 30 }} />}
      {outputList.map((o) => (
        <NodeOutput
          key={o.handleId}
          id={node.id}
          type="input"
          label={o.label}
          vars={o.vars}
          handleId={o.handleId}
        />
      ))}
        {React.isValidElement(children) || Array.isArray(children) ? children : null}
    </Node>
  );
};

/* ────────────────────────────────
 * 2. AutoMask helper (sin cambios relevantes)
 * ──────────────────────────────── */

export type AutoMaskOptions = {
  from: string;
  id: string;
  getComponent: (n: any, d: any, c: any) => JSX.Element;
  category?: string;
  keywords?: string[];
  context: string;
  params: {
    [k: string]: {
      type: 'input' | 'output';
      initialValue?: { value: string | number | boolean; kind: string };
      params?: Array<{ name: string; description?: string }>;
    };
  };
};

export const AutoMask = (options: AutoMaskOptions) => {
  const firstVar = (v: any) => (v.type === 'output' ? v.params?.[0]?.name : undefined);

  return {
    id: `${options.from}.${options.id}`,
    type: 'CallExpression',
    category: options.category || 'Uncategorized',
    keywords: options.keywords || [],
    check: (n: any, d: any) => n.type === 'CallExpression' && d.to === options.context,
    getComponent: (n: any, d: any, c: any) => options.getComponent(n, d, c),
    filterChildren: filterObject({
      keys: Object.fromEntries(
        Object.entries(options.params).map(([k, v]) => [k, v.type === 'input' ? 'input' : 'output'])
      ),
    }),
    restoreChildren: restoreObject({
      keys: Object.fromEntries(
        Object.entries(options.params).map(([k, v]) => [
          k,
          v.type === 'input'
            ? 'input'
            : { params: { [`param-${firstVar(v) ?? k}`]: { key: firstVar(v) ?? k } } },
        ])
      ),
    }),
    getInitialData: () => ({
      await: true,
      to: options.context,
      ...Object.fromEntries(
        Object.entries(options.params)
          .filter(([, v]) => v.initialValue)
          .map(([k, v]) => [`mask-${k}`, v.initialValue!])
      ),
    }),
  };
};