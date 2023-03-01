import isNil from 'lodash/isNil'

export function isNotNull<ValueType>(value: ValueType): value is Exclude<ValueType, null> {
  return !isNil(value)
}
