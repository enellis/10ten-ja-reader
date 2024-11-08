import { classes } from '../../../utils/classes';

import type { EraInfo, EraInfoDate, EraMeta } from '../../dates';

type Props = {
  meta: EraMeta;
  eraInfo: EraInfo;
};

export function EraInfoComponent(props: Props) {
  return (
    <div class="tp-text-2xl tp-flex tp-items-baseline" lang="ja">
      <span class="tp-text-[--primary-highlight]">
        <ruby>
          {props.meta.era}
          <rp>(</rp>
          <rt class="tp-text-sm">{props.eraInfo.reading}</rt>
          <rp>)</rp>
          {props.meta.year === 0 ? '元年' : `${props.meta.year}年`}
          {props.meta.month && `${props.meta.month}月`.replace('-', '閏')}
          {props.meta.day && `${props.meta.day}日`}
        </ruby>
      </span>
      <span class="tp-px-1.5">=</span>
      <EraTimeSpan {...props} />
    </div>
  );
}

function EraTimeSpan({ meta, eraInfo }: { meta: EraMeta; eraInfo: EraInfo }) {
  return (
    <span class="tp-text-[--reading-highlight]">
      <EraDate meta={meta} date={eraInfo.dateStart} />
      {eraInfo.dateEnd && (
        <span>
          {' - '}
          <EraDate meta={meta} date={eraInfo.dateEnd} />
        </span>
      )}
    </span>
  );
}

function EraDate({ meta, date }: { meta: EraMeta; date: EraInfoDate }) {
  return (
    <span>
      {`${date.year}年`}
      {date.month && (
        <span
          class={classes(
            !meta.month && 'tp-text-base tp-filter tp-brightness-90'
          )}
        >{`${date.month}月`}</span>
      )}
      {date.day && (
        <span
          class={classes(
            !meta.day && 'tp-text-base tp-filter tp-brightness-90'
          )}
        >{`${date.day}日`}</span>
      )}
    </span>
  );
}
