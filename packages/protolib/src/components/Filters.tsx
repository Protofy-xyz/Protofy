import { DatePicker } from './datepickers';
import { Tinted } from './Tinted'
import { SelectList } from './SelectList'
import { Filter, Check, X } from '@tamagui/lucide-icons'
import { XStack, Button, Popover, Text, Label, YStack, Checkbox, Tooltip } from '@my/ui'
import { useState } from 'react';
import { usePageParams } from '../next';
import { Chip } from './Chip';

type FiltersType = {
    model: any,
    state: any,
    customFilters?: any
    extraFilters?: any[]
}

export const QueryFilters = ({ state, extraFilters }) => {
    const { removePush, query } = usePageParams(state)

    const queryKeys = Object.keys(query)
    const extraFiltersKeys = extraFilters?.map((extraFilter) => extraFilter.queryParam)
    const queryFilters = queryKeys.filter(q => q.startsWith('filter') || extraFiltersKeys?.includes(q))

    return <XStack gap="$2" mt="$2" flexWrap='wrap' f={1}>
        {
            queryFilters.map((q, i) => <Tooltip>
                <Tooltip.Trigger cursor='pointer' >
                    <Chip color={"$color6"} text={q.replace('filter[', '').replace(']', '')} textProps={{ fontWeight: '600', fontSize: 12 }} gap="$2" pl="$1" pr="$3" py="$1">
                <Button onPress={() => removePush(q)} size="$1" circular={true}>
                    <X size={12} color={"var(--color8)"}></X>
                </Button>
                    </Chip>
                </Tooltip.Trigger>
                <Tooltip.Content
                    enterStyle={{ x: 0, y: -5, opacity: 0, scale: 0.9 }}
                    exitStyle={{ x: 0, y: -5, opacity: 0, scale: 0.9 }}
                    scale={1}
                    backgroundColor={"$color9"}
                    x={0}
                    y={5}
                    opacity={1}
                    zIndex={9999999999}
                    animation={[
                        'quick',
                        {
                            opacity: {
                                overshootClamping: true,
                            },
                        },
                    ]}
                >
                    <Text fontSize={12} color={"white"}>{query[q]}</Text>
                </Tooltip.Content>
            </Tooltip>
            )
        }
    </XStack>
}


export const Filters = ({ model, state, customFilters, extraFilters }: FiltersType) => {

    const [open, setOpen] = useState(false)
    const { push, removePush, query } = usePageParams(state)
    const schema = model.getObjectSchema()

    const onClear = () => {
        removePush(Object.keys(query).filter(q => q.startsWith('filter')))
    }

    const getExtraFilter = (extraFilter) => {
        const key = extraFilter.queryParam
        const changesFilterExtra = (value) => {
            value !== undefined
                ? push(key, value)
                : removePush(key)
        }
        var currentValue: any = query[key]
        return <>
            {!extraFilter.hideLabel && <Label>{extraFilter.label ?? key}</Label>}
            {
                extraFilter.component(currentValue, changesFilterExtra)
            }
        </>
    }

    const getFilter = (def, key) => {

        var value: any = query[`filter[${key}]`]

        if (def?.typeName === 'ZodBoolean') {
            value = value == "true"
        }

        const onFilter = (value) => {
            value !== undefined
                ? push(`filter[${key}]`, value)
                : removePush(`filter[${key}]`)
        }

        if (def.filter == false) return

        const customFilter = customFilters[key]

        if (customFilters && customFilter && customFilter.component) {
            return <>
                {!customFilter.hideLabel && <Label>{customFilter.label ?? key}</Label>}
                {customFilter.component(value, onFilter)}
            </>
        }

        if (def?.typeName === 'ZodBoolean') {
            return <>
                <Label>{key}</Label>
                <Checkbox
                    checked={value}
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
                        <QueryFilters state={state} extraFilters={extraFilters} />
                    </XStack>
                </Tinted>
                <YStack overflow='scroll' overflowX='hidden' p="2px" maxHeight="300px">
                    {Object.keys(schema.shape).map((key) => {
                        const def = schema.shape[key]._def?.innerType?._def ?? schema.shape[key]._def
                        return <>
                            {getFilter(def, key)}
                        </>
                    })}
                    {
                        extraFilters?.map((extraFilter) => {
                            if (!extraFilter.queryParam || !extraFilter.component) return
                            return <>
                                {getExtraFilter(extraFilter)}
                            </>
                        })
                    }
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