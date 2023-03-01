import { DateStr } from '../utility'
import { isValidDateObject } from './isValidDateObject'

export const isValidDateString = (date: any): date is DateStr => {
  const dateObj = new Date(date)
  return isValidDateObject(dateObj)
}
