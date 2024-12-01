import { classes } from '../../../utils/classes';

import type { EraInfoDate, EraInfoTimeSpan, EraMeta } from '../../dates';

type Props = {
  meta: EraMeta;
  timeSpan?: EraInfoTimeSpan;
};

export function EraInfoComponent(props: Props) {
  return (
    <div class="tp-text-2xl tp-flex tp-items-baseline" lang="ja">
      <span class="tp-text-[--primary-highlight]">
        {props.meta.reading ? (
          <ruby>
            {props.meta.era}
            <rp>(</rp>
            <rt class="tp-text-sm">{props.meta.reading}</rt>
            <rp>)</rp>
          </ruby>
        ) : (
          <span>{props.meta.era}</span>
        )}
        {props.meta.year === 0 ? '元年' : `${props.meta.year}年`}
        {props.meta.month && `${props.meta.month}月`.replace('-', '閏')}
        {props.meta.day && `${props.meta.day}日`}
      </span>
      <span class="tp-px-1.5">=</span>
      {props.timeSpan ? (
        <EraTimeSpan meta={props.meta} timeSpan={props.timeSpan} />
      ) : (
        <span class="tp-text-[--reading-highlight]">invalid</span>
      )}
    </div>
  );
}

function EraTimeSpan({
  meta,
  timeSpan,
}: {
  meta: EraMeta;
  timeSpan: EraInfoTimeSpan;
}) {
  return (
    <span class="tp-text-[--reading-highlight]">
      <EraDate meta={meta} date={timeSpan.dateStart} />
      {timeSpan.dateEnd && (
        <span>
          {' - '}
          <EraDate meta={meta} date={timeSpan.dateEnd} />
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
