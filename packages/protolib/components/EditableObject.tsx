import { Button, Fieldset, Input, Label, Stack, XStack, YStack, Paragraph, Spinner, Text, Dialog, H1, SizableText, StackProps, Accordion, Square } from "tamagui";
import { Pencil, Tag, ChevronDown, X } from '@tamagui/lucide-icons';
import { Center, Grid, AsyncView, usePendingEffect, API, Tinted, Notice, getPendingResult, SelectList, SimpleSlider, AlertDialog } from 'protolib'
import React, { useEffect, useState } from "react";
import { getErrorMessage } from "@my/ui";
import { ProtoSchema } from "protolib/base";
import { Schema } from "../base";
import { useUpdateEffect } from "usehooks-ts";
import { useTint } from '@tamagui/logo'

type EditableObjectProps = {
    initialData?: any,
    sourceUrl: string,
    onSave: Function,
    model: any,
    mode: 'add' | 'edit' | 'view',
    icons?: any,
    extraFields?: any,
    numColumns?: number,
    initialContent: any,
    objectId?: string,
    title?: any,
    loadingText?: any,
    loadingTop?: number,
    spinnerSize?: number,
    name?: string
}

const capitalize = s => s && s[0].toUpperCase() + s.slice(1)
const columnWidth = 350
const columnMargin = 30

const FormElement = ({ ele, i, icon, children }) => {
    return <Fieldset ml={!i ? "$0" : "$5"} key={i} gap="$2" f={1}>
        <Label fontWeight={"bold"}>
            <Tinted>
                <Stack mr="$2">{React.createElement(icon, { color: "var(--color9)", size: "$1", strokeWidth: 1 })}</Stack>
            </Tinted>
            {ele._def.label ?? ele.name}
        </Label>
        {children}
    </Fieldset>
}


