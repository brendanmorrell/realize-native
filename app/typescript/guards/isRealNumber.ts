export const isRealNumber = (input?: any): input is number =>
  typeof input === 'number' && !Number.isNaN(input) && Number.isFinite(input)
