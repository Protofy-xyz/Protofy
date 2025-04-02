import React, { useRef, useState, useLayoutEffect, useEffect } from 'react'
import { TextArea } from '@my/ui'
import { XStack, YStack, Button, Spinner } from '@my/ui'
import { Trash, Plus } from '@tamagui/lucide-icons'
import dynamic from 'next/dynamic';

const AutoHeightTextArea = dynamic(() =>
  import('../AutoHeightTextArea').then(mod => mod.AutoHeightTextArea),
  { ssr: false }
);

export const RuleItem = ({ value, loading, onDelete, onEdit }) => {
  return (
    <XStack ai="center" gap="$2" mb="$2" width="100%">
      <AutoHeightTextArea
        speechRecognition={true}
        readOnly={!onEdit}
        value={value}
        onChange={(e) => onEdit(e.target.value)}
        placeholder="Rule Value..."
        style={{ width: '100%' }}
      />
      <Button
        disabled={loading}
        onMouseDown={(e) => e.stopPropagation()}
        theme="red"
        bg="transparent"
        color="$red9"
        circular
        scaleIcon={1.2}
        icon={loading ? Spinner : Trash}
        onPress={onDelete}
      />
    </XStack>
  )
}

export const Rules = ({ rules, onAddRule, onDeleteRule, onEditRule, loadingIndex }) => {
  const [newRule, setNewRule] = useState('')

  const addRule = (e) => {
    if (newRule.trim().length < 3) return
    onAddRule(e, newRule)
    setNewRule('')
  }

  const handleNewRuleChange = (e) => {
    const val = e.target.value
    const newlineCount = (val.match(/\n/g) || []).length
    if (val.endsWith("\n") && newlineCount === 1) {
      addRule(e)
    } else {
      setNewRule(val)
    }
  }

  return (
    <YStack height="100%" f={1} w="100%">

      <YStack style={{ overflowY: 'auto', flex: 1, width: '100%', padding: "2px" }}>
        {rules.map((rule, i) => (
          <RuleItem
            key={i}
            value={rule}
            loading={loadingIndex === i}
            onDelete={() => onDeleteRule(i)}
            onEdit={onEditRule ? (r) => onEditRule(i, r) : null}
          />
        ))}
      </YStack>

      {/* Input para nueva regla */}
      <XStack ai="center" gap="$2" mb="$2" mt="$4" width="100%">
        <AutoHeightTextArea
          speechRecognition={true}
          placeholder="Add new rule..."
          value={newRule}
          onChange={handleNewRuleChange}
          style={{ width: '100%' }}
        />
        <Button
          disabled={loadingIndex === rules.length || newRule.trim().length < 3}
          onMouseDown={(e) => e.stopPropagation()}
          bg={newRule.trim().length > 2 ? '$color8' : '$gray6'}
          color={newRule.trim().length > 2 ? '$background' : '$gray9'}
          hoverStyle={{ backgroundColor: '$blue10' }}
          circular
          icon={loadingIndex === rules.length ? Spinner : Plus}
          scaleIcon={1.4}
          onPress={addRule}
        />
      </XStack>
    </YStack>
  )
}
