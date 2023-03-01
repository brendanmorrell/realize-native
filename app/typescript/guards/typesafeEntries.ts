import { Entries } from '../utility'

export function typesafeEntries<T extends object>(obj: T): Entries<T> {
  return Object.entries(obj) as any
}
