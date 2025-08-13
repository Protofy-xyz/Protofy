import { Boxes, Hash, Info, List, ListOrdered, Loader, PackageOpen, Phone, TestTube, X } from '@tamagui/lucide-icons'
import { useEffect, useState } from 'react'
import type { ColorTokens } from 'tamagui'
import { Avatar, Button, Circle, H1, H5, Paragraph, ScrollView, Separator, SizableText, Text, View, XStack, YGroup, YStack } from 'tamagui'
import { FlatList } from 'react-native'
import { InteractiveIcon } from './InteractiveIcon'
import { useUpdateEffect } from 'usehooks-ts'
import { Input } from '@my/ui'


export function ViewList({ items, onDeleteItem = (item, index) => { }, onClear = (items) => { }, onPush = (item) => { } }) {
  const [itemsList, setItemsList] = useState(items ?? [])
  const [addText, setAddText] = useState('')
  const renderItem = ({ item, index }) => (
    <ViewListItem item={item} index={index} onDeleteItem={onDeleteItem} />
  )

  useEffect(() => {
    setItemsList(items ?? [])
  }, [items])

  return (
    <YStack className='no-drag' height="100%" f={1}>
      {itemsList.length ? <XStack>
        <XStack f={1} ml={"$3"}>
          <InteractiveIcon onPress={() => onClear(items)} Icon="trash"><SizableText mr="$2">Clear all</SizableText></InteractiveIcon>
        </XStack>
        <XStack mr={"$4"} ai="center" gap={"$2"}>
          <SizableText fontWeight={"500"} o={0.8}>Total: {itemsList.length}</SizableText>
        </XStack>
      </XStack> : <></>}

      {itemsList.length ? <ScrollView height="100%" width="100%" flex={1} mt={"$2"} mb={"$4"}>
        <FlatList
          data={itemsList}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <></>}
          keyExtractor={(item) => item.id}
          style={{ flex: 1 }}
          contentContainerStyle={{}}
          showsVerticalScrollIndicator={false}
        /></ScrollView> : <YStack jc="center" ai="center" height="100%" f={1} o={1}>
        <Info color="$color7" size={50} />
        <Paragraph mt={"$4"} fontSize={"$8"} fontWeight="600" color="$color">Empty queue</Paragraph>
      </YStack>}

      <XStack m={"$2"}>
        <YStack f={1}>
          <Input
            value={addText}
            width="100%"
            placeholder="Add new item"
            onChangeText={(text) => {
              console.log('onChangeText', text)
              setAddText(text)
            }} />
            <Button
              mt={"$2"}
              mb={"$2"}
              width="100%"
              disabled={!addText}
              onPress={() => {
                if (addText) {
                  onPush(addText)
                  setAddText('')
                }
              }}><SizableText>Add</SizableText>
            </Button>
        </YStack>
      </XStack>

    </YStack>

  )
}



function ViewListItem({ item, index, onDeleteItem }) {
  return (
    <View
      p={"$2"}
      pl={"$3"}
      paddingVertical="$3"
      m={"$1"}
      marginHorizontal="$2"
      borderRadius="$5"
      backgroundColor="$background"
      flexDirection="row"
      // paddingVertical="$2"
      // gap="$4"
      // $gtXs={{
      //   padding: '$4',
      //   gap: '$4',  
      // }}
      alignItems="center"
    >
      <View f={1} flexDirection="column" flexShrink={1} justifyContent="center">
        <SizableText fontWeight={"500"} color="$color11">{item}</SizableText>
        {/* <Text fontWeight="$2" theme="alt1">
          {item.status.status}
        </Text> */}
      </View>
      <View opacity={0} hoverStyle={{ opacity: 1 }} pressStyle={{ opacity: 0.8 }} onPress={() => onDeleteItem(item, index)} >
        <X color="$red10" />
      </View>
    </View>
  )
}

