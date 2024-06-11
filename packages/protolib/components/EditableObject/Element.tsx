import { Input, Stack, Switch, SizableText } from "tamagui";
import { API, Tinted, SelectList, SimpleSlider, DatePicker } from 'protolib'
import { InputColor } from "../InputColor";
import { SearchAndSelect } from "../SearchAndSelect";
import { FormElement } from ".";
import { ObjectComp } from "./ObjectComponent";
import { ArrayComp } from "./ArrayComponent";
import { UnionsArrayComp } from "./UnionsArrayComponent";
import { RecordComp } from "./RecordComponent";
import { FilePicker } from "../FilePicker";

export const getElement = ({ ele, icon, i, x, data, setData, mode, customFields = {}, path = [], inArray = false, arrayName = "" }) => {
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
                        f={1}
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
        if (ele._def.linkTo) {
            return <FormElement ele={ele} icon={icon} i={i} inArray={inArray}>
                {mode != 'preview' && <Stack f={1} t={"$-2"}>
                    <SearchAndSelect
                        bc="$backgroundTransparent"
                        // options={["John", "Doe", "Jane", "Smith"]}
                        getDisplayField={ele._def.getDisplayField}
                        options={async (search) => {
                            const url = ele._def.linkTo(search)
                            const result = await API.get(url)
                            return result.data?.items ?? []
                        }}
                        onSelectItem={(item) => setFormData(ele.name, item)}
                        selectedItem={getFormData(ele.name)}
                        f={1}
                        placeholder={ele._def.hint}
                    /></Stack>}

                {mode == 'preview' && <SizableText ml="$3.5" mt={"$2.5"} mb="$2">{ele._def.getDisplayField && ele._def.getDisplayField(getFormData(ele.name))}</SizableText>}

            </FormElement>
        } else {
            return <ObjectComp
                ele={ele}
                elementDef={elementDef}
                icon={icon}
                path={path}
                data={data}
                setData={setData}
                mode={mode}
                customFields={customFields}
                inArray={inArray}
                arrayName={arrayName}
                getFormData={getFormData}></ObjectComp>
        }


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

    let generatedOptions = ''

    // ---- MODIFIERS ---- 
    // generateOptions
    if (typeof ele._def.generateOptions === 'function') {
        generatedOptions = ele._def.generateOptions()
        if (!getFormData(ele.name)) {
            setFormData(ele.name, generatedOptions)
        }
    }

    if (elementType == "ZodDate" && elementDef?.hasOwnProperty('datePicker')) {
        var dateMode = elementDef.datePicker
        var isStringDateType = ['year', 'month'].includes(dateMode)

        return <FormElement ele={ele} icon={icon} i={i} inArray={inArray}>
            <Stack f={1}>
                {isStringDateType
                    ? <DatePicker mode={dateMode} offsetDate={getFormData(ele.name) ? new Date(getFormData(ele.name)) : null} onOffsetChange={isStringDateType ? d => setFormData(ele.name, d.toISOString()) : null} />
                    : <DatePicker mode={dateMode} selectedDates={getFormData(ele.name) ? [new Date(getFormData(ele.name))] : null} onDatesChange={!isStringDateType ? d => setFormData(ele.name, d[0]?.toISOString()) : null} />
                }
            </Stack>
        </FormElement>
    }

    if (elementType == "ZodString" && elementDef.color) {
        return <FormElement ele={ele} icon={icon} i={i} inArray={inArray}>
            <Stack f={1}>
                <InputColor color={getFormData(ele.name)} onChange={color => setFormData(ele.name, color.hex)} />
            </Stack>
        </FormElement>
    }

    if (elementType == "ZodString" && elementDef.file) {
        const extensions = elementDef.extensions
        const fileFilter = f => {
            const isValidExtension = extensions.some(ext => f.name.endsWith(ext) || ext == "*")
            return f.isDir || isValidExtension
        }
        return <FormElement ele={ele} icon={icon} i={i} inArray={inArray}>
            <Stack f={1}>
                <FilePicker
                    fileFilter={fileFilter}
                    file={getFormData(ele.name)}
                    initialPath={elementDef.initialPath}
                    onFileChange={filePath => setFormData(ele.name, filePath)}
                />
            </Stack>
        </FormElement>
    }

    return <FormElement ele={ele} icon={icon} i={i} inArray={inArray}>
        <Stack f={1}>
            <Input
                id={"editable-object-input-" + ele?.name}
                {...(mode != 'edit' && mode != 'add' ? { bw: 0, forceStyle: "hover" } : {})}
                focusStyle={{ outlineWidth: 1 }}
                disabled={(mode == 'view' || mode == 'preview' || (mode == 'edit' && ele._def.static) || (ele._def.dependsOn && !data[ele._def.dependsOn]))}
                secureTextEntry={ele._def.secret}
                value={generatedOptions && !getFormData(ele.name) ? generatedOptions : getFormData(ele.name)}
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