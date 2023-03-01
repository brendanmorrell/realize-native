import { isRealNumber } from './isRealNumber'

export function typedNumbersFilter(input?: any): input is number {
  return isRealNumber(input)
}
