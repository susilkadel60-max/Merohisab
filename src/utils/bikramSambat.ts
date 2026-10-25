import { BSDate } from '../types';

export const NEPALI_MONTHS = [
  'बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज',
  'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फागुन', 'चैत'
];

export const NEPALI_DAYS = [
  'आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'
];

export const NEPALI_DAYS_SHORT = ['आइत', 'सोम', 'मंगल', 'बुध', 'बिही', 'शुक्र', 'शनि'];

export const NEPALI_NUMBERS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

export const toNepaliDigits = (num: number | string): string => {
  if (num === undefined || num === null) return '';
  return num.toString().replace(/\d/g, (d) => NEPALI_NUMBERS[parseInt(d, 10)]);
};

// Bikram Sambat Month lengths from 2075 to 2090 BS
export const BS_CALENDAR_DATA: Record<number, number[]> = {
  2075: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2076: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2077: [31, 32, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2078: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2079: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2080: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2081: [31, 31, 32, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2082: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2083: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2084: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
  2085: [31, 32, 31, 32, 30, 31, 30, 29, 30, 29, 30, 30],
  2086: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2087: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2088: [31, 31, 32, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2089: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2090: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
};

// 2080-01-01 BS = 2023-04-14 AD (Friday = day index 5)
const REFERENCE_AD = new Date(2023, 3, 14);
const REFERENCE_BS: BSDate = { year: 2080, month: 1, day: 1 };

export function getDaysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((date2.getTime() - date1.getTime()) / oneDay);
}

export function getDaysInBSMonth(year: number, month: number): number {
  const months = BS_CALENDAR_DATA[year];
  if (months && months[month - 1]) {
    return months[month - 1];
  }
  return 30;
}

export function adToBs(adDate: Date): BSDate {
  try {
    let diffDays = getDaysBetween(REFERENCE_AD, adDate);
    let curYear = REFERENCE_BS.year;
    let curMonth = REFERENCE_BS.month;
    let curDay = REFERENCE_BS.day;

    if (diffDays >= 0) {
      let loops = 0;
      while (diffDays > 0 && loops < 20000) {
        loops++;
        const daysThisMonth = getDaysInBSMonth(curYear, curMonth);
        if (curDay + diffDays <= daysThisMonth) {
          curDay += diffDays;
          diffDays = 0;
        } else {
          diffDays -= (daysThisMonth - curDay + 1);
          curDay = 1;
          curMonth++;
          if (curMonth > 12) {
            curMonth = 1;
            curYear++;
          }
        }
      }
    } else {
      let loops = 0;
      while (diffDays < 0 && loops < 20000) {
        loops++;
        if (curDay + diffDays >= 1) {
          curDay += diffDays;
          diffDays = 0;
        } else {
          diffDays += curDay;
          curMonth--;
          if (curMonth < 1) {
            curMonth = 12;
            curYear--;
          }
          curDay = getDaysInBSMonth(curYear, curMonth);
        }
      }
    }

    if (isNaN(curYear) || isNaN(curMonth) || isNaN(curDay)) {
      return { year: 2081, month: 1, day: 1 };
    }
    return { year: curYear, month: curMonth, day: curDay };
  } catch (e) {
    console.error('Error converting AD to BS:', e);
    return { year: 2081, month: 1, day: 1 };
  }
}

export function bsToAd(bsDate: BSDate): Date {
  try {
    if (bsDate.year >= REFERENCE_BS.year) {
      let days = 0;
      for (let y = REFERENCE_BS.year; y < bsDate.year; y++) {
        for (let m = 1; m <= 12; m++) {
          days += getDaysInBSMonth(y, m);
        }
      }
      for (let m = 1; m < bsDate.month; m++) {
        days += getDaysInBSMonth(bsDate.year, m);
      }
      days += (bsDate.day - 1);
      return new Date(REFERENCE_AD.getTime() + (days * 24 * 60 * 60 * 1000));
    } else {
      let days = 0;
      for (let y = bsDate.year + 1; y < REFERENCE_BS.year; y++) {
        for (let m = 1; m <= 12; m++) {
          days += getDaysInBSMonth(y, m);
        }
      }
      for (let m = bsDate.month + 1; m <= 12; m++) {
        days += getDaysInBSMonth(bsDate.year, m);
      }
      days += (getDaysInBSMonth(bsDate.year, bsDate.month) - bsDate.day + 1);
      return new Date(REFERENCE_AD.getTime() - (days * 24 * 60 * 60 * 1000));
    }
  } catch (e) {
    console.error('Error converting BS to AD:', e);
    return new Date();
  }
}

export function getBSMonthStartDayOfWeek(year: number, month: number): number {
  const adDate = bsToAd({ year, month, day: 1 });
  return adDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
}

export function getDayOfWeekForBS(bsDate: BSDate): number {
  const adDate = bsToAd(bsDate);
  return adDate.getDay();
}

export function formatBSDate(bs: BSDate): string {
  const y = toNepaliDigits(bs.year);
  const m = toNepaliDigits(bs.month < 10 ? `0${bs.month}` : bs.month);
  const d = toNepaliDigits(bs.day < 10 ? `0${bs.day}` : bs.day);
  return `${y}-${m}-${d}`;
}

export function formatBSDateLong(bs: BSDate): string {
  const dayName = NEPALI_DAYS[getDayOfWeekForBS(bs)];
  const monthName = NEPALI_MONTHS[bs.month - 1];
  return `${toNepaliDigits(bs.day)} ${monthName} ${toNepaliDigits(bs.year)}, ${dayName}`;
}

export function getTodayBS(): BSDate {
  return adToBs(new Date());
}
