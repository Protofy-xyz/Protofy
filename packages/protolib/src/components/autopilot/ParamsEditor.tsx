import { YStack, XStack, Label, Button, Input, ScrollView } from '@my/ui'
import { Trash } from '@tamagui/lucide-icons'
import { useState, useEffect, useCallback } from 'react'
import { InteractiveIcon } from '../InteractiveIcon'
import { nanoid } from 'nanoid'

export const ParamsEditor = ({ params = {}, setParams }) => {
  const [rows, setRows] = useState(() =>
    Object.entries(params).map(([k, v]) => ({
      id: nanoid(), 
      key: k, 
      value: v
    }))
  )

  useEffect(() => {
    const newObject = {}
    rows.forEach(({ key, value }) => {
      newObject[key] = value
    })
    setParams(newObject)
  }, [rows, setParams])

  const handleAddParam = useCallback(() => {
    setRows((prev) => [
      ...prev,
      { id: nanoid(), key: '', value: '' },
    ])
  }, [])

  const handleRemoveParam = useCallback((idToRemove) => {
    setRows((prev) => prev.filter((row) => row.id !== idToRemove))
  }, [])

  const handleChangeKey = useCallback((id, newKey) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? { ...row, key: newKey }
          : row
      )
    )
  }, [])

  const handleChangeValue = useCallback((id, newValue) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? { ...row, value: newValue }
          : row
      )
    )
  }, [])

  return (
    <YStack
      flex={1}
      height="100%"
      borderRadius="$3"
      p="$3"
      backgroundColor="$gray3"
      overflow="hidden"
    >
      <XStack alignItems="center" justifyContent="space-between">
        <Label size="$4">Parameters</Label>
        <Button onPress={handleAddParam}>Add param</Button>
      </XStack>

      <ScrollView mt="$3" flex={1}>
        {rows.map(({ id, key, value }) => (
          <XStack
            key={id}
            space="$2"
            alignItems="center"
            padding="$2"
            borderRadius="$2"
          >
            <Input
              placeholder="Name"
              flex={1}
              value={key}
              onChange={(e) => handleChangeKey(id, e.target.value)}
            />
            <Input
              placeholder="Description"
              flex={2}
              value={value}
              onChange={(e) => handleChangeValue(id, e.target.value)}
            />
            <InteractiveIcon
              Icon={Trash}
              IconColor="var(--red10)"
              onPress={() => handleRemoveParam(id)}
            />
          </XStack>
        ))}
      </ScrollView>
    </YStack>
  )
}
