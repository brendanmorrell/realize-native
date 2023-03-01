import '@emotion/react'
import { Interpolation, Theme as EmotionTheme } from '@emotion/react'
import { theme } from '../styles/theme'

type CustomTheme = typeof theme
declare module '@emotion/react' {
  export interface Theme extends CustomTheme {}
}

export type CssProp = Interpolation<EmotionTheme>
