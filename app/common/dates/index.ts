import {
  convert,
  LocalDate,
  LocalTime,
  nativeJs,
  ZonedDateTime,
  ZoneId,
} from '@js-joda/core';
import {isString} from 'lodash';
import isNil from 'lodash/isNil';
import {Brand} from 'utility-types';
import('@js-joda/timezone');

// These branded types help disambiguate different string types
export type TimestampTZString = Brand<string, 'timestamp-tz'>;
export type LocalDateString = Brand<string, 'local-date'>;
export type LocalDateTimeString = Brand<string, 'local-datetime'>;
export type LocalDateRangeString = Brand<string, 'local-date-range'>;

/**
 * Utility function to get a TimestampTZString from ZonedDateTime
 * @param input ZonedDateTime
 * @returns TimestampTZString
 */
function zonedDateTimeToTimestampTz(input: ZonedDateTime) {
  return input.toInstant().toString() as TimestampTZString;
}

/**
 * Utility function to get start of day from zonedDateTime
 * @param zoned ZonedDateTime
 * @returns TimestampTZString
 */
function zonedToDayStart(zoned: ZonedDateTime) {
  return zoned.withHour(0).withMinute(0).withSecond(0).withNano(0);
}

export const toTimestampTZString = (date: Date) =>
  zonedDateTimeToTimestampTz(nativeJs(date));

/**
 * Convert input to timestamp TZ. If the input is invalid (not an ISO timestamp with offset OR a date object) returns undefined
 *
 * @param input Date | string | TimestampTZString | undefined | null
 * @returns Date | undefined
 */
export function dateStringToGQLTimestampTZ(input: Date): TimestampTZString;
export function dateStringToGQLTimestampTZ(
  input: TimestampTZString,
): TimestampTZString;
export function dateStringToGQLTimestampTZ(input: undefined | null): undefined;
export function dateStringToGQLTimestampTZ(
  input: string,
): TimestampTZString | undefined;
export function dateStringToGQLTimestampTZ(
  input: TimestampTZString | string | Date | undefined | null,
) {
  if (isNil(input)) {
    return;
  }

  let jsDate: Date | undefined = undefined;

  if (isString(input)) {
    if (isTimestamptTZString(input)) {
      jsDate = timestampTzToDate(input);
    }
  } else {
    jsDate = input;
  }

  if (!jsDate) {
    return;
  }

  return toTimestampTZString(jsDate);
}

/**
 * Converts a timestampTzString to JS date object. If the string is invalid will throw an error
 * @param input string | TimestampTZString
 * @returns Date
 */
export function timestampTzToDate(input: string | TimestampTZString) {
  return convert(ZonedDateTime.parse(input)).toDate();
}

/**
 * Get start of date (defaults to today) as TimestampTZString
 * @param date Date
 * @returns TimestampTZString
 */
export const startOfDay = (date?: Date) => {
  if (date) {
    return zonedDateTimeToTimestampTz(zonedToDayStart(nativeJs(date)));
  }

  return zonedDateTimeToTimestampTz(
    LocalDate.now().atStartOfDay().atZone(ZoneId.systemDefault()),
  );
};

/**
 * Get current time rounded down to the current minute
 * @returns
 */
export const roundedNow = () => {
  return convert(ZonedDateTime.now().withSecond(0).withNano(0)).toDate();
};

/**
 * Convert LocalDateString to date object with TZ offset
 * @param LocalDateString
 * @returns Date
 */

export function localDateStringToDateObject(dateStr: LocalDateString) {
  const dateObj = new Date(dateStr);
  dateObj.setMinutes(dateObj.getMinutes() + dateObj.getTimezoneOffset());
  return dateObj;
}
/**
 * Convert date object to LocalDateString
 * @param date
 * @returns ISO date (2022-01-01)
 */
export function toLocalDateString(date: Date) {
  return nativeJs(date).toLocalDate().toString() as LocalDateString;
}

export const isLocalDateString = (v?: any): v is LocalDateString => {
  if (!v || typeof v !== 'string') {
    return false;
  }

  try {
    LocalDate.parse(v);
    return true;
  } catch (e) {
    console.error(`${v} is not a LocaLDateString`);
  }
  return false;
};

export const isLocalTimeString = (v?: string): v is LocalDateTimeString => {
  if (!v) {
    return false;
  }

  try {
    LocalTime.parse(v);
    return true;
  } catch (e) {
    console.error(`${v} is not a LocalTimeString`);
  }
  return false;
};

export const isTimestamptTZString = (v?: string): v is TimestampTZString => {
  if (!v) {
    return false;
  }

  try {
    ZonedDateTime.parse(v);
    return true;
  } catch (e) {
    console.error(`${v} is not a TimestamptTZ string`);
  }
  return false;
};
