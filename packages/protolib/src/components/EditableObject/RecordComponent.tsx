import { useContext, useEffect, useRef, useState } from "react";
import { Button, Input, Stack, XStack, YStack } from "tamagui";
import { List } from '@tamagui/lucide-icons';
import { AlertDialog } from '../AlertDialog'
import { DeleteButton, FormGroup, OpenedSectionsContext, getDefaultValue } from ".";
import { getElement } from "./Element";

export const RecordComp = ({ ele, inArray, recordData, elementDef, icon, data, setData, mode, customFields, path, setFormData, URLTransform }) => {
    const [menuOpened, setMenuOpened] = useState(false)
    const [name, setName] = useState("")
    const inputRef = useRef(null);
    const [opened, setOpened] = useContext(OpenedSectionsContext);

    useEffect(() => {
        if (menuOpened) {
            const timer = setTimeout(() => {
                inputRef.current?.focus();
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [menuOpened]);

    function updatePathArray(paths, newPath) {
        const basePath = newPath.substring(0, newPath.lastIndexOf('/') + 1);
        const filteredPaths = paths.filter(path => !path.startsWith(basePath) || path === basePath);
        filteredPaths.push(newPath);
        return filteredPaths;
    }

    const handleAccept = async () => {
        const val = getDefaultValue(ele._def.valueType._def.typeName);
        const id = [...path, ele.name, name].join("/")
        setMenuOpened(false);
        setName("");
        setOpened(updatePathArray(opened, id))
        setFormData(ele.name, { ...recordData, [name]: val });
    };

    const handleDelete = async (keyToDelete) => {
        delete recordData[keyToDelete]
        setFormData(ele.name, { ...recordData })
    };

    return <FormGroup ele={ele} title={inArray ? ' #' + (ele.name + 1) : '...'} icon={List} path={path}>
        <Stack>
            {recordData ? Object.keys(recordData).map((key, i) => {
                return <XStack key={i} marginTop={i ? "$2" : "$0"} marginLeft="$1">
                    {/* {elementDef.type._def.typeName != 'ZodObject' && <Tinted><XStack marginRight="$2" top={20}>{mode == 'edit' || mode == 'add' ? <Pencil {...iconStyle} /> : <Tags {...iconStyle} />}</XStack></Tinted>} */}
                    {getElement({
                        ele: { ...elementDef.valueType, name: key },
                        icon: icon,
                        i: 0,
                        x: 0,
                        data: data,
                        setData: setData,
                        mode: mode,
                        customFields: customFields,
                        path: [...path, ele.name],
                        URLTransform
                    }
                    )}
                    <DeleteButton key={key} onPress={() => handleDelete(key)} mode={mode} />
                </XStack>
            }) : null}
        </Stack>
        <AlertDialog
            acceptCaption="Add field"
            setOpen={setMenuOpened}
            open={menuOpened}
            onAccept={handleAccept}
            title={'Add new field'}
            description={""}
        >
            <YStack flex={1} id="eo-add-field-input" alignItems="center" marginTop="$6" justifyContent="center">
                <Input
                    flex={1}
                    value={name}
                    onChangeText={(text) => setName(text)}
                    textAlign='center'
                    id="name"
                    placeholder='Field name...'
                    ref={inputRef}
                    onKeyPress={(event: any) => {
                        if (event.key === 'Enter') {
                            handleAccept();
                        }
                    }}
                />
            </YStack>
        </AlertDialog>
        {(mode == 'edit' || mode == 'add') && <Button id={"eo-obj-comp-btn"} marginTop="$5" onPress={() => { setMenuOpened(true) }}> Add field</Button>}
    </FormGroup>
}