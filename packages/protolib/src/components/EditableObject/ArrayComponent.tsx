import { Button, Stack, XStack } from "tamagui";
import { Pencil, Tags, Layers } from '@tamagui/lucide-icons';
import { Tinted } from '../Tinted';
import { DeleteButton, FormGroup, getDefaultValue, iconStyle } from ".";

export const ArrayComp = ({ ele, elementDef, icon, path, arrData, getElement, setFormData, data, setData, mode, customFields, URLTransform }) => {
    return <FormGroup ele={ele} title={' (' + arrData.length + ')'} icon={Layers} path={path}>
        <Stack>
            {arrData.map((d, i) => {
                return <XStack key={i} marginTop={i ? "$2" : "$0"} marginLeft="$1">
                    {elementDef.type._def.typeName != 'ZodObject' && <Tinted>
                        <XStack marginRight="$2" top={20}>
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
                    <DeleteButton mode={mode} onPress={() => {
                        arrData.splice(i, 1)
                        setFormData(ele.name, [...arrData])
                    }} />
                </XStack>
            })}
        </Stack>
        {(mode == 'edit' || mode == 'add') && <Button marginTop="$4" onPress={() => {
            const eleDef = ele._def.typeName == 'ZodLazy' ? ele._def.getter()._def : ele._def
            const defaultValue = eleDef.typeName == "ZodOptional" ? eleDef.innerType._def.type._def.typeName : eleDef.type._def.typeName
            setFormData(ele.name, [...arrData, getDefaultValue(elementDef.type._def.typeName)])
        }}>Add{ele._def.label ?? ele.name}</Button>}
    </FormGroup>
}