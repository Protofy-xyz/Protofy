import {
  DatePickerProvider as _DatePickerProvider,
  useDatePickerContext,
  DPDay
} from '@rehookify/datepicker'
import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'
import { useEffect, useMemo, useState } from 'react'
import type { GetProps } from 'tamagui'
import { Button, H3, Separator, View } from 'tamagui'
import {
  DatePicker,
  DatePickerInput,
  HeaderTypeProvider,
  MonthPicker,
  SizableText,
  YearPicker,
  YearRangeSlider,
  swapOnClick,
  useHeaderType,
} from './dateParts'
import { Platform } from 'react-native'

const RANGE_STYLE: { [key: string]: GetProps<typeof View> } = {
  'in-range': {
    ...(Platform.OS === 'web' ? { borderStyle: 'dashed' } : {}),
    backgroundColor: '$background',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderRadius: 0,
  },
  'range-start': {
    borderColor: '$gray8',
    borderWidth: 1,
    borderStyle: 'solid',
    borderLeftWidth: 1,
    borderRightWidth: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  'range-end': {
    borderColor: '$gray8',
    borderWidth: 1,
    borderStyle: 'solid',
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  'range-start range-end': {
    borderWidth: 1,
    borderStyle: 'solid',
  },
  'will-be-in-range': {
    borderColor: '$gray8',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderRadius: 0,
  },
  'will-be-range-start': {
    borderColor: '$gray8',
    borderWidth: 1,
    borderStyle: 'solid',
    borderLeftWidth: 1,
    borderRightWidth: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  'will-be-range-end': {
    borderColor: '$gray8',
    borderWidth: 1,
    borderStyle: 'solid',
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  '': {},
}

export function Calendar({
  calenderIndex = 0,
  order,
}: {
  calenderIndex?: number
  order?: 'first' | 'last'
}) {
  const { setHeader } = useHeaderType()
  const {
    data: { calendars, weekDays },
    propGetters: { dayButton, subtractOffset },
  } = useDatePickerContext()

  const { days, year, month } = calendars[calenderIndex]

  // divide days array into sub arrays that each has 7 days, for better stylings
  const subDays = useMemo(
    () =>
      days.reduce((acc, day, i) => {
        if (i % 7 === 0) {
          acc.push([])
        }
        acc[acc.length - 1].push(day)
        return acc
      }, [] as DPDay[][]),
    [days]
  )

  return (
    <View flexDirection="column" gap="$4">
      <View
        flexDirection="row"
        minWidth="100%"
        height={50}
        alignItems="center"
        justifyContent="space-between"
      >
        {order === 'first' ? (
          <Button circular {...swapOnClick(subtractOffset({ months: 1 }))}>
            <ChevronLeft fillOpacity={0} />
          </Button>
        ) : (
          <View />
        )}
        <View flexDirection="column" height={50} alignItems="center">
          {/* @ts-ignore */}
          <SizableText onPress={() => setHeader('year')} selectable tabIndex={0} size="$4" cursor="pointer" color="$color11" hoverStyle={{ color: '$color12' }}> {year} </SizableText>
          {/* @ts-ignore */}
          <SizableText onPress={() => setHeader('month')} selectable tabIndex={0} size="$6" cursor="pointer" color="$color11" hoverStyle={{ color: '$color12' }}> {month} </SizableText>
        </View>
        {Platform.select({
          web:
            order === 'last' ? (
              <Button circular {...swapOnClick(subtractOffset({ months: -1 }))}>
                <ChevronRight fillOpacity={0} />
              </Button>
            ) : (
              <View />
            ),
          native: (
            <Button circular size="$4" {...swapOnClick(subtractOffset({ months: -1 }))}>
              <Button.Icon scaleIcon={1.5}>
                <ChevronRight />
              </Button.Icon>
            </Button>
          ),
        })}
      </View>
      <View
        //@ts-ignore
        animation="medium"
        enterStyle={{
          opacity: 0,
        }}
        gap="$3"
      >
        <View flexDirection="row" gap="$1">
          {weekDays.map((day) => (
            // @ts-ignore
            <SizableText theme="alt1" key={day} textAlign="center" width={45} size="$6"> {day} </SizableText>
          ))}
        </View>
        <View flexDirection="column" gap="$1" flexWrap="wrap">
          {subDays.map((days) => {
            return (
              <View flexDirection="row" key={days[0].$date.toString()} gap="$1">
                {days.map((d) => {
                  return (
                    <Button
                      key={d.$date.toString()}
                      chromeless
                      circular
                      padding={0}
                      width={45}
                      {...swapOnClick(dayButton(d))}
                      backgroundColor={
                        d.selected && d.inCurrentMonth ? '$background' : 'transparent'
                      }
                      themeInverse={d.selected}
                      {...RANGE_STYLE[d.range]}
                      data-range={d.range}
                      disabled={!d.inCurrentMonth}
                    >
                      <Button.Text
                        color={
                          d.selected ? '$color' : d.inCurrentMonth ? '$gray11' : '$gray6'
                        }
                      >
                        {d.day}
                      </Button.Text>
                    </Button>
                  )
                })}
              </View>
            )
          })}
        </View>
      </View>
    </View>
  )
}

export function DatePickerBody() {
  const [header, setHeader] = useState<'month' | 'year' | 'day'>('day')

  const {
    data: { calendars, years },
    propGetters: { subtractOffset, previousYearsButton, nextYearsButton },
  } = useDatePickerContext()

  return (
    <HeaderTypeProvider type={header} setHeader={setHeader}>
      <View flexDirection="row" gap="$3">
        {header === 'day' && (
          <>
            <Calendar order="first" calenderIndex={1} />
            <Separator vertical />
            <Calendar order="last" calenderIndex={0} />
          </>
        )}
        {header === 'year' && (
          <View alignItems="center" gap="$2">
            <YearRangeSlider />
            <YearPicker onChange={() => setHeader('day')} />
          </View>
        )}
        {header === 'month' && (
          <View gap="$4">
            <H3 size="$7" alignSelf="center">
              Select a month
            </H3>
            <MonthPicker
              onChange={() => {
                setHeader('day')
              }}
            />
          </View>
        )}
      </View>
    </HeaderTypeProvider>
  )
}

/** ------ EXAMPLE ------ */
export function RangePicker() {
  const now = new Date()
  const [selectedDates, onDatesChange] = useState<Date[]>([])
  const [offsetDate, onOffsetChange] = useState<Date>(now)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (selectedDates.length === 2) {
      setOpen(false)
    }
  }, [selectedDates])

  // uncomment this to limit the range of dates
  //   const M = now.getMonth()
  //   const Y = now.getFullYear()
  //   const D = now.getDate()

  return (
    <DatePicker
      open={open}
      onOpenChange={setOpen}
      config={{
        selectedDates,
        onDatesChange,
        offsetDate,
        onOffsetChange,
        dates: {
          mode: 'range',
          // limit years to 2 years before and after current year
          //   minDate: new Date(Y, M - 2, 1),
          //   maxDate: new Date(Y, M + 2, 0),
        },
        calendar: {
          offsets: [-1, 1],
        },
      }}
    >
      <DatePicker.Trigger asChild>
        <DatePickerInput
          // @ts-ignore
          value={`${selectedDates[0]?.toDateString() || ''}${selectedDates[0] && selectedDates[1] ? ' - ' : ''
            }${selectedDates[1]?.toDateString() || ''}`}
          // @ts-ignore
          placeholder="Start date - End date"
          onReset={() => {
            onDatesChange([])
          }}
          onButtonPress={() => setOpen(true)}
          // @ts-ignore
          width={260}
        />
      </DatePicker.Trigger>
      {/* @ts-ignore */}
      <DatePicker.Content><DatePicker.Content.Arrow /><DatePickerBody /></DatePicker.Content>
    </DatePicker>
  )
}


