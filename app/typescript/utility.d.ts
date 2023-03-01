import { Request } from 'express'
import { NextPageContext } from 'next'
import type { Dispatch, SetStateAction } from 'react'

export type Maybe<T> = T | Falsy

export type ObjectOf<T, U = string> = { [key in U]: T }
export type Falsy = false | null | undefined | '' | 0
export type Nullish = undefined | null
export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never
export type ValueOf<T> = T[keyof T]
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]> | null
}

export type NextExpressPageContext = Omit<NextPageContext, 'req'> & { req?: Request }

export type UntypedObject = {
  [x: string | number | symbol]: any
}

export type Nullable<D> = D | undefined | null
export type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]

export type StateSetter<T> = Dispatch<SetStateAction<T>>
export type Children = React.PropsWithChildren<{}>['children']

// TODO go over this one (FixedLengthArray). it works, but i would like an understanding of it
type ArrayLengthMutationKeys = 'splice' | 'push' | 'pop' | 'shift' | 'unshift' | number
type ArrayItems<T extends Array<any>> = T extends Array<infer TItems> ? TItems : never
export type FixedLengthArray<T extends any[]> = Pick<T, Exclude<keyof T, ArrayLengthMutationKeys>> & {
  [Symbol.iterator]: () => IterableIterator<ArrayItems<T>>
}

// Nominal type for DateStr.this just sets up the return such that we can use it anywhere string can be used, but
// it is unique from string such that only DateStr typoes can be passed to things requiring DateStr
enum DateStrBrand { // eslint-disable-line
  _ = '',
}

export type DateStr = string & DateStrBrand

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys]

export type ZeroOrMoreArray<T> = Array<T> | [undefined]

export type ClickEvent<H extends HTMLOrSVGElement = HTMLButtonElement, E extends Event = MouseEvent> = React.MouseEvent<
  H,
  E
>
export interface OnClick extends React.MouseEventHandler<HTMLButtonElement> {
  (): any
}

/**
 * these are not necessarily complete/correct. I pulled what I could find from w3c, and then added img and video.
 * Should be good enough for our purposes thougb
 */
export type InteractiveElements = HTMLDetailsElement &
  HTMLMenuElement &
  HTMLButtonElement &
  HTMLInputElement &
  HTMLOptionElement &
  HTMLDialogElement &
  HTMLImageElement &
  HTMLVideoElement
/**
 * these are not necessarily complete/correct. I pulled what I could find from w3c, and then added img and video.
 * Should be good enough for our purposes thougb
 */
export type NonInteractiveElements = Exclude<HTMLOrSVGElement, InteractiveElements>
