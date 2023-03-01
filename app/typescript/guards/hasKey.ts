export function hasKey<O>(obj: O, key: any): key is keyof O {
  return !!(typeof key === 'string' && obj && (typeof obj === 'object' || typeof obj === 'function') && key in obj)
}
