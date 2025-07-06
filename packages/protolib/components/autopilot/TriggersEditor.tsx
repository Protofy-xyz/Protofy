import React, { useState, useCallback } from 'react';
import { YStack, XStack, Label, Button, Input, ScrollView } from '@my/ui';
import { SelectList } from '../SelectList';
import { Plus, Trash } from '@tamagui/lucide-icons';
import { nanoid } from 'nanoid';
import { useUpdateEffect } from 'usehooks-ts';

export type TriggerType = 'mqtt' | 'event' | 'manual' | 'interval';
export interface Trigger {
  type: TriggerType;
  topic?: string;
  path?: string;
  caption?: string;
  interval?: string;
}

interface Row extends Trigger {
  rowId: string;
}

interface TriggersEditorProps {
  triggers: Trigger[];
  setTriggers: (triggers: Trigger[]) => void;
}

export const TriggersEditor: React.FC<TriggersEditorProps> = ({ triggers, setTriggers }) => {
  const [rows, setRows] = useState<Row[]>(() =>
    triggers.map((t) => ({ ...t, rowId: nanoid() }))
  );

  // Sync rows -> parent triggers
  useUpdateEffect(() => {
    setTriggers(rows.map(({ rowId, ...t }) => t));
  }, [rows]);

  const addRow = useCallback(() => {
    setRows((prev) => [
      ...prev,
      { rowId: nanoid(), type: 'mqtt', topic: '' },
    ]);
  }, []);

  const removeRow = useCallback((rowId: string) => {
    setRows((prev) => prev.filter((r) => r.rowId !== rowId));
  }, []);

  const updateField = useCallback(
    (rowId: string, key: keyof Trigger, value: string) => {
      setRows((prev) =>
        prev.map((r) =>
          r.rowId === rowId ? { ...r, [key]: value } : r
        )
      );
    },
    []
  );

  const updateType = useCallback(
    (rowId: string, type: TriggerType) => {
      let base: Row;
      switch (type) {
        case 'mqtt':
          base = { rowId, type, topic: '' };
          break;
        case 'event':
          base = { rowId, type, path: '' };
          break;
        case 'manual':
          base = { rowId, type, caption: '' };
          break;
        case 'interval':
          base = { rowId, type, interval: '' };
          break;
      }
      setRows((prev) => prev.map((r) => (r.rowId === rowId ? base : r)));
    },
    []
  );

  const typeOptions = [
    { value: 'mqtt', caption: 'MQTT' },
    { value: 'event', caption: 'Event' },
    { value: 'manual', caption: 'Manual' },
    { value: 'interval', caption: 'Interval' },
  ];

  return (
    <YStack flex={1} height="100%" borderRadius="$3" p="$3" backgroundColor="$gray3" overflow="hidden">
      <XStack alignItems="center" justifyContent="space-between" mb="$2">
        <Label size="$4">Triggers</Label>
        <Button icon={Plus} onPress={addRow}>Add</Button>
      </XStack>
      <ScrollView flex={1}>
        {rows.map(({ rowId, type, topic, path, caption, interval }) => (
          <XStack
            key={rowId}
            alignItems="center"
            space="$2"
            p="$2"
            mb="$2"
            borderRadius="$2"
          >
            <SelectList
              title="Type"
              value={type}
              elements={typeOptions}
              setValue={(val) => updateType(rowId, val as TriggerType)}
              triggerProps={{
                borderWidth: 0,
                width: '25%',
              }}
            />

            {/* Input occupies 75% */}
            {type === 'mqtt' && (
              <Input
                placeholder="Topic"
                width="75%"
                value={topic}
                onChangeText={(text) => updateField(rowId, 'topic', text)}
              />
            )}
            {type === 'event' && (
              <Input
                placeholder="Path"
                width="75%"
                value={path}
                onChangeText={(text) => updateField(rowId, 'path', text)}
              />
            )}
            {type === 'manual' && (
              <Input
                placeholder="Caption"
                width="75%"
                value={caption}
                onChangeText={(text) => updateField(rowId, 'caption', text)}
              />
            )}
            {type === 'interval' && (
              <Input
                placeholder="Interval"
                width="75%"
                value={interval}
                onChangeText={(text) => updateField(rowId, 'interval', text)}
              />
            )}

            <Button ml={'$2'} icon={Trash} size="$2" onPress={() => removeRow(rowId)} />
          </XStack>
        ))}
      </ScrollView>
    </YStack>
  );
};
