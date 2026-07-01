import React from 'react'
import { DayPicker } from 'react-day-picker'
import { cn } from '../../lib/utils'

export function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('ui-calendar', className)}
      classNames={{
        months: 'ui-calendar__months',
        month: 'ui-calendar__month',
        nav: 'ui-calendar__nav',
        button_previous: 'ui-calendar__nav-button ui-calendar__nav-button--previous',
        button_next: 'ui-calendar__nav-button ui-calendar__nav-button--next',
        month_caption: 'ui-calendar__caption',
        caption_label: 'ui-calendar__caption-label',
        weekdays: 'ui-calendar__weekdays',
        weekday: 'ui-calendar__weekday',
        week: 'ui-calendar__week',
        day: 'ui-calendar__day',
        day_button: 'ui-calendar__day-button',
        today: 'ui-calendar__day--today',
        selected: 'ui-calendar__day--selected',
        outside: 'ui-calendar__day--outside',
        disabled: 'ui-calendar__day--disabled',
        hidden: 'ui-calendar__day--hidden',
        ...classNames,
      }}
      {...props}
    />
  )
}
