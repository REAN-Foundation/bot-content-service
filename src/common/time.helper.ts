import { DateTime, Duration } from 'luxon';
import { DateStringFormat, DurationType } from "../domain.types/miscellaneous/time.types";

//////////////////////////////////////////////////////////////////////////////////////////////////////

export const MINUTES_IN_HOUR = 60;
export const MINUTES_IN_DAY = 24 * MINUTES_IN_HOUR;
export const MINUTES_IN_WEEK = 7 * MINUTES_IN_DAY;
export const MINUTES_IN_MONTH = 30 * MINUTES_IN_DAY;
export const MINUTES_IN_YEAR = 365 * MINUTES_IN_DAY;
export const MINUTES_IN_QUARTER = 3 * MINUTES_IN_MONTH;

//////////////////////////////////////////////////////////////////////////////////////////////////////

export class TimeHelper {

    static timestamp = (date: Date): string => {
        return date.getTime().toString();
    };

    static getWeekday = (date: Date, short: boolean): string => {
        return DateTime.fromJSDate(date).toFormat(short ? 'ccc' : 'cccc');
    };

    static nowUtc(): Date {
        return DateTime.utc().toJSDate();
    }

    static startOfTodayUtc(): Date {
        return DateTime.utc().startOf('day').toJSDate();
    }

    static endOfTodayUtc(): Date {
        return DateTime.utc().endOf('day').toJSDate();
    }

    static startOfThisWeekUtc(): Date {
        return DateTime.utc().startOf('week').toJSDate();
    }

    static getWeekdayIndex(day: string): number {
        return DateTime.fromFormat(day, 'cccc').weekday % 7;
    }

    static sameTimeOfDayThisWeekUtc(day: string): Date {
        return DateTime.utc().set({ weekday: this.getWeekdayIndex(day) }).toJSDate();
    }

    static startOfDayThisWeekUtc(day: string): Date {
        return DateTime.utc().set({ weekday: this.getWeekdayIndex(day) }).startOf('day').toJSDate();
    }

    static startOfThisMonthUtc(): Date {
        return DateTime.utc().startOf('month').toJSDate();
    }

    static startOfThisYearUtc(): Date {
        return DateTime.utc().startOf('year').toJSDate();
    }

    static getStartOfDay = (date: Date, timezoneOffsetMinutes: number): Date => {
        return DateTime.fromJSDate(date, { zone: 'utc' })
            .startOf('day')
            .plus({ minutes: timezoneOffsetMinutes })
            .toJSDate();
    };

    static getDayOfMonth = (date: Date): string => {
        return DateTime.fromJSDate(date).toFormat('dd');
    };

    static getMonth = (date: Date): string => {
        return DateTime.fromJSDate(date).toFormat('LLLL');
    };

    static getDateString = (date: Date, format: DateStringFormat): string => {
        return DateTime.fromJSDate(date).toFormat('yyyy-MM-dd');
    };

    static addDuration = (date: Date, durationValue: number, durationType: DurationType, utc = false): Date => {
        return (utc ? DateTime.utc() : DateTime.fromJSDate(date))
            .plus({ [durationType]: durationValue })
            .toJSDate();
    };

    static subtractDuration = (date: Date, durationValue: number, durationType: DurationType, utc = false): Date => {
        return (utc ? DateTime.utc() : DateTime.fromJSDate(date))
            .minus({ [durationType]: durationValue })
            .toJSDate();
    };

    static isBefore = (first: Date, second: Date): boolean => {
        return DateTime.fromJSDate(first) < DateTime.fromJSDate(second);
    };

    static isAfter = (first: Date, second: Date): boolean => {
        return DateTime.fromJSDate(first) > DateTime.fromJSDate(second);
    };

    static durationFromString = (str: string, durationType: DurationType): number => {
        const duration = Duration.fromISO(str);
        return duration.as(durationType);
    };
}