const ArrayComp = ({ele, elementDef, icon, path, arrData, getElement, setFormData, data, setData, mode}) => {
    const [opened, setOpened] = useState([])

    return <Accordion value={opened} onValueChange={(value) => setOpened(value)} type="multiple" br="$5" bw={1} mt="$2" pt="$2" boc={"$gray6"} f={1} pb="$3" px={"$3"}>
    <Stack alignSelf="flex-start" backgroundColor={"$background"} px="$2" left={6} top={-20}>
        <SizableText fontWeight={"bold"} >{ele.name + ' (' + arrData.length + ')'}</SizableText>
    </Stack>
    
    {
        arrData.map((d, i) => {
            return <Accordion.Item key={i} br="$5" bw={1} boc={"$gray6"} mt={i?"$2":"$0"} value={"item-"+i}>
                <Accordion.Trigger br="$5" bw="$0" flexDirection="row" justifyContent="space-between">
                {({ open }) => (
                    <>
                    <Paragraph>{ele.name + ' #'+i}</Paragraph>
                    <Square animation="quick" rotate={open ? '180deg' : '0deg'}>
                        <ChevronDown size="$1" />
                    </Square>
                    </>
                )}
                </Accordion.Trigger>
                <Accordion.Content br="$5">
                    <Stack top={-10}>
                        {getElement({ ...elementDef.type._def, _def:elementDef.type._def, name: i }, icon, 0, 0, data, setData, mode, [...path, ele.name, i])}
                    </Stack>
                </Accordion.Content>
            </Accordion.Item>
        })
    }
    
    <Button mt="$3" onPress={() => {
        setFormData(ele.name, [...arrData, {}])
        setOpened([...opened, 'item-'+arrData.length])
    }}>Add{ele.name}</Button>
</Accordion>
}
const getElement = (ele, icon, i, x, data, setData, mode, path = []) => {
    const elementDef = ele._def?.innerType?._def??ele._def 

    const setFormData = (key, value) => {
        console.log('set form data: ', key, value, path);
        console.log('before: ', data);

        const formData = { ...data };
        let target = formData;

        let prevTarget;
        let prevKey;
        path.forEach((p) => {
            if (typeof prevKey !== 'number' && !Array.isArray(target) && !target.hasOwnProperty(p)) {
                target[p] = {};
            } 
            prevTarget = target
            prevKey = p
            target = target[p];
        });

        console.log('prev target: ', prevTarget)
        if (typeof prevKey == 'number') {
            console.log('setting arrays')
            prevTarget[key] = value;
        } else {
            target[key] = value;
        }
        console.log('after: ', formData);
        setData(formData);
    }

    const getFormData = (key) => {
        let target = data ?? {};

        for (const p of path) {
            if ((typeof target === 'object' && target.hasOwnProperty(p)) ||
                (Array.isArray(target) && target.length > p)) {
                target = target[p];
            }
        }
        if(typeof target === 'string') {
            return target
        }
        // Retorna el valor de ele.name o un valor predeterminado.
        return target && target.hasOwnProperty(key) ? target[key] : '';
    }

    const elementType = elementDef.typeName

    if (elementType == 'ZodUnion') {
        const _rawOptions = elementDef.options.map(o => o._def.value)
        const options = elementDef.displayOptions ? elementDef.displayOptions : elementDef.options.map(o => o._def.value)
        return <FormElement ele={ele} icon={icon} i={i}>
            <SelectList f={1} title={ele.name} elements={options} value={getFormData(ele.name)} setValue={(v) => setFormData(ele.name, _rawOptions[options.indexOf(v)])} />
        </FormElement>
    } else if (elementType == 'ZodNumber') {
        if (elementDef.checks) {
            const min = elementDef.checks.find(c => c.kind == 'min')
            const max = elementDef.checks.find(c => c.kind == 'max')
            if (min && max) {
                return <FormElement ele={ele} icon={icon} i={i}>
                    <Tinted>
                        <Stack f={1} mt="$4">
                            <SimpleSlider onValueChange={v => setFormData(ele.name, v)} value={[getFormData(ele.name) ?? min.value]} width={190} min={min.value} max={max.value} />
                        </Stack>
                    </Tinted>
                </FormElement>
            }
        }
    } else if (elementType == 'ZodObject') {
        return <Accordion type="multiple" br="$5" boc={"$gray6"} f={1}>
        {/* <Stack alignSelf="flex-start" backgroundColor={"$background"} px="$2" left={6} top={-20}>
            <SizableText >{ele.name + ' (' + arrData.length + ')'}</SizableText>
        </Stack> */}
            <Accordion.Item key={i} br="$5" bw={1} boc={"$gray6"} mt={"$2"} value={"item-"+i}>
                    <Accordion.Trigger br="$5" bw="$0" flexDirection="row" justifyContent="space-between">
                    {({ open }) => (
                        <>
                        <Paragraph fontWeight={"bold"}>{ele.name}</Paragraph>
                        <Square animation="quick" rotate={open ? '180deg' : '0deg'}>
                            <ChevronDown size="$1" />
                        </Square>
                        </>
                    )}
                    </Accordion.Trigger>
                    <Accordion.Content br="$5">
                        <Stack>
                            {/* <Stack alignSelf="flex-start" backgroundColor={"$background"} px="$2" left={10} pos="absolute" top={-13}><SizableText >{typeof ele.name === "number"? '': ele.name}</SizableText></Stack> */}
                            {Object.keys(ele._def.shape()).map((s, i) => {
                                const shape = ele._def.shape();
                                return <Stack mt={i?"$5":"$0"}>{getElement({ ...shape[s], name: s }, icon, 0, 0,data, setData, mode, [...path, ele.name])}</Stack>
                            })}
                        </Stack>
                    </Accordion.Content>
            </Accordion.Item>
        </Accordion>
    } else if (elementType == 'ZodArray') {
        const arrData = getFormData(ele.name) ? getFormData(ele.name) : []
        return <ArrayComp data={data} setData={setData} mode={mode} ele={ele} elementDef={elementDef} icon={icon} path={path} arrData={arrData} getElement={getElement} setFormData={setFormData} />
    }

    return <FormElement ele={ele} icon={icon} i={i}>
        <Stack f={1}>
            <Input
                {...(mode != 'edit' && mode != 'add' ? {bw:0, forceStyle:"hover"}:{})}
                focusStyle={{outlineWidth: 1 }}
                disabled={(mode == 'view' || (mode == 'edit' && ele._def.static))}
                secureTextEntry={ele._def.secret}
                value={getFormData(ele.name)}
                onChangeText={(t) => setFormData(ele.name, ele._def.typeName == 'ZodNumber' ? t.replace(/[^0-9.-]/g, '') : t)}
                placeholder={!data ? '' : ele._def.hint ?? ele._def.label ?? ele.name}
                autoFocus={x == 0 && i == 0}>
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
    
    return <XStack f={1} width={(width*realSize)+((realSize-1)*(columnMargin/realSize))} key={data.x} mb={'$0'}>
        {getElement(data.ele, data.icon, data.i, data.x, data.data, data.setData, data.mode)}
    </XStack>
}

