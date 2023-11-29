import { Button, Fieldset, Input, Label, Stack, XStack, YStack, Paragraph, Spinner, Text, StackProps, Accordion, Square, Spacer, Switch } from "tamagui";
import { Pencil, Tag, ChevronDown, X, Tags, List, Layers } from '@tamagui/lucide-icons';
import { Center, Grid, AsyncView, usePendingEffect, API, Tinted, Notice, getPendingResult, SelectList, SimpleSlider, AlertDialog } from 'protolib'
import React, { useEffect, useMemo, useRef, useState } from "react";
import { getErrorMessage } from "@my/ui";
import { ProtoSchema } from "protolib/base";
import { Schema } from "../base";
import { useUpdateEffect } from "usehooks-ts";
import { useTint } from 'protolib'
import { ItemMenu } from "./ItemMenu";
import { MultiSelectList } from "./MultiSelectList";

export type EditableObjectProps = {
  initialData?: any,
  sourceUrl: string,
  onSave: Function,
  model: any,
  mode?: 'add' | 'edit' | 'view' | 'preview',
  icons?: any,
  extraFields?: any,
  numColumns?: number,
  objectId?: string,
  title?: any,
  loadingText?: any,
  loadingTop?: number,
  spinnerSize?: number,
  name?: string,
  customFields?: any,
  columnWidth?: number,
  disableToggleMode?: boolean,
  columnMargin?: number,
  onDelete?: Function,
  autoWidth?: Boolean,
  EditIconNearTitle?: Boolean,
  extraMenuActions: any[]
}

const capitalize = s => s && s[0].toUpperCase() + s.slice(1)
const iconStyle = { color: "var(--color9)", size: "$1", strokeWidth: 1 }

const FormElement = ({ ele, i, icon, children, inArray = false }) => {
  return <Fieldset ml={!i ? "$0" : "$5"} key={i} gap="$2" f={1}>
    {!inArray && <Label fontWeight={"bold"}>
      <Tinted>
        <Stack mr="$2">{React.createElement(icon, iconStyle)}</Stack>
      </Tinted>
      {ele._def.label ?? ele.name}
    </Label>}
    {inArray && <Spacer size="$1" />}
    {children}
  </Fieldset>
}

const defaultValueTable = {
  ZodString: "",
  ZodNumber: "0",
  ZodBoolean: true,
  default: ""
}

const getDefaultValue = (type) => {
  if (defaultValueTable.hasOwnProperty(type)) {
    return defaultValueTable[type]
  }

  //dynamic values. Do not put them in defaultValueTable, since they will be references
  //all values in valuetable are variables passed as values, not passed as reference
  if (type == 'ZodArray') return []
  else if (type == 'ZodObject') return {}

  return defaultValueTable.default
}

const ArrayComp = ({ ele, elementDef, icon, path, arrData, getElement, setFormData, data, setData, mode, customFields }) => {
  return <FormGroup ele={ele} title={' (' + arrData.length + ')'} icon={Layers}>
    <Stack>
      {arrData.map((d, i) => {
        return <XStack key={i} mt={i ? "$2" : "$0"} ml="$1">
          {elementDef.type._def.typeName != 'ZodObject' && <Tinted>
            <XStack mr="$2" top={20}>
              {mode == 'edit' || mode == 'add' ? <Pencil {...iconStyle} /> : <Tags {...iconStyle} />}
            </XStack>
          </Tinted>}
          {getElement({ ...elementDef.type._def, _def: elementDef.type._def, name: i }, icon, 0, 0, data, setData, mode, customFields, [...path, ele.name], true, ele.name)}
          {(mode == 'edit' || mode == 'add') && <Stack ml={"$2"}
            top={13} br={"$5"} p={"$2"}
            als="flex-start" cursor='pointer'
            {...elementDef.type._def.typeName != 'ZodObject' ? {} : {
              position: "absolute",
              right: '$6',
              top: 6
            }}
            pressStyle={{ o: 0.7 }} hoverStyle={{ bc: "$red4" }}
            onPress={() => {
              arrData.splice(i, 1)
              setFormData(ele.name, [...arrData])
            }}>
            <X color={'var(--red7)'} strokeWidth={2} size={20} />
          </Stack>}
        </XStack>
      })}
    </Stack>
    {(mode == 'edit' || mode == 'add') && <Button mt="$4" onPress={() => {
      const eleDef = ele._def.typeName == 'ZodLazy' ? ele._def.getter()._def : ele._def
      const defaultValue = eleDef.typeName == "ZodOptional" ? eleDef.innerType._def.type._def.typeName : eleDef.type._def.typeName
      setFormData(ele.name, [...arrData, getDefaultValue(elementDef.type._def.typeName)])
    }}>Add{ele._def.label ?? ele.name}</Button>}
  </FormGroup>
}

