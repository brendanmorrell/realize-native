import { LocalDate } from '@js-joda/core'

export interface Range<T = number> {
  upper: T
  upperIsFinite: boolean
  upperInc: boolean
  lower: T
  lowerIsFinite: boolean
  lowerInc: boolean
  isRange: boolean
  isFullyUnbounded: boolean
}

const numericRangeRegex =
  /(?<lower_inc>[([])(?<lower_val>\d*(\s*\.\s*)?\d*|\.\s*\d+),(?<upper_val>\d*(\s*\.\s*)?\d*|\.\s*\d+)(?<upper_inc>[)\]])/

const isInclusive = (val: string) => ['[', ']'].includes(val.trim())

export function transformRange(input: string, orThrow: true): Range
export function transformRange(input?: string | null): Range | undefined
export function transformRange(input?: string | null, orThrow: boolean = false): Range | undefined {
  const match = input?.match(numericRangeRegex)
  if (!match) {
    if (orThrow) {
      throw new Error(`Invalid input ${input} for range`)
    }
    return
  }

  const { lower_val, lower_inc, upper_val, upper_inc } = match.groups ?? {}
  let lower, upper: number

  if (!lower_val ?? lower_val.length === 0) {
    lower = -Infinity
  } else {
    lower = Number(lower_val)
  }

  if (!upper_val ?? upper_val.length === 0) {
    upper = Infinity
  } else {
    upper = Number(upper_val)
  }

  const lowerIsFinite = Number.isFinite(lower)
  const upperIsFinite = Number.isFinite(upper)
  return {
    lower,
    lowerIsFinite,
    lowerInc: isInclusive(lower_inc),
    upper,
    upperInc: isInclusive(upper_inc),
    upperIsFinite,
    isRange: lowerIsFinite && upperIsFinite,
    isFullyUnbounded: !lowerIsFinite && !upperIsFinite,
  }
}

const genericRangeRegex = /(?<lower_inc>[([])(?<lower_val>[^,]*),(?<upper_val>[^\])]*)(?<upper_inc>[)\]])/i

export function transformDateRange(input: string, orThrow: true): Range<LocalDate | undefined>
export function transformDateRange(input?: string | null): Range<LocalDate | undefined> | undefined
export function transformDateRange(
  input?: string | null,
  orThrow: boolean = false
): Range<LocalDate | undefined> | undefined {
  const match = input?.match(genericRangeRegex)
  if (!match) {
    if (orThrow) {
      throw new Error(`Invalid input ${input} for range`)
    }
    return
  }

  const { lower_val, lower_inc, upper_val, upper_inc } = match.groups ?? {}
  let lower, upper: LocalDate | undefined

  if (lower_val && lower_val.length) {
    lower = LocalDate.parse(lower_val)
  }

  if (upper_val && upper_val.length) {
    upper = LocalDate.parse(upper_val)
  }

  const lowerIsFinite = !!lower
  const upperIsFinite = !!upper
  return {
    lower,
    lowerIsFinite,
    lowerInc: isInclusive(lower_inc),
    upper,
    upperInc: isInclusive(upper_inc),
    upperIsFinite,
    isRange: lowerIsFinite && upperIsFinite,
    isFullyUnbounded: !lowerIsFinite && !upperIsFinite,
  }
}
