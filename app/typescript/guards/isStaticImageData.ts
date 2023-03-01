import { StaticImageData } from 'next/image'
import { hasKey } from './hasKey'
import { isRealNumber } from './isRealNumber'

export function isStaticImageData(input: any): input is StaticImageData {
  return (
    !!input &&
    hasKey(input, 'src') &&
    typeof input.src === 'string' &&
    hasKey(input, 'height') &&
    isRealNumber(input.height) &&
    hasKey(input, 'width') &&
    isRealNumber(input.width)
  )
}
