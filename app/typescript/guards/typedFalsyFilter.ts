import { Falsy } from '../utility'

export function typedFalsyFilter<ValueType>(value: ValueType): value is Exclude<ValueType, Falsy> {
  return Boolean(value)
}
