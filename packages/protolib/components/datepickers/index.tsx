import { useEffect, useState } from "react"
import { DatePicker as DPicker, DatePickerInput } from "./dateParts"
import { DatePickerBody } from "./datePicker"
import { DatePickerBody as DatePickerRangeBody } from './rangePicker'
import { DatePickerBody as DatePickerMultipleBody } from './multiSelectPicker'
import { DatePickerBody as DatePickerYearBody } from './yearPicker'
import { DatePickerBody as DatePickerMonthBody } from './monthPicker'
import { Tinted } from "../Tinted"

type DatePickerProps = {
  onDatesChange?: Function,
  onOffsetChange?: Function,
  selectedDates?: Date[],
  offsetDate?: Date,
  mode?: 'single' | 'multiple' | 'range' | 'month' | 'year',
  config?: any
  placeholder?: string
}

// the modes 'month' and 'year' use offsetDate and onOffsetChange
// and 'single', 'multiple', 'range' use selectedDates and onDatesChange

export function DatePicker({ onDatesChange, selectedDates, mode = 'single', config = {}, placeholder, onOffsetChange, offsetDate }: DatePickerProps) {

  const [selected, onChange] = useState<Date[]>([])
  const [offset, setOffset] = useState<Date>()

  const [open, setOpen] = useState(false)

  var dates = selectedDates ?? selected
  var offsetValue = offsetDate ?? offset

  var onValueChange = (d) => {
    if (onDatesChange) onDatesChange(d)
    onChange(d)
  }

  var onOffChange = (d) => {
    if (onOffsetChange) onOffsetChange(d)
    setOffset(d)
  }

  const data = {
    "single": {
      "placeholder": "Select Date",
      "value": dates[0]?.toDateString() || '',
      "body": <DatePickerBody />
    },
    "multiple": {
      "placeholder": "Start date, End date",
      "value": `${dates[0]?.toDateString() || ''}${dates[0] && dates[1]
        ? ' , '
        : dates[0]
          ? ' , end date'
          : ''
        }${dates[1]?.toDateString() || ''}`,
      "body": <DatePickerMultipleBody />
    },
    "range": {
      "placeholder": "Start date - End date",
      "value": `${dates[0]?.toDateString() || ''}${dates[0] && dates[1] ? ' - ' : ''}${dates[1]?.toDateString() || ''}`,
      "body": <DatePickerRangeBody />
    },
    "year": {
      "placeholder": "Select year",
      "value": offsetValue?.toLocaleDateString('en-US', {
        year: 'numeric',
      }) || ''
      ,
      "body": <DatePickerYearBody />
    },
    "month": {
      "placeholder": "Select Month",
      "value": offsetValue?.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
      }) || ''
      ,
      "body": <DatePickerMonthBody />
    },
  }

  if (['single', 'multiple', 'range'].includes(mode)) {

    useEffect(() => {
      if (mode == 'single' && dates.length) {
        setOpen(false)
      } else if (dates.length === 2) {
        setOpen(false)
      }
    }, [dates])

  } else {

    useEffect(() => {
      if (['month', 'year'].includes(mode) && dates.length) {
        setOpen(false)
      } else if (dates.length === 2) {
        setOpen(false)
      }
    }, [offsetValue])

  }

  return (
    <DPicker
      open={open}
      onOpenChange={setOpen}
      config={{
        selectedDates: dates,
        onDatesChange: onValueChange,
        onOffsetChange: onOffChange,
        offsetDate: offsetValue,
        calendar: {
          offsets: [-1, 1],
        },
        ...config,
        dates: {
          mode: ['year', 'month'].includes(mode) ? 'single' : mode,
          toggle: true,
          ...config?.dates
        },
      }}
    >
      <DPicker.Trigger asChild>
        <DatePickerInput
          placeholder={placeholder ?? data[mode].placeholder}
          value={data[mode].value}
          onReset={() => {
            onValueChange([])
            onOffChange(undefined)
          }}
          onButtonPress={() => setOpen(true)}
        />
      </DPicker.Trigger>
      <DPicker.Content>
        <DPicker.Content.Arrow />
        {data[mode].body}
      </DPicker.Content>
    </DPicker>
  )
}