// TODO figure out a way to export a monkey patched styled function which does this by default

export const transientOptions = {
  shouldForwardProp: (propName: string) => !propName.startsWith('$'),
}
