import { DateStr } from '../utility'
import { isValidDateObject } from './isValidDateObject'
import { isValidDateString } from './isValidDateString'

export const isValidDateOfAnyType = (date: any): date is Date | DateStr => {
  return isValidDateObject(date) || isValidDateString(date)
}
