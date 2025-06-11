import { MajorDataSeries } from '@birchill/jpdict-idb';
import { h, render } from 'preact';

import { TabDisplay } from '../../common/content-config-params';
import { html } from '../../utils/builder';

import { DisplayMode } from '../popup-state';
import { QueryResult } from '../query';

import { TabBar } from './TabBarTW';

export function renderTabBar(props: {
  tabDisplay: TabDisplay;
  closeShortcuts?: ReadonlyArray<string>;
  displayMode: DisplayMode;
  enabledTabs: Record<MajorDataSeries, boolean>;
  onClosePopup?: () => void;
  onShowSettings?: () => void;
  onSwitchDictionary?: (newDict: MajorDataSeries) => void;
  onTogglePin?: () => void;
  pinShortcuts?: ReadonlyArray<string>;
  selectedTab: MajorDataSeries;
}): HTMLElement {
  const containerElement = html('div', {});
  render(h(TabBar, props), containerElement);
  return containerElement;
}

// We have some slightly complicated logic to determine if we show the words
// tab.
//
// Basically, we show the words tab if there are word results OR we have
// metadata to show and NO name results (since if we have name results we can
// show the metadata there instead).
export function showWordsTab(
  queryResult: QueryResult,
  hasMeta: boolean
): boolean {
  return !!queryResult.words || (hasMeta && !queryResult.names);
}
