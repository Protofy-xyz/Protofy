import { DatePicker } from './datepickers';
import { Tinted } from './Tinted'
import { SelectList } from './SelectList'
import { Filter, Check } from '@tamagui/lucide-icons'
import { XStack, Button, Popover, H4, Label, YStack, Checkbox } from '@my/ui'
import { useState } from 'react';
import { usePageParams } from '../next';

type FiltersType = {
    model: any
    state: any
}

export const Filters = ({ model, state }: FiltersType) => {

    const [open, setOpen] = useState(false)
    const { push, removePush, query } = usePageParams(state)
    const schema = model.getObjectSchema()

    const onClear = () => {
        removePush(Object.keys(query).filter(q => q.startsWith('filter')))
    }

    const getFilter = (def, key) => {

        const value = query[`filter[${key}]`]

        const onFilter = (value) => {
            value !== undefined
                ? push(`filter[${key}]`, value)
                : removePush(`filter[${key}]`)
        }

        if (!def.filter) return

        if (def?.typeName === 'ZodBoolean') {
            return <>
                <Label>{key}</Label>
                <Checkbox
                    checked={value == "true"}
                    onCheckedChange={(val) => onFilter(val)}
                >
                    <Checkbox.Indicator>
                        <Check></Check>
                    </Checkbox.Indicator>
                </Checkbox>
            </>
        } else if (def?.typeName === 'ZodDate') {
            return <>
                <Label >{key}</Label>
                <DatePicker
                    selectedDates={value ? [new Date(value)] : []}
                    onDatesChange={([selectedDate]) => onFilter(selectedDate ? new Date(selectedDate).toISOString() : undefined)}
                />
            </>
        } else if (def?.typeName === 'ZodUnion') {
            const options = def.options?.map(option => option._def.value)
            return <>
                <Label >{key}</Label>
                <SelectList
                    value={value}
                    title={key}
                    elements={options}
                    setValue={(val) => onFilter(val)}
                />
            </>
        }
    }

    return < Tinted key="filter" >
        <Popover
            open={open}
            onOpenChange={setOpen}
            size="$5"
        >
            <Popover.Trigger>
                <Button onPress={() => setOpen(!open)} transparent circular icon={<Filter fillOpacity={0} color={'$color9'} />} />
            </Popover.Trigger>
            <Popover.Content
                borderWidth={1}
                borderColor="$borderColor"
                elevate
                mr={'$4'}
            >
                <Popover.Arrow ml={'$4'} borderWidth={1} borderColor="$borderColor" />
                <YStack miw={'$20'} gap={'$2'}>
                    <H4>Filters</H4>
                    <YStack overflow='scroll' p="2px" maxHeight="400px">
                        {Object.keys(schema.shape).map((key) => {
                            const def = schema.shape[key]._def?.innerType?._def ?? schema.shape[key]._def
                            return <>
                                {getFilter(def, key)}
                            </>
                        })}
                    </YStack>
                    <XStack mt={'$4'} jc={'flex-end'} gap={'$3'} p={'$3'}>
                        <Tinted tint={'gray'}>
                            <Button onPress={onClear}>Clear</Button>
                        </Tinted>
                    </XStack>
                </YStack>
            </Popover.Content>
        </Popover>
    </Tinted >
}