import { MajorDataSeries } from '@birchill/jpdict-idb';
import { useState } from 'preact/hooks';
import { useFixtureSelect } from 'react-cosmos/client';

import { TabDisplay } from '../../common/content-config-params';

import { TabBar } from './TabBar';
import { TabBar as TabBarTW } from './TabBarTW';

export default function TabBarFixture() {
  const [selectedTab, setSelectedTab] = useState<MajorDataSeries>('words');
  const [tabDisplay] = useFixtureSelect<TabDisplay>('tabDisplay', {
    options: ['top', 'left', 'right', 'none'],
  });

  return (
    <div>
      <TabBar
        displayMode="hover"
        enabledTabs={{ words: true, kanji: false, names: true }}
        selectedTab={selectedTab}
        onClosePopup={() => {}}
        onShowSettings={() => {}}
        onSwitchDictionary={setSelectedTab}
        onTogglePin={() => {}}
      />
      <TabBarTW
        tabDisplay={tabDisplay}
        displayMode="hover"
        enabledTabs={{ words: true, kanji: false, names: true }}
        selectedTab={selectedTab}
        onClosePopup={() => {}}
        onShowSettings={() => {}}
        onSwitchDictionary={setSelectedTab}
        onTogglePin={() => {}}
      />
    </div>
  );
}
