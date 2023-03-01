function separateCasingWordBoundaries(input: string) {
  return input
    .split('')
    .map((x, i, arr) => {
      const current = x
      const next = arr[i + 1]
      const isCasingBoundary = /[a-z]/.test(current) && /[A-Z]/.test(next)
      return isCasingBoundary ? `${x} ` : x
    })
    .join('')
}

/**
 * function to take in a snake or kebab cased string sand turn it into an object with titlecase, lowercase, and uppercase versions
 * of the same string
 * takes in an optionl second parameter which is a trasnformer function to run on each of the results after conversion
 */
type Transformer = (converted: string) => string
export function machineTextFormatter(machineText: string, transformer: Transformer = (x) => x) {
  if (!machineText) return { lowerCase: '', upperCase: '', titleCase: '', sentenceCase: '' }

  const casingBoundedWordsString = separateCasingWordBoundaries(machineText)
  const specialCharacterBoundedWordsArray = casingBoundedWordsString.replace(/[_-]/g, ' ').split('')
  const upperCase = transformer(specialCharacterBoundedWordsArray.map((x) => x.toUpperCase()).join(''))
  const lowerCase = transformer(specialCharacterBoundedWordsArray.map((x) => x.toLowerCase()).join(''))

  const titleCase = transformer(lowerCase.replace(/(\b[a-z](?!\s))/g, (x) => x.toUpperCase()))
  const sentenceCase = transformer(lowerCase.charAt(0).toUpperCase().concat(lowerCase.slice(1)))
  return { lowerCase, upperCase, titleCase, sentenceCase }
}
