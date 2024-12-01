import { describe, expect, it } from 'vitest';

import { parseEraDate, startsWithEraName } from './dates';

describe('era date conversion', () => {
  it('detects strings that start with an era name', () => {
    expect(startsWithEraName('令和')).toBe(true);
    expect(startsWithEraName('令和元年')).toBe(true);
    expect(startsWithEraName('令元年')).toBe(false);
    expect(startsWithEraName('令')).toBe(false);
    expect(startsWithEraName('')).toBe(false);
    expect(startsWithEraName('㋿2年')).toBe(true);
    expect(startsWithEraName('天平神護')).toBe(true);
  });

  it('parses era dates correctly', () => {
    const cases: Array<
      [
        text: string,
        matchLength?: number,
        era?: string,
        year?: number,
        month?: number,
        day?: number,
      ]
    > = [
      ['  安永  2  年  閏  3  月  10  日xxx', 26, '安永', 2, -3, 10],

      ['令和1年３月二十日', 9, '令和', 1, 3, 20],
      ['令和1年３月二十', 6, '令和', 1, 3],
      ['令和1年３', 4, '令和', 1],
      ['令和1', 3, '令和', 1],
      ['令和元', undefined],
      ['令和元年', 4, '令和', 0],
      ['令和元歳', 4, '令和', 0],
      ['令和1歳', 4, '令和', 1],
      ['㋿1年', 3, '令和', 1],

      // Invalid parts of date
      // Invalid era name
      ['令1年', undefined],
      // 安永 ends with year 10
      // ['安永11年', undefined],
      // There is no leap month in 安永3年
      // ['安永3年閏1月1日', 4, '安永', 3, undefined],
      // There is no 13th month
      ['令和1年13月1日', 4, '令和', 1, undefined],
      // Gregorian era dates don't have leap months
      ['令和1年閏1月1日', 4, '令和', 1, undefined],
    ];

    for (const [text, matchLength, era, year, month, day] of cases) {
      const parsed = {
        era,
        year,
        month,
        day,
        matchLength,
      };

      const result = parseEraDate(text);

      if (!matchLength) {
        expect(result).toBeUndefined();
      } else {
        expect(result).toEqual(parsed);
      }
    }
  });
});
