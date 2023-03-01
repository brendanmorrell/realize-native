import { endOfWeek, format, startOfWeek } from 'date-fns'
import { threeCharacterMonthFormatStr, singleDayFormatStr } from '../../common/constants/timeFormatStrings'
import { isValidDateObject } from '../../typescript/guards/isValidDateObject'
import { isValidDateString } from '../../typescript/guards/isValidDateString'
import { Falsy } from '../../typescript/utility'

type Params = {
  startDate: Date | string | Falsy
  options?: {
    showMonth: boolean
    labelSeparator: string
    formatForMonth: string
    formatForDay: string
  }
}

export const getWeekDaysRangeLabelString = ({
  startDate,
  options = {
    showMonth: true,
    labelSeparator: '-',
    formatForMonth: threeCharacterMonthFormatStr,
    formatForDay: singleDayFormatStr,
  },
}: Params) => {
  const dateObject = isValidDateObject(startDate) ? startDate : isValidDateString(startDate) ? new Date(startDate) : ''
  if (!dateObject) return ''

  const { showMonth, labelSeparator, formatForMonth, formatForDay } = options

  const start = format(startOfWeek(dateObject), formatForDay)
  const end = format(endOfWeek(dateObject), formatForDay)

  if (!showMonth) return `${start} ${labelSeparator} ${end}`

  const month = format(dateObject, formatForMonth)
  return `${month} ${start} ${labelSeparator} ${end}`
}