export const EditableObject = ({ name, initialData, loadingTop, spinnerSize, loadingText, title, sourceUrl=null, onSave, mode = 'view', model, icons = {}, extraFields, numColumns = 1, objectId, ...props }: EditableObjectProps & StackProps) => {
    const [originalData, setOriginalData] = useState(initialData ?? getPendingResult('pending'))
    const [currentMode, setCurrentMode] = useState(mode)
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<any>()
    const [dialogOpen, setDialogOpen] = useState(false)
    const [edited, setEdited] = useState(false)
    const [ready, setReady] = useState(false)
    usePendingEffect((s) => { mode != 'add' && API.get(sourceUrl, s) }, setOriginalData, initialData)
    
    useEffect(() => { if(originalData.data) {
        setData(originalData.data) 
    }}, [originalData])
    useUpdateEffect(() => setCurrentMode(mode), [mode])

    useUpdateEffect(() => {
        if(ready) {
            setEdited(true)
        } else {
            setReady(true)
        }
    }, [data])

    const elementObj = model.load(data)

    const extraFieldsObject = ProtoSchema.load(Schema.object(extraFields))
    const formFields = elementObj.getObjectSchema().is('display').merge(extraFieldsObject).getLayout(1)


    const groups = {}
    formFields.forEach((row, x) => row.forEach((ele, i) => {
        const icon = icons[ele.name] ? icons[ele.name] : (currentMode == 'edit' || currentMode == 'add' ? Pencil : Tag)
        const groupId = ele._def.group ?? 0
        if(!groups.hasOwnProperty(groupId)) {
            groups[groupId] = []
        }
        groups[groupId].push({
            id: x+'_'+i,
            icon: icon, 
            i: i,
            x: x,
            ele: ele,
            data,
            setData,
            mode: currentMode,
            size: ele._def.size ?? 1,
            numColumns: numColumns,
        })
    }))

    const { tint } = useTint()

    return <Stack {...props}>
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
        <AsyncView forceLoad={currentMode == 'add'} waitForLoading={1000} spinnerSize={spinnerSize} loadingText={loadingText ?? "Loading " + objectId} top={loadingTop ?? -30} atom={originalData}>
            <XStack>
                <XStack f={1}>
                {title ?? <Dialog.Title><Text><Tinted><Text color="$color9">{capitalize(currentMode)}</Text></Tinted><Text color="$color11"> {capitalize(name)}</Text></Text></Dialog.Title>}
                </XStack>
                {(currentMode == 'view' || currentMode == 'edit') && <XStack pressStyle={{o:0.8}} onPress={async () => {
                    if(currentMode == 'edit' && edited) {
                        setDialogOpen(true)
                    } else {
                        setCurrentMode(currentMode=='view'?'edit':'view')
                    }
                }} cursor="pointer">
                    <Tinted>
                        {currentMode == 'view'?<Pencil color="var(--color8)" />:<X color="var(--color8)" />}
                    </Tinted>
                </XStack>}
            </XStack>
            <YStack width="100%" f={1} mt={"$7"} ai="center" jc="center">
                {error && (
                    <Notice>
                        <Paragraph>{getErrorMessage(error.error)}</Paragraph>
                    </Notice>
                )}
                
                {Object.keys(groups).map((k, i) => <YStack mt={i?"$5":"$0"} width={columnWidth*(numColumns)+30} f={1}>
                    <Grid spacing={columnMargin/2} data={groups[k]} card={GridElement} itemMinWidth={columnWidth} columns={numColumns} />
                </YStack>)}

                <YStack mt="$4" p="$2" pb="$5" width="100%" f={1} alignSelf="center">
                {(currentMode == 'add' || currentMode == 'edit') && <Tinted>
                        <Button f={1} onPress={async () => {
                            console.log('final data: ', data)
                            setLoading(true)
                            try {
                                await onSave(originalData.data, data)
                            } catch (e) {
                                setError(e)
                                console.log('e: ', e)
                            }
                            setLoading(false)
                        }}>
                            {loading ? <Spinner /> : currentMode == 'add' ? 'Create' : 'Save'}
                        </Button>
                    </Tinted>}
                </YStack> 
            </YStack>
        </AsyncView>
    </Stack>
}