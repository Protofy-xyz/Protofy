import { Button, Stack, XStack } from "tamagui";
import { Pencil, X, Tags, Layers } from '@tamagui/lucide-icons';
import { Tinted } from 'protolib'
import { FormGroup, getDefaultValue, iconStyle } from ".";

export const ArrayComp = ({ ele, elementDef, icon, path, arrData, getElement, setFormData, data, setData, mode, customFields, URLTransform}) => {
    return <FormGroup ele={ele} title={' (' + arrData.length + ')'} icon={Layers} path={path}>
        <Stack>
            {arrData.map((d, i) => {
                return <XStack key={i} mt={i ? "$2" : "$0"} ml="$1">
                    {elementDef.type._def.typeName != 'ZodObject' && <Tinted>
                        <XStack mr="$2" top={20}>
                            {mode == 'edit' || mode == 'add' ? <Pencil {...iconStyle} /> : <Tags {...iconStyle} />}
                        </XStack>
                    </Tinted>}
                    {getElement({
                        ele: { ...elementDef.type._def, _def: elementDef.type._def, name: i },
                        icon: icon,
                        i: 0,
                        x: 0,
                        data: data,
                        setData: setData,
                        mode: mode,
                        customFields: customFields,
                        path: [...path, ele.name],
                        inArray: true,
                        arrayName: ele.name,
                        URLTransform: URLTransform
                    })}
                    {(mode == 'edit' || mode == 'add') && <Stack ml={"$2"}
                        top={13} br={"$5"} p={"$2"}
                        als="flex-start" cursor='pointer'
                        {...elementDef.type._def.typeName != 'ZodObject' ? {} : {
                            position: "absolute",
                            right: '0',
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