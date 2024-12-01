import { useLayoutEffect, useState } from 'preact/hooks';

import { ContentConfigParams } from '../../../common/content-config-params';
import { classes } from '../../../utils/classes';

import { getEraInfoTimeSpan } from '../../dates';
import { SelectionMeta } from '../../meta';

import { CurrencyInfo } from './CurrencyInfo';
import { EraInfoComponent } from './EraInfoComponent';
import { MeasureInfo } from './MeasureInfo';
import { NumberInfo } from './NumberInfo';
import { ShogiInfo } from './ShogiInfo';

type Props = {
  fxData: ContentConfigParams['fx'];
  preferredUnits: ContentConfigParams['preferredUnits'];
  isCombinedResult: boolean;
  matchLen: number;
  meta: SelectionMeta;
  metaonly?: boolean;
};

export function MetadataContainer({
  fxData,
  preferredUnits,
  isCombinedResult,
  matchLen,
  meta,
  metaonly = false,
}: Props) {
  const [metadata, setMetadata] = useState<unknown>(undefined);

  useLayoutEffect(() => {
    switch (meta.type) {
      case 'era': {
        void getEraInfoTimeSpan(meta).then((timeSpan) => {
          setMetadata(<EraInfoComponent meta={meta} timeSpan={timeSpan} />);
        });

        setMetadata(<EraInfoComponent meta={meta} />);
        break;
      }
      case 'measure': {
        setMetadata(
          <MeasureInfo meta={meta} preferredUnits={preferredUnits} />
        );
        break;
      }
      case 'currency': {
        if (fxData) {
          setMetadata(<CurrencyInfo meta={meta} fxData={fxData} />);
        }
        break;
      }
      case 'number': {
        if (meta.matchLen > matchLen) {
          setMetadata(
            <NumberInfo meta={meta} isCombinedResult={isCombinedResult} />
          );
        }
        break;
      }
      case 'shogi': {
        setMetadata(<ShogiInfo meta={meta} />);
        break;
      }
    }
  }, []);

  return metadata ? (
    <div
      class={classes(
        'tp-my-2 tp-py-1 tp-px-4 tp-snap-start tp-scroll-mt-5',
        metaonly ? 'tp-bg-transparent' : 'tp-bg-[--meta-bg]'
      )}
    >
      {metadata}
    </div>
  ) : null;
}
