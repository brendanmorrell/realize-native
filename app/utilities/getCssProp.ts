import { css, SerializedStyles } from '@emotion/react'
import * as React from 'react'
import { CssProp } from '../typescript/emotion'

export type Styles = CssProp | React.CSSProperties | SerializedStyles

export function getCssProp(styles: any): SerializedStyles {
  return typeof styles === 'string'
    ? css`
        ${styles}
      `
    : typeof styles === 'object'
    ? styles
    : undefined
}
