import { Stack } from "tamagui";
import { FormGroup } from ".";
import { getElement } from "./Element";
import { List } from '@tamagui/lucide-icons';

export const ObjectComp = ({ ele, elementDef, icon, path, data, setData, mode, customFields, inArray, arrayName, getFormData, URLTransform }) => {
    return <FormGroup simple={true} ele={ele} title={inArray ? (ele._def.keyName ? getFormData(ele._def.keyName, [...path, ele.name]) : arrayName + ' #' + (ele.name + 1)) : ele.name} icon={List} path={path}>
        <Stack>
            {/* <Stack alignSelf="flex-start" backgroundColor={"$background"} px="$2" left={10} pos="absolute" top={-13}><SizableText >{typeof ele.name === "number"? '': ele.name}</SizableText></Stack> */}
            {Object.keys(elementDef.shape()).map((s, i) => {
                const shape = elementDef.shape();
                return <Stack key={i} mt={i ? "$5" : "$0"}>{getElement({
                    ele: { ...shape[s], name: s },
                    icon: icon,
                    i: 0,
                    x: 0,
                    data: data,
                    setData: setData,
                    mode: mode,
                    customFields: customFields,
                    path: [...path, ele.name],
                    URLTransform
                })}</Stack>
            })}
        </Stack>
    </FormGroup>
}