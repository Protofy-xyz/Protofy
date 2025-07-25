import React, { useRef, useState, useLayoutEffect, useEffect } from 'react'
import { TextArea } from '@my/ui'
import { XStack, YStack, Button, Spinner } from '@my/ui'
import { Trash, Plus, RotateCcw } from '@tamagui/lucide-icons'
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

export const Rules = ({ rules, loading=false, onAddRule, onDeleteRule, onEditRule, loadingIndex, onReloadRules = async (rules) => {}}) => {
  const [newRule, setNewRule] = useState('')
  const [generating, setGenerating] = useState(false)
  
  const addRule = async (e) => {
    if (newRule.trim().length < 3) return
    setGenerating(true)
    await onAddRule(e, newRule)
    setGenerating(false)
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

  const reloadRules = async (e) => {
    e.stopPropagation()
    setGenerating(true)
    await onReloadRules(rules)
    setGenerating(false)
  }

  const isDisabled = loadingIndex === rules.length || (newRule.trim().length < 3 && newRule.trim().length > 0) || generating
  return (
    <YStack height="100%" f={1} w="100%">

      <YStack style={{ overflowY: 'auto', flex: 1, width: '100%', padding: "2px" }}>
        {rules.map((rule, i) => (
          <RuleItem
            key={i}
            value={rule}
            loading={loadingIndex === i}
            onDelete={async () => {
              setGenerating(true)
              await onDeleteRule(i)
              setGenerating(false)
            }}
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
          disabled={isDisabled}
          onMouseDown={(e) => e.stopPropagation()}
          bg={newRule.trim().length > 2 || !newRule.trim().length ? '$color8' : '$gray6'}
          color={newRule.trim().length > 2 || !newRule.trim().length ? '$background' : '$gray9'}
          hoverStyle={{ backgroundColor: '$blue10' }}
          circular
          icon={loadingIndex === rules.length || generating || loading ? Spinner : (newRule.trim().length > 1 ? Plus : RotateCcw)}
          scaleIcon={1.4}
          onPress={newRule.trim().length > 1 ? addRule : reloadRules}
        />
      </XStack>
    </YStack>
  )
}
