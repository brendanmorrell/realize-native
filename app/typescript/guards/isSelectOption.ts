export type BaseSelectOption = {
  label: string
  value: string
}

// until we find out how toc onditionally change whether our helpers ike useReactSelectProps are functioning as nullable
// vs non-nullable selects (which is determined by whether isClearable is true), we will need to set all of our helpers
// to not assume this, and use the NullableSelectOption type and the isNullableSelectOption guard. then, the consuming
// components are responsible for using the isNonNullableSelectOption guard on the result to make sure that whenever the
// values change, to only operate on the changed result if the option is not null, which it always will be so long as
// isClearable is not set to true
export type NonNullableSelectOption<T = BaseSelectOption> = BaseSelectOption & T

export function isNonNullableSelectOption<T>(v: any): v is NonNullableSelectOption<T> {
  return v && 'value' in v && v.value !== undefined
}

export type NullableSelectOption<T = BaseSelectOption> = (BaseSelectOption & T) | null
export function isNullableSelectOption<T>(v: any): v is NullableSelectOption<T> {
  return (v && 'value' in v && v.value !== undefined) || v === null
}
