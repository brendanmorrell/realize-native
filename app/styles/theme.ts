export const spacingCssVarNameDefinitions = {
  paddingRight: `--padding-right`,
  paddingLeft: `--padding-left`,
  paddingTop: `--padding-top`,
  paddingBottom: `--padding-bottom`,
  modalPaddingSides: '--modal-padding-sides',
}
export const fontCssVarNameDefinitions = {
  realizeMe: '--realize-me',
}

export const elementsCssVarNameDefinitions = {
  // TODO make this more dynamic based on the actual navbar instead of just a static value. useful for now though
  navbarHeight: '--navbar-height',
}

type SpacingCssVarNameDefinitions = typeof spacingCssVarNameDefinitions
type FontCssVarNameDefinitions = typeof fontCssVarNameDefinitions
type ElementsCssVarNameDefinitions = typeof elementsCssVarNameDefinitions

const spacing = Object.entries(spacingCssVarNameDefinitions).reduce<SpacingCssVarNameDefinitions>(
  (acc, [k, v]) => ({ ...acc, [k]: `var(${v})` }),
  {} as SpacingCssVarNameDefinitions
)

const fonts = Object.entries(fontCssVarNameDefinitions).reduce<FontCssVarNameDefinitions>(
  (acc, [k, v]) => ({ ...acc, [k]: `var(${v})` }),
  {} as FontCssVarNameDefinitions
)
const elements = Object.entries(elementsCssVarNameDefinitions).reduce<ElementsCssVarNameDefinitions>(
  (acc, [k, v]) => ({ ...acc, [k]: `var(${v})` }),
  {} as ElementsCssVarNameDefinitions
)

// make these the same names as figma and use whatever casing figma defaults to with hex values
export const theme = {
  // color names are taken from https://colornamer.robertcooper.me/
  colors: {
    // First 6 are from our design color palette
    larimarBlue: '#287BA5',
    copenhagenBlue: '#266384',
    waxCrayonBlue: ' #00A5A7',
    tropicalSplash: '#70c9ca',
    mintLeaf: '#00b78f',
    bermudaGrass: '#69C46F',
    youngGreenOnion: '#B0CC51',
    kelpTharForestBlue: '#0091AE',
    kon: '#172736',
    lightImagine: '#ADD3D5',
    grey: '#808080',
    zodiac: '#8C9095',
    sonataBlue: '#8b9eb0',
    whompGrey: '#BCC2D0',
    tangledWeb: '#b3b3b3',
    diamondWhite: '#E4EFF4',
    insigniaWhite: '#EEF4FA',
    drWhite: '#F9F9FB',
    // new colors
    radicalRed: '#ff345b',
    redOrangeJuice: '#FF554A',
    valleyOfFire: '#FF8B4D',
    socialist: '#911D1D',
    whiteout: '#FBFBFB',
    bleuDeFrance: '#3895EE',
    meadowBlossomBlue: '#78B0D1',
    springTide: '#9CCCE8',
    iceEffect: '#BFE8FF',
    husky: '#E1EDFA',
    dreamyCloud: '#e4e7ec',
    cavalry: '#414B5A',
    buster: '#404b69',
    spinningBlue: '#5E6A7C',
    sugarPool: '#ACD3D4',
    // Name mapper actually came up with the same name for two separate colors somehow. Thus, `Secondary
    diamondWhiteSecondary: '#E3EDF7',
    snowflake: '#f0f0f0',
    silver: '#C0C0C0',
    lightCandela: '#C8D3DE',
    extraordinaryAbundanceOfTinge: '#E6E6E6',
    christmasSilver: '#e0e0e0',
    wildDove: '#8B8B8B',
    trolleyGrey: '#818181',
    bitterLimeAndDefeat: '#30CC2D',
    basaltGrey: '#999999',
    poolside: '#abd6d7',
    eucalyptus: '#3A955E',
    tranquilEve: '#ECE9F1',
    powerGrey: '#A2A3A5',
    veganMastermind: '#2AC54C',
    uscGold: '#FFCC00',
    sunnyMood: '#F8CC46',
    violentViolet: '#7F00FF',
    blackOut: '#222222',
  },
  spacing,
  fonts,
  elements,
} as const

/* 
Cerulean #287BA5
Aegean #266384
Midnight #172736
Cadet Blue #ADD3D5
Silver #BCC2D0
Cloud #E4EFF4
Porcelain white

*/
