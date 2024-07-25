import { DatePicker } from './datepickers';
import { Tinted } from './Tinted'
import { SelectList } from './SelectList'
import { Filter, Check, X } from '@tamagui/lucide-icons'
import { XStack, Button, Popover, Text, Label, YStack, Checkbox } from '@my/ui'
import { useState } from 'react';
import { usePageParams } from '../next';
import { Chip } from 'protolib/components/Chip';

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

        if (def.filter == false) return

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
                <Label>{key}</Label>
                <DatePicker
                    selectedDates={value ? [new Date(value)] : []}
                    onDatesChange={([selectedDate]) => onFilter(selectedDate ? new Date(selectedDate).toISOString() : undefined)}
                />
            </>
        } else if (def?.typeName === 'ZodUnion') {
            const options = def.options?.map(option => option._def.value)
            return <>
                <Label>{key}</Label>
                <SelectList
                    value={value}
                    title={key}
                    elements={options}
                    setValue={(val) => onFilter(val)}
                />
            </>
        }
    }

    const queryFilters = Object.keys(query).filter(q => q.startsWith('filter'))

    return <Popover
        open={open}
        onOpenChange={setOpen}
        size="$5"
    >
        <Popover.Trigger>
            <Tinted>
                <Button onPress={() => setOpen(!open)} transparent circular icon={<Filter fillOpacity={0} color={'$color10'} />} />
            </Tinted>
        </Popover.Trigger>
        <Popover.Content
            backgroundColor={"$backgroundStrong"}
            borderWidth={1}
            borderColor="$borderColor"
            elevate
            mr={'$4'}
            maxWidth={"350px"}
        >
            <Popover.Arrow ml={'$4'} borderWidth={1} borderColor="$borderColor" />
            <YStack miw={'$20'} gap={'$2'}>
                <Text fontWeight="bold">Filters</Text>
                <Tinted key="filter" >
                    <XStack gap={'$2'} mt="$2" flexWrap='wrap'>
                        {
                            queryFilters.map((q, i) => <Chip color={"$color6"} text={q.replace('filter[', '').replace(']', '')} gap="$2" pl="$1" pr="$2" py="$1" textProps={{ fontSize: 14, color: "$color12" }}>
                                <Button onPress={() => removePush(q)} size="$1" circular={true}>
                                    <X size={12} color={"var(--color8)"}></X>
                                </Button>
                            </Chip>)
                        }
                    </XStack>
                </Tinted>
                <YStack overflow='scroll' overflowX='hidden' p="2px" maxHeight="300px">
                    {Object.keys(schema.shape).map((key) => {
                        const def = schema.shape[key]._def?.innerType?._def ?? schema.shape[key]._def
                        return <>
                            {getFilter(def, key)}
                        </>
                    })}
                </YStack>
                <XStack mt={'$4'} jc={'flex-end'} gap={'$3'} p={'$3'}>
                    <Tinted>
                        <Button onPress={onClear}>Clear</Button>
                    </Tinted>
                </XStack>
            </YStack>
        </Popover.Content>
    </Popover>
}