const UnionsArrayComp = ({ ele, icon, i, inArray, eleArray, formData, generatedOptions, setFormData }) => {
  const primitives = ["ZodNumber", "ZodString", "ZodLiteral"] // add more primitives with the time

  let defaultChoices = eleArray.map(zodEle => {
    return primitives.includes(zodEle.typeName)
      ? String(zodEle.value)
      : JSON.stringify(zodEle.value)
  })

  return <FormElement ele={ele} icon={icon} i={i} inArray={inArray}>
    <MultiSelectList choices={generatedOptions.length ? generatedOptions : defaultChoices} defaultSelections={formData} onSetSelections={(selections) => setFormData(ele.name, selections)} />
  </FormElement>
}

const RecordComp = ({ ele, inArray, recordData, elementDef, icon, data, setData, mode, customFields, path, setFormData }) => {
  const [menuOpened, setMenuOpened] = useState(false)
  const [name, setName] = useState("")

  return <FormGroup ele={ele} title={inArray ? ' #' + (ele.name + 1) : '...'} icon={List}>
    <Stack>
      {recordData ? Object.keys(recordData).map((key, i) => {
        return <XStack key={i} mt={i ? "$2" : "$0"} ml="$1">
          {/* {elementDef.type._def.typeName != 'ZodObject' && <Tinted><XStack mr="$2" top={20}>{mode == 'edit' || mode == 'add' ? <Pencil {...iconStyle} /> : <Tags {...iconStyle} />}</XStack></Tinted>} */}
          {getElement({ ...elementDef.valueType, name: key }, icon, 0, 0, data, setData, mode, customFields, [...path, ele.name])}
        </XStack>
      }) : null}
    </Stack>
    <AlertDialog
      acceptCaption="Add field"
      setOpen={setMenuOpened}
      open={menuOpened}
      onAccept={async (setMenuOpened) => {
        setMenuOpened(false)
        setName("")
        const val = getDefaultValue(ele._def.valueType._def.typeName)
        setFormData(ele.name, { ...recordData, [name]: val })
      }}
      title={'Add new field'}
      description={""}
    >
      <YStack f={1} alignItems="center" mt="$6" justifyContent="center">
        <Input f={1} value={name} onChangeText={(text) => setName(text)} textAlign='center' id="name" placeholder='Field name...' />
      </YStack>
    </AlertDialog>
    {(mode == 'edit' || mode == 'add') && <Button mt="$5" onPress={() => { setMenuOpened(true) }}> Add field</Button>}
  </FormGroup>
}

const FormGroup = ({ ele, title, children, icon, simple = false }) => {
  const [opened, setOpened] = useState([''])
  const content = <XStack br="$5" f={1} elevation={opened.includes('item') ? 10 : 0} hoverStyle={{ elevation: 10 }}><Accordion onValueChange={(opened) => setOpened(opened)} onPress={(e) => e.stopPropagation()} type="multiple" boc={"$gray6"} f={1}>
    <Accordion.Item br="$5" bw={1} boc={"$gray6"} value={"item"}>
      <Accordion.Trigger p={0} px={8} height={43} bc="$transparent" focusStyle={{ bc: "$transparent" }} br={opened.includes("item") ? "$0" : '$5'} btlr="$5" btrr="$5" bw="$0" flexDirection="row" ai="center">
        {({ open }) => (
          <>
            <Tinted>{simple ? React.createElement(icon, iconStyle) : <></>}</Tinted>
            <Paragraph ml={"$2"}>{title}</Paragraph>
            <Spacer flex={1} />
            <Square animation="quick" rotate={open ? '180deg' : '0deg'}>
              <ChevronDown size="$1" />
            </Square>
          </>
        )}
      </Accordion.Trigger>
      <Accordion.Content br="$5">
        {children}
      </Accordion.Content>
    </Accordion.Item>
  </Accordion></XStack>
  return simple ? content : <FormElement ele={ele} icon={icon} i={0}>
    {content}
  </FormElement>
}

const getElement = (ele, icon, i, x, data, setData, mode, customFields = {}, path = [], inArray?, arrayName?) => {
  let elementDef = ele._def?.innerType?._def ?? ele._def
  const setFormData = (key, value) => {
    const formData = data;
    let target = formData;
    let prevTarget;
    let prevKey;

    path.forEach((p) => {
      if (!Array.isArray(target) && !target.hasOwnProperty(p)) {
        target[p] = {};
      }
      prevTarget = target
      prevKey = p
      target = target[p];
    });

    target[key] = value;
    setData({ data: formData });
  }

  const getFormData = (key, customPath?) => {
    let target = data ?? {};
    let _path = customPath ?? path
    for (const p of _path) {
      if ((typeof target === 'object' && target.hasOwnProperty(p)) ||
        (Array.isArray(target) && target.length > p)) {
        target = target[p];
      }
    }
    if (typeof target === 'string') {
      return target
    }

    // Retorna el valor de ele.name o un valor predeterminado.
    return target && target.hasOwnProperty(key) ? target[key] : '';
  }

  let elementType = elementDef.typeName
  if (elementType == 'ZodLazy') {
    let newele = elementDef.getter()
    elementDef = newele._def
    elementType = newele.constructor.name
    newele.name = ele.name
    ele = newele
  }

  // console.log('custom fields: ', customFields, 'ele: ', ele.name, elementType)

  // TODO Check if custom element
  if (customFields.hasOwnProperty(ele.name) || customFields.hasOwnProperty('*')) {
    const customField = customFields.hasOwnProperty(ele.name) ? customFields[ele.name] : customFields['*']
    const comp = typeof customField.component == 'function' ? customField.component(path, getFormData(ele.name), (data) => setFormData(ele.name, data), mode, data) : customField.component
    if (comp) return !customField.hideLabel ? <FormElement ele={ele} icon={icon} i={i} inArray={inArray}>{comp}</FormElement> : comp
  }

  if (elementType == 'ZodUnion' && mode != 'preview') {
    // default values
    let options = elementDef.displayOptions ? elementDef.displayOptions : elementDef.options.map(o => o._def.value)
    let _rawOptions = elementDef.options.map(o => o._def.value)

    // depends on
    if (ele._def.dependsOn && data
      && data[ele._def.dependsOn]
      && (typeof ele._def.generateOptions === 'function')) {
      options = ele._def.generateOptions(data)
      _rawOptions = [...options]
    }

    const dependsOn = ele._def.dependsOn
    const dependsOnValue = ele._def.dependsOnValue;

    const getDependsField = () => { // TODO: refactor
      if (dependsOn) {
        if (data[dependsOn]) {
          if (dependsOnValue) {
            if (dependsOnValue == data[dependsOn]) {
              return <SelectList f={1} data={data} title={ele.name} elements={options} value={options[_rawOptions.indexOf(getFormData(ele.name))]} setValue={(v) => setFormData(ele.name, _rawOptions[options.indexOf(v)])} />
            } else {
              return <Input
                focusStyle={{ outlineWidth: 1 }}
                disabled={true}
                placeholder={ele._def.hint ? ele._def.hint : 'Fill ' + dependsOn + ' property first'}
                bc="$backgroundTransparent"
              ></Input>
            }
          } else {
            return <SelectList f={1} data={data} title={ele.name} elements={options} value={options[_rawOptions.indexOf(getFormData(ele.name))]} setValue={(v) => setFormData(ele.name, _rawOptions[options.indexOf(v)])} />
          }
        } else {
          return <Input
            focusStyle={{ outlineWidth: 1 }}
            disabled={true}
            placeholder={ele._def.hint ? ele._def.hint : 'Fill ' + dependsOn + ' property first'}
            bc="$backgroundTransparent"
          ></Input>
        }
      }
      else {
        return <SelectList f={1} data={data} title={ele.name} elements={options} value={options[_rawOptions.indexOf(getFormData(ele.name))]} setValue={(v) => setFormData(ele.name, _rawOptions[options.indexOf(v)])} />
      }
    }

    return <FormElement ele={ele} icon={icon} i={i} inArray={inArray}>
      {getDependsField()}
    </FormElement>
  } else if (elementType == 'ZodNumber' && mode != 'preview') {
    if (elementDef.checks) {
      const min = elementDef.checks.find(c => c.kind == 'min')
      const max = elementDef.checks.find(c => c.kind == 'max')
      if (min && max) {
        return <FormElement ele={ele} icon={icon} i={i} inArray={inArray}>
          <Tinted>
            <Stack f={1} mt="$4">
              <SimpleSlider onValueChange={v => setFormData(ele.name, v)} value={[getFormData(ele.name) ?? min.value]} width={190} min={min.value} max={max.value} />
            </Stack>
          </Tinted>
        </FormElement>
      }
    }
  } else if (elementType == 'ZodObject') {
    return <FormGroup simple={true} ele={ele} title={inArray ? (ele._def.keyName ? getFormData(ele._def.keyName, [...path, ele.name]) : arrayName + ' #' + (ele.name + 1)) : ele.name} icon={List}>
      <Stack>
        {/* <Stack alignSelf="flex-start" backgroundColor={"$background"} px="$2" left={10} pos="absolute" top={-13}><SizableText >{typeof ele.name === "number"? '': ele.name}</SizableText></Stack> */}
        {Object.keys(elementDef.shape()).map((s, i) => {
          const shape = elementDef.shape();
          return <Stack key={i} mt={i ? "$5" : "$0"}>{getElement({ ...shape[s], name: s }, icon, 0, 0, data, setData, mode, customFields, [...path, ele.name])}</Stack>
        })}
      </Stack>
    </FormGroup>
  } else if (elementType == 'ZodArray') {
    const formData = getFormData(ele.name) ? getFormData(ele.name) : []
    let generatedOptions = []

    // ---- MODIFIERS ---- 
    // generateOptions
    if ((typeof ele._def.generateOptions === 'function')) {
      generatedOptions = ele._def.generateOptions(data)
    }

    const isUnion = !ele._def.innerType && ele._def.type._def.typeName === 'ZodUnion'
    if (isUnion) {
      // ele => union options array (zTypes[])
      return <UnionsArrayComp ele={ele} icon={icon} i={i} inArray={inArray} eleArray={ele._def.type._def.options} formData={formData} generatedOptions={generatedOptions} setFormData={setFormData} />
    }

    return <ArrayComp data={data} setData={setData} mode={mode} ele={ele} elementDef={elementDef} icon={icon} customFields={customFields} path={path} arrData={formData ? formData : generatedOptions} getElement={getElement} setFormData={setFormData} />
  } else if (elementType == 'ZodRecord') {
    const recordData = getFormData(ele.name)
    return <RecordComp ele={ele} inArray={inArray} recordData={recordData} elementDef={elementDef} icon={icon} data={data} setData={setData} mode={mode} customFields={customFields} path={path} setFormData={setFormData} />
  } else if (elementType == 'ZodBoolean') {
    const recordData: any = getFormData(ele.name)
    return <FormElement ele={ele} icon={icon} i={i} inArray={inArray}>
      <Tinted>
        <Stack f={1} mt="$4">
          <Switch disabled={mode != 'add' && mode != 'edit'} checked={recordData} onCheckedChange={v => setFormData(ele.name, v)} size="$2">
            <Switch.Thumb animation="quick" />
          </Switch>
          {/* <SimpleSlider onValueChange={v => setFormData(ele.name, v)} value={[getFormData(ele.name) ?? min.value]} width={190} min={min.value} max={max.value} /> */}
        </Stack>
      </Tinted>
    </FormElement>
  }

  return <FormElement ele={ele} icon={icon} i={i} inArray={inArray}>
    <Stack f={1}>
      <Input
        {...(mode != 'edit' && mode != 'add' ? { bw: 0, forceStyle: "hover" } : {})}
        focusStyle={{ outlineWidth: 1 }}
        disabled={(mode == 'view' || mode == 'preview' || (mode == 'edit' && ele._def.static) || (ele._def.dependsOn && !data[ele._def.dependsOn]))}
        secureTextEntry={ele._def.secret}
        value={getFormData(ele.name)}
        onChangeText={(t) => setFormData(ele.name, ele._def.typeName == 'ZodNumber' ? t.replace(/[^0-9.-]/g, '') : t)}
        placeholder={!data ? '' : ele._def.hint ?? ele._def.label ?? (typeof ele.name == "number" ? "..." : ele.name)}
        autoFocus={x == 0 && i == 0}
        onBlur={() => {
          if (ele._def.typeName == 'ZodNumber') {
            const numericValue = parseFloat(getFormData(ele.name));
            if (!isNaN(numericValue)) {
              setFormData(ele.name, numericValue);
            }
          }
        }}
        bc="$backgroundTransparent"
      >
      </Input>
    </Stack>
  </FormElement>
}

