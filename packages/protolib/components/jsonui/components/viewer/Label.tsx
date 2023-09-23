import React from "react";
import { Stack, Text, Input, Switch, XStack, YStack, Paragraph } from "tamagui";
import { DeleteButton } from "./DeleteButton";
import { useUpdateEffect } from 'usehooks-ts'
import { ChevronDown, Binary, Type, ToggleLeft, Layers, LayoutList} from '@tamagui/lucide-icons'
import { Popover } from '@tamagui/popover'

function extractNumbers(data) {
  // Convert commas to dots
  let normalizedData = data.toString().replace(/,/g, '.');

  // Extract numbers and dots
  let withNumbersAndDecimals = normalizedData.replace(/[^0-9.]/g, '');

  // Split based on dots
  let parts = withNumbersAndDecimals.split('.');

  if (parts.length <= 2) {
    // If there's 1 or no dot
    return withNumbersAndDecimals;
  } else {
    // If there's more than 1 dot, include only the first one
    return parts.shift() + '.' + parts.join('');
  }
}

const Label = (props) => {
  const [editing, setEditing] = React.useState(false)

  let { editable, marginLeft, value, type, isLastSibling, styles } = props;
  let style = styles.text;
  switch (type) {
    case "number":
      style = styles.number;
      if (!isLastSibling) value = value;
      break;
    case "boolean":
      style = styles.boolean;
      value = value + ""; //coerce boolean to string, seems you cant return booleans in react elements
      if (!isLastSibling) value = value;
      break;
    case "property":
      style = styles.property;
      value = "" + value; //add quotes to string
      break;
    case "builtin":
      style = styles.builtin;
      value = value + "";
      if (!isLastSibling) value = value;
      break;
    default:
      style = styles.text;
  }
  const [content, setContent] = React.useState(value)
  value = content ?? value

  const isTextNode = type != 'builtin'
  const insideArray = /^\d+$/.test(props.currentKey)
  const width = type != 'number' ? value.length + 1 : Math.abs(value).toString().length + 1
  const left = insideArray ? 23 : (type == 'property' ? 27 : 5)
  // console.log('value: ', value, 'insideArray: ', insideArray, 'parents: ', props.parents, 'type:', type)
  const dataTypes = [
    {defaultValue: '', display: 'Text', value: 'text', icon: <Type size={20} color="var(--color7)" />},
    {defaultValue: 0,display: 'Number', value: 'number', icon: <Binary size={20} color="var(--color7)" />},
    {defaultValue: true, display: 'Boolean', value: 'boolean', icon: <ToggleLeft size={20} color="var(--color7)" />},
    {defaultValue: [], display: 'List', value: 'array', icon: <Layers size={20} color="var(--color7)" />},
    {defaultValue: {}, display: "Object", value: 'object', icon: <LayoutList size={20} color="var(--color7)" />}
  ]
  const getInput = () => {
    switch (type) {
      case "boolean":
        return <Switch size="$4">
          <Switch.Thumb animation="bouncy" />
        </Switch>
      case "property":
      case "builtin":
      case "number":
      default:
        return <XStack
          position="absolute"
          left={left + 'px'}
          marginLeft={marginLeft * 10}
          backgroundColor={"$background"}
          borderRadius={isTextNode ? "$3" : 0}
          padding={"$1"}
          top={-6}
        >
          <XStack

          >
          <Input
            focusStyle={{borderColor: 'transparent'}}
            padding={isTextNode ? "$1" : 0}
            value={content}
            borderColor={'transparent'}
            borderWidth={0}
            borderRadius={isTextNode ? "$3" : 0}
            paddingHorizontal={"$1"}
            paddingRight={0}
            fontSize={"14px"}
            maxHeight={"$2"}
            width={width + (type == 'property' ? 1:5) + 'ch'}
            fontFamily={"monospace"}
            onBlur={() => props.onChange('update', [...props.parents, props.currentKey], content, type)}
            //@ts-ignore
            onLayout={(e) => e.nativeEvent?.target?.focus()}
            onChangeText={(text) => setContent(type == 'number' ? extractNumbers(text) : text)}
            {...style}
          ></Input>
              {type != 'property' ? <XStack marginLeft={-25} position={'absolute'} top={5} left={width + 4 + 'ch'}>{/*marginLeft={width+'ch'}*/}
                
              <Popover placement="bottom">
                <Popover.Trigger>
                  <XStack cursor="pointer">
                    <ChevronDown size={"$1"} />
                  </XStack>
                  
                </Popover.Trigger>

                <Popover.Content padding={0} space={0} top={"$2"}>
                  <YStack paddingVertical={"$3"}>
                    {dataTypes.map((t) => (
                      <XStack
                        onPress={() => {
                          setContent(t.defaultValue)
                          props.onChange('type', [...props.parents, props.currentKey], t.defaultValue, t.value)
                        }} 
                        hoverStyle={{backgroundColor: "$backgroundHover"}} paddingHorizontal={"$3"} paddingVertical={4} cursor="pointer">
                        <XStack top={3} marginRight={10}>
                          {t.icon}
                        </XStack>
                        
                        <Paragraph marginBottom={3} marginRight={10}>
                          <Text color={type == t.value?"$color10":"$color7"} fontSize={13}>{t.display}</Text>
                        </Paragraph>
                      </XStack>
                    ))}
                  </YStack>
                </Popover.Content>

                {/* optionally change to sheet when small screen */}

              </Popover>
              </XStack>:null}
          </XStack>
        </XStack>
    }
  }

  const getComponent = () => {
    switch (type) {
      case "boolean":
        return <Switch left={"$4"} top="$1" size="$1">
          <Switch.Thumb backgroundColor={"$color9"} animation="bouncy" />
        </Switch>
      case "property":
      case "number":
      case "builtin":
      default:
        return <XStack
          marginLeft={props.single && isTextNode ? 0 : marginLeft * 10}
        >
          {(type == 'property' || (type == 'builtin' && insideArray && (value == '[' || value == '{'))) && editable ? <Stack display="inline"><DeleteButton onPress={() => {
            if (props.childType == 'builtin' || (type == 'builtin' && insideArray && (value == '[' || value == '{')))
              props.onChange('delete', [...props.parents], null, insideArray?'array':type)
            else
              props.onChange('delete', [...props.parents, props.currentKey])
          }} />&nbsp;</Stack> : null}
          <Text
            borderRadius={isTextNode ? "$3" : 0}
            padding={isTextNode ? "$1" : 0}
            paddingHorizontal={"$2"}
            onPress={() => isTextNode ? setEditing(!editing) : null}
            cursor="pointer"
            textOverflow="ellipsis"
            marginLeft={insideArray && !editable && type != 'builtin' ? marginLeft * 10 : (editable && type == 'builtin' && insideArray && (value == '{' || value == '[')?-5:0)}
            hoverStyle={{
              ...(isTextNode ? {
                backgroundColor: "$backgroundHover"
              } : {})
            }}
            {...style}>
            {value || editing ? value : <i style={{ opacity: 0.5 }}>{type == 'property' ? 'property' : 'value'}</i>}
          </Text>

        </XStack>
    }
  }
  return (
    <>
      <XStack height={"$2"}>
        {editable && props.single && isTextNode ? <Stack width="min-content" marginLeft={marginLeft * 11}>
          <DeleteButton onPress={() => {
            props.onChange('delete', [...props.parents, props.currentKey], '', 'array')
          }} />
        </Stack> : null}

        <Stack>{getComponent()}</Stack>
        {editing && editable ? getInput() : null}
      </XStack>
    </>
  );
};

export default Label;