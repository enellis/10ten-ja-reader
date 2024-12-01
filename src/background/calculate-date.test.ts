import { describe, expect, it } from 'vitest';

import { EraInfoDate } from '../content/dates';

import { calculateEraDateTimeSpan } from './calculate-date';

describe('era date conversion background script', () => {
  it('gets correct era info dates', () => {
    const cases: Array<
      [
        era: string,
        year: number,
        month?: number,
        day?: number,
        dateStart?: EraInfoDate,
        dateEnd?: EraInfoDate,
      ]
    > = [
      // Gregorian eras
      // ['令和', 0, 1, 1, { year: 2019, month: 1, day: 1 }],
      // ['令和', 1, 1, 1, { year: 2019, month: 1, day: 1 }],
      // ['令和', 1, 1, undefined, { year: 2019, month: 1 }],
      // ['明治', 6, undefined, undefined, { year: 1873 }],

      // Full non Gregorian date
      ['明治', 5, 6, 15, { year: 1872, month: 7, day: 20 }],

      // First year of era
      [
        '安政',
        0,
        undefined,
        undefined,
        { year: 1855, month: 1, day: 15 },
        { year: 1855, month: 2, day: 16 },
      ],
      [
        '安政',
        1,
        undefined,
        undefined,
        { year: 1855, month: 1, day: 15 },
        { year: 1855, month: 2, day: 16 },
      ],

      // Arbitrary year in between
      [
        '安政',
        4,
        undefined,
        undefined,
        { year: 1857, month: 1, day: 26 },
        { year: 1858, month: 2, day: 13 },
      ],

      // Last year of era
      [
        '安政',
        7,
        undefined,
        undefined,
        { year: 1860, month: 1, day: 23 },
        { year: 1860, month: 4, day: 8 },
      ],

      // Invalid year
      ['安政', 8, undefined],

      // Arbitrary month
      [
        '安政',
        4,
        1,
        undefined,
        { year: 1857, month: 1, day: 26 },
        { year: 1857, month: 2, day: 23 },
      ],

      // Month before leap month
      [
        '安政',
        4,
        5,
        undefined,
        { year: 1857, month: 5, day: 23 },
        { year: 1857, month: 6, day: 21 },
      ],

      // Leap month
      [
        '安政',
        4,
        -5,
        undefined,
        { year: 1857, month: 6, day: 22 },
        { year: 1857, month: 7, day: 20 },
      ],

      // Last month of year
      [
        '安政',
        4,
        12,
        undefined,
        { year: 1858, month: 1, day: 15 },
        { year: 1858, month: 2, day: 13 },
      ],

      // Last month of year is a leap month
      [
        '安永',
        4,
        -12,
        undefined,
        { year: 1776, month: 1, day: 21 },
        { year: 1776, month: 2, day: 18 },
      ],

      // Invalid month
      ['安政', 4, -12, undefined],
    ];

    for (const [era, year, month, day, dateStart, dateEnd] of cases) {
      const result = calculateEraDateTimeSpan({ era, year, month, day });

      if (!dateStart && !dateEnd) {
        expect(result).toBeUndefined();
      } else {
        expect(result).toBeDefined();
        expect(result!.dateStart).toEqual(dateStart);
        expect(result!.dateEnd).toEqual(dateEnd);
      }
    }
  });
});
