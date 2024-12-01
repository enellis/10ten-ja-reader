import { EraInfoTimeSpan, EraMeta } from '../../dates';

import { EraInfoComponent } from './EraInfoComponent';

const TEST_DATA: Array<{ meta: EraMeta; timeSpan?: EraInfoTimeSpan }> = [
  {
    meta: { type: 'era', era: '明治', reading: 'めいじ', year: 2, matchLen: 4 },
    timeSpan: {
      dateStart: { year: 1869, month: 2, day: 11 },
      dateEnd: { year: 1870, month: 1, day: 31 },
    },
  },
  {
    meta: {
      type: 'era',
      era: '明治',
      reading: 'めいじ',
      year: 2,
      month: 6,
      matchLen: 6,
    },
    timeSpan: {
      dateStart: { year: 1869, month: 7, day: 9 },
      dateEnd: { year: 1869, month: 8, day: 7 },
    },
  },
  {
    meta: {
      type: 'era',
      era: '明治',
      reading: 'めいじ',
      year: 2,
      month: 6,
      day: 25,
      matchLen: 9,
    },
    timeSpan: { dateStart: { year: 1869, month: 8, day: 2 } },
  },
  {
    meta: { type: 'era', era: '令和', reading: 'れいわ', year: 6, matchLen: 4 },
    timeSpan: { dateStart: { year: 2024 } },
  },
  {
    meta: {
      type: 'era',
      era: '令和',
      reading: 'れいわ',
      year: 6,
      month: 12,
      matchLen: 7,
    },
    timeSpan: { dateStart: { year: 2024, month: 12 } },
  },
  {
    meta: {
      type: 'era',
      era: '令和',
      reading: 'れいわ',
      year: 6,
      month: 12,
      day: 1,
      matchLen: 9,
    },
    timeSpan: {
      dateStart: { year: 2024, month: 12, day: 1 },
    },
  },
  {
    meta: { type: 'era', era: '令和', reading: 'れいわ', year: 0, matchLen: 4 },
    timeSpan: { dateStart: { year: 2019 } },
  },
  {
    meta: {
      type: 'era',
      era: '安政',
      reading: 'あんせい',
      year: 99,
      matchLen: 5,
    },
  },
];

export default {
  'timespan for year': <EraInfoComponent {...TEST_DATA[0]} />,
  'timespan for month': <EraInfoComponent {...TEST_DATA[1]} />,
  'full calculated date': <EraInfoComponent {...TEST_DATA[2]} />,
  'gregorian year only': <EraInfoComponent {...TEST_DATA[3]} />,
  'gregorian with month': <EraInfoComponent {...TEST_DATA[4]} />,
  'gregorian full date': <EraInfoComponent {...TEST_DATA[5]} />,
  元年: <EraInfoComponent {...TEST_DATA[6]} />,
  invalid: <EraInfoComponent {...TEST_DATA[7]} />,
};
