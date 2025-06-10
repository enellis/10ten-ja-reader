import { MajorDataSeries } from '@birchill/jpdict-idb';
import { useState } from 'preact/hooks';

import { TabBar } from './TabBar';

export default function TabBarFixture() {
  const [selectedTab, setSelectedTab] = useState<MajorDataSeries>('words');

  return (
    <TabBar
      displayMode="hover"
      enabledTabs={{ words: true, kanji: false, names: true }}
      selectedTab={selectedTab}
      onClosePopup={() => {}}
      onShowSettings={() => {}}
      onSwitchDictionary={setSelectedTab}
      onTogglePin={() => {}}
    />
  );
}
