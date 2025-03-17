import React, { useRef, useState, useLayoutEffect } from 'react'
import { TextArea } from '@my/ui'
import { XStack, YStack, Button, Spinner } from '@my/ui'
import { Trash, Plus } from '@tamagui/lucide-icons'

// Valores para altura mínima y máxima
const minHeight = 49
const maxHeight = 220

export const AutoHeightTextArea = ({
  value,
  onChange,
  onKeyDown,
  readOnly,
  placeholder,
  style,
  ...rest
}) => {
  const ref = useRef(null)
  const [height, setHeight] = useState(minHeight)

  useLayoutEffect(() => {
    if (ref.current) {
      // Reiniciamos la altura para obtener el scrollHeight real
      ref.current.style.height = `${minHeight}px`
      const scrollHeight = ref.current.scrollHeight
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight)
      setHeight(newHeight)
    }
  }, [value])

  return (
    <TextArea
      ref={ref}
      multiline
      readOnly={readOnly}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      onKeyDown={onKeyDown}
      style={{
        width: '100%',
        ...style,
        height,
        overflowY: height < maxHeight ? 'hidden' : 'auto',
      }}
      {...rest}
    />
  )
}


export const RuleItem = ({ value, loading, onDelete }) => {
  return (
    <XStack ai="center" gap="$2" mb="$2" width="100%">
      <AutoHeightTextArea
        readOnly
        value={value}
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

export const Rules = ({ rules, onAddRule, onDeleteRule, loadingIndex }) => {
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

      <YStack style={{ overflowY: 'auto', flex: 1, width: '100%' }}>
        {rules.map((rule, i) => (
          <RuleItem
            key={i}
            value={rule}
            loading={loadingIndex === i}
            onDelete={() => onDeleteRule(i)}
          />
        ))}
      </YStack>

      {/* Input para nueva regla */}
      <XStack ai="center" gap="$2" mb="$2" mt="$4" width="100%">
        <AutoHeightTextArea
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