//{...(data.ele._def.size?{width: data.ele._def.size*columnWidth}:{})}
const GridElement = ({ index, data, width }) => {
  const size = data.ele._def.size || 0
  const colWidth = data.ele._def.numColumns || 1
  const realSize = data.ele._def.size || 1
  // console.log('colwidth: ', colWidth, realSize, columnMargin/Math.max(1,((colWidth*2)-(realSize*2))))

  return <XStack f={1} width={(width * realSize) + ((realSize - 1) * (data.columnMargin / realSize))} key={data.x} mb={'$0'}>
    {getElement(data.ele, data.icon, data.i, data.x, data.data || {}, data.setData, data.mode, data.customFields)}
  </XStack>
}

export const EditableObject = ({ EditIconNearTitle = false, autoWidth = false, columnMargin = 30, columnWidth = 350, extraMenuActions, disableToggleMode, name, initialData, loadingTop, spinnerSize, loadingText, title, sourceUrl = null, onSave, mode = 'view', model, icons = {}, extraFields = {}, numColumns = 1, objectId, onDelete = () => { }, customFields = {}, ...props }: EditableObjectProps & StackProps) => {
  const [originalData, setOriginalData] = useState(initialData ?? getPendingResult('pending'))
  const [currentMode, setCurrentMode] = useState(mode)
  const [prevCurrentMode, setPrevCurrentMode] = useState('')
  const [data, setData] = useState(originalData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [edited, setEdited] = useState(false)
  const [ready, setReady] = useState(false)
  const containerRef = useRef()

  usePendingEffect((s) => { mode != 'add' && API.get(sourceUrl, s) }, setOriginalData, initialData)

  useEffect(() => {
    if (originalData.data) {
      setData(originalData)
    }
  }, [originalData])

  useUpdateEffect(() => setCurrentMode(mode), [mode])

  useUpdateEffect(() => {
    if (ready) {
      setEdited(true)
    } else {
      setReady(true)
    }
  }, [data])

  const getGroups = () => {
    const elementObj = model.load(data.data)
    const extraFieldsObject = ProtoSchema.load(Schema.object(extraFields))
    const formFields = elementObj.getObjectSchema().isDisplay(currentMode).merge(extraFieldsObject).getLayout(1)
    const groups = {}
    formFields.forEach((row, x) => row.forEach((ele, i) => {
      const icon = icons[ele.name] ? icons[ele.name] : (currentMode == 'edit' || currentMode == 'add' ? Pencil : Tag)
      const groupId = ele._def.group ?? 0
      if (!groups.hasOwnProperty(groupId)) {
        groups[groupId] = []
      }
      groups[groupId].push({
        id: x + '_' + i,
        icon: icon,
        i: i,
        x: x,
        ele: ele,
        data: data.data,
        setData,
        mode: currentMode,
        size: ele._def.size ?? 1,
        numColumns: numColumns,
        customFields,
        columnMargin: columnMargin
      })
    }))
    return groups
  }

  const groups = useMemo(getGroups, [extraFields, data, model, columnMargin, numColumns, currentMode, mode, originalData])

  const gridView = useMemo(() => Object.keys(groups).map((k, i) => <XStack ref={containerRef} mt={i ? "$0" : "$0"} width={autoWidth ? '100%' : columnWidth * (numColumns) + columnMargin} f={1}>
    <YStack f={1}>
      <Grid masonry={false} containerRef={containerRef} spacing={columnMargin / 2} data={groups[k]} card={GridElement} itemMinWidth={columnWidth} columns={numColumns} />
    </YStack>
    {currentMode == 'preview' && <Stack t={"$-5"}>
      <ItemMenu sourceUrl={sourceUrl} onDelete={onDelete} element={model.load(data.data)} extraMenuActions={extraMenuActions} />
    </Stack>}
  </XStack>), [columnMargin, groups, columnWidth, numColumns])

  const { tint } = useTint()

  return <Stack width="100%" {...props}>
    <AlertDialog
      showCancel={true}
      acceptCaption="Discard"
      cancelCaption="Keep editing"
      onAccept={async () => {
        const data = await API.get(sourceUrl)
        setOriginalData(data)
        setCurrentMode('view')
      }}
      cancelTint={tint}
      acceptTint="red"
      open={dialogOpen}
      setOpen={setDialogOpen}
      title="Are you sure you want to leave?"
      description=""
    >
      <Center mt="$5">All unsaved changes will be lost</Center>
    </AlertDialog>
    <AsyncView forceLoad={currentMode == 'add' || data.data} waitForLoading={1000} spinnerSize={spinnerSize} loadingText={loadingText ?? "Loading " + objectId} top={loadingTop ?? -30} atom={data}>
      <YStack width="100%">
        <XStack ai="center">
          <XStack f={EditIconNearTitle ? 0 : 1} mr={"$5"}>
            {title ?? <Text fontWeight="bold" fontSize={40}><Tinted><Text color="$color9">{capitalize(currentMode)}</Text></Tinted><Text color="$color11"> {capitalize(name)}</Text></Text>}
          </XStack>
          {(!disableToggleMode && (currentMode == 'view' || currentMode == 'edit')) && <XStack pressStyle={{ o: 0.8 }} onPress={async () => {
            if (currentMode == 'edit' && edited) {
              setDialogOpen(true)
            } else {
              setPrevCurrentMode(currentMode)
              setCurrentMode(currentMode == 'view' ? 'edit' : 'view')
            }
          }} cursor="pointer">
            <Tinted>
              <Stack>{currentMode == 'view' ? <Pencil color="var(--color8)" /> : (prevCurrentMode == 'view' ? <X color="var(--color8)" /> : null)}</Stack>
            </Tinted>
          </XStack>}
        </XStack>
        <YStack width="100%" f={1} mt={"$7"} ai="center" jc="center">
          {error && (
            <Notice>
              <Paragraph>{getErrorMessage(error.error)}</Paragraph>
            </Notice>
          )}

          {gridView}

          {currentMode != 'preview' && <YStack mt="$4" p="$2" pb="$5" width="100%" f={1} alignSelf="center">
            {(currentMode == 'add' || currentMode == 'edit') && <Tinted>
              <Button f={1} onPress={async () => {
                setLoading(true)
                try {
                  await onSave(originalData.data, data.data)
                  if (prevCurrentMode != currentMode) {
                    setCurrentMode(prevCurrentMode as any)
                  }
                } catch (e) {
                  setError(e)
                  console.log('e: ', e)
                }
                setLoading(false)
              }}>
                {loading ? <Spinner /> : currentMode == 'add' ? 'Create' : 'Save'}
              </Button>
            </Tinted>}
          </YStack>}
        </YStack>
      </YStack>
    </AsyncView>
  </Stack>
}