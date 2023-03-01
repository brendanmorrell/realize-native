export const isValidDateObject = (date: any): date is Date => {
  return date?.constructor?.name === 'Date' && date.toString() !== 'Invalid Date' && !Number.isNaN(date)
}
