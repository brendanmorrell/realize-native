export function isDefined<ValueType>(value: ValueType): value is Exclude<ValueType, undefined> {
  return value !== undefined
}
