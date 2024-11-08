import { getCombinedCharRange, getNegatedCharRange } from '../utils/char-range';
import { DateArray, eraInfo } from '../utils/era-info';

import { parseNumber } from './numbers';

type GregorianEraInfo = {
  reading: string;
  start: number;
  yomi: string;
};

const gregorianEras: Record<string, GregorianEraInfo> = {
  // --------------------------------------------------------------
  // The following entries are not eras when the Gregorian calendar
  // was in use. However, since we lack date conversion data for
  // these periods, we treat them as if they were Gregorian eras
  // to get basic year offset calculation support.
  大化: { reading: 'たいか', start: 645, yomi: 'Taika' },
  白雉: { reading: 'はくち', start: 650, yomi: 'Hakuchi' },
  朱鳥: { reading: 'しゅちょう', start: 686, yomi: 'Shuchō' },
  // --------------------------------------------------------------

  明治: { reading: 'めいじ', start: 1868, yomi: 'Meiji' },
  大正: { reading: 'たいしょう', start: 1912, yomi: 'Taishō' },
  昭和: { reading: 'しょうわ', start: 1926, yomi: 'Shōwa' },
  平成: { reading: 'へいせい', start: 1989, yomi: 'Heisei' },
  令和: { reading: 'れいわ', start: 2019, yomi: 'Reiwa' },
};

const eraAliases: Record<string, string> = {
  '㍾': '明治',
  '㍽': '大正',
  '㍼': '昭和',
  '㍻': '平成',
  '㋿': '令和',
};

const maxEraLength = Math.max(
  ...[
    ...Object.keys(eraAliases),
    ...Object.keys(gregorianEras),
    ...Object.keys(eraInfo),
  ].map((key) => key.length)
);

export function lookForEra({
  currentText,
  nodeText,
  textDelimiter: originalTextDelimiter,
  textEnd,
}: {
  currentText: string;
  nodeText: string;
  textDelimiter: RegExp;
  textEnd: number;
}): {
  textDelimiter: RegExp;
  textEnd: number;
} | null {
  // We only want to _extend_ the current range so if `textEnd` is already -1
  // (i.e. end of the text) then we don't need to do anything.
  if (textEnd < 0 || !startsWithEraName(currentText)) {
    return null;
  }

  // The original text delimiter should include all the characters needed to
  // match Japanese years except spaces between the era and the year, and
  // spaces between the year and the final 年 character, if any.
  const japaneseOrSpace = getCombinedCharRange([
    getNegatedCharRange(originalTextDelimiter),
    /[\s]/,
  ]);
  const textDelimiter = getNegatedCharRange(japaneseOrSpace);

  const endOfEra = nodeText.substring(textEnd).search(textDelimiter);

  return {
    textDelimiter,
    textEnd: endOfEra === -1 ? -1 : textEnd + endOfEra,
  };
}

export function startsWithEraName(text: string): boolean {
  for (let i = 1; i <= text.length && i <= maxEraLength; i++) {
    if (isEraName(text.substring(0, i))) {
      return true;
    }
  }

  return false;
}

export type EraMeta = {
  type: 'era';
  era: string;
  // 0 here represents that the matched text used 元年 (equivalent to 1 but we
  // might want to display it differently).
  year: number;
  month?: number;
  day?: number;
  // The length of the text that matched
  matchLen: number;
};

export function extractEraMetadata(text: string): EraMeta | undefined {
  const parsedDate = parseEraDate(text);

  if (!parsedDate) {
    return undefined;
  }

  return {
    type: 'era',
    era: parsedDate.era,
    year: parsedDate.year,
    month: parsedDate.month,
    day: parsedDate.day,
    matchLen: parsedDate.matchLength,
  };
}

function isEraName(text: string): boolean {
  return text in eraAliases || text in gregorianEras || text in eraInfo;
}

function isGregorianYear(era: string, year: number): boolean {
  if (era in gregorianEras) {
    if (era === '明治' && year < 6) {
      // This was before 1873, when the Chinese calendar was still in use.
      return false;
    }
    return true;
  }
  return false;
}

export type EraInfoDate = {
  year: number;
  month?: number;
  day?: number;
};

export type EraInfo = {
  reading: string;
  dateStart: EraInfoDate;
  dateEnd?: EraInfoDate;
};

export function getEraInfo(meta: EraMeta): EraInfo | undefined {
  if (isGregorianYear(meta.era, meta.year)) {
    const eraInfo = gregorianEras[meta.era];

    const reading = eraInfo.reading;

    const gregorianYear = eraInfo.start + Math.max(meta.year, 1) - 1;
    const date = {
      year: gregorianYear,
      month: meta.month,
      day: meta.day,
    };

    return { reading, dateStart: date };
  }

  const reading = eraInfo[meta.era].reading;

  let dateStart: EraInfoDate | undefined = undefined;
  let dateEnd: EraInfoDate | undefined = undefined;

  if (!meta.day) {
    const res = calculateTimeSpanOfEraYearOrMonth(
      meta.era,
      meta.year,
      meta.month
    );

    if (!res) {
      return undefined;
    }

    dateStart = dateToEraInfoDate(res.dateStart);
    dateEnd = dateToEraInfoDate(res.dateEnd);
  } else if (meta.month) {
    dateStart = dateToEraInfoDate(
      toGregorianDate(meta.era, meta.year, meta.month, meta.day)
    );
  }

  if (!dateStart) {
    return undefined;
  }

  return { reading, dateStart, dateEnd };
}

function dateArrayToDate(dateArray: DateArray, dayOffset: number = 0) {
  return new Date(dateArray[0], dateArray[1] - 1, dateArray[2] + dayOffset);
}

function toGregorianDate(
  era: string,
  year: number,
  month: number,
  day: number
): Date {
  const dateArray = eraInfo[era].years[year][month];
  const date = dateArrayToDate(dateArray, day - 1);
  return date;
}

function dateToEraInfoDate(date: Date): EraInfoDate {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}

function calculateTimeSpanOfEraYearOrMonth(
  era: string,
  year: number,
  month?: number
): { dateStart: Date; dateEnd: Date } | undefined {
  year = Math.max(year, 1);

  const eraData = eraInfo[era];

  const startOfEraDate = dateArrayToDate(eraData.start);
  const endOfEraDate = dateArrayToDate(eraData.end);

  if (!startOfEraDate || !endOfEraDate) {
    return undefined;
  }

  if (!(year in eraData.years)) {
    return undefined;
  }

  let startOfTimeSpan = startOfEraDate;

  if (month) {
    if (!(month in eraData.years[year])) {
      return undefined;
    }

    const startOfMonthArray = eraData.years[year][month];

    startOfTimeSpan = dateArrayToDate(startOfMonthArray);
  } else if (1 in eraData.years[year]) {
    const startOfYearArray = eraData.years[year][1];

    startOfTimeSpan = dateArrayToDate(startOfYearArray);
  }

  const laterStartDate =
    startOfEraDate > startOfTimeSpan ? startOfEraDate : startOfTimeSpan;

  let endOfTimeSpan = endOfEraDate;

  if (month) {
    const nextMonthIsLeapMonth = month > 0 && (-month) in eraData.years[year];
    const isLastMonthInYear = !nextMonthIsLeapMonth && Math.abs(month) === 12;

    let nYear = year;
    let nMonth = month;

    if (nextMonthIsLeapMonth) {
      nMonth = -nMonth;
    } else if (isLastMonthInYear) {
      nYear++;
      nMonth = 1;
    } else {
      nMonth = Math.abs(nMonth) + 1;
    }

    if (nYear in eraData.years && nMonth in eraData.years[nYear]) {
      const startOfNextMonthArray = eraData.years[nYear][nMonth];

      endOfTimeSpan = dateArrayToDate(startOfNextMonthArray, -1);
    }
  } else {
    const notLastYearOfEra = year + 1 in eraData.years;
    if (notLastYearOfEra) {
      const startOfNextYearArray = eraData.years[year + 1][1];

      endOfTimeSpan = dateArrayToDate(startOfNextYearArray, -1);
    }
  }

  const earlierEndDate =
    endOfEraDate < endOfTimeSpan ? endOfEraDate : endOfTimeSpan;

  return {
    dateStart: laterStartDate,
    dateEnd: earlierEndDate,
  };
}

type ParsedEraDate = {
  era: string;
  year: number;
  month?: number;
  day?: number;

  matchLength: number;
};

export function parseEraDate(text: string): ParsedEraDate | undefined {
  const numerals = '0-9０-９〇一二三四五六七八九十百';

  // This is a bit complicated because for a numeric year we don't require the
  // 年 but for 元年 we do. i.e. '令和2' is valid but '令和元' is not.
  // Furthermore, 年 can be written as 歳.
  const yearRegex = String.raw`(?:([${numerals}]+\s*(?:年|歳)?)|(元\s*(?:年|歳)))`;
  // 閏 marks an intercalary / leap month.
  const monthRegex = String.raw`\s*(閏?\s*[${numerals}]+)\s*月`;
  const dayRegex = String.raw`\s*([${numerals}]+)\s*日`;

  // 'g' flag needs to be set in order for the `lastIndex` property to represent
  // the matched length after the exec() call.
  // Month and day are optional.
  const fullRegex = new RegExp(
    `${yearRegex}(?:${monthRegex}(?:${dayRegex})?)?`,
    'g'
  );
  const matches = fullRegex.exec(text);

  let matchLength = fullRegex.lastIndex;

  if (!matches || matches.index === 0) {
    return undefined;
  }

  // Look for an era
  let era = text.substring(0, matches.index).trim();

  if (era in eraAliases) {
    era = eraAliases[era];
  } else if (!isEraName(era)) {
    return undefined;
  }

  // Parse year
  let year: number | null = null;
  if (typeof matches[1] !== 'undefined') {
    year = parseNumber(matches[1].replace(/(年|歳)/, '').trim());
    if (typeof year === 'number') {
      if (year < 1) {
        year = null;
      } else if (!isGregorianYear(era, year) && !(year in eraInfo[era].years)) {
        year = null;
      }
    }
  } else if (typeof matches[2] !== 'undefined') {
    year = 0;
  }

  if (year === null) {
    return undefined;
  }

  // Parse month
  let month: number | null | undefined = null;
  if (typeof matches[3] !== 'undefined') {
    const isLeapMonth = matches[3].includes('閏');
    month = parseNumber(matches[3].replace('閏', '').trim());
    if (typeof month === 'number') {
      if (isLeapMonth) {
        // In the eraInfo dataset leap months are represented by negative numbers.
        month = -month;
      }

      if (isGregorianYear(era, year)) {
        if (month < 1 || month > 12) {
          month = null;
        }
      } else if (!(month in eraInfo[era].years[Math.max(year, 1)])) {
        month = null;
      }
    }
  }

  if (month === null) {
    if (year === 0) {
      matchLength = matches.index + matches[2].length;
    } else {
      matchLength = matches.index + matches[1].length;
    }
    month = undefined;
  }

  // Parse day
  let day: number | null | undefined = null;
  if (typeof matches[4] !== 'undefined') {
    day = parseNumber(matches[4]);
    if (typeof day === 'number' && day < 1) {
      day = null;
    }
  }

  if (!month || !day) {
    day = undefined;
  }

  return { era, year, month, day, matchLength };
}
