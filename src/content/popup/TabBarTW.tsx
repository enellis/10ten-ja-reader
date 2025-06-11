import { MajorDataSeries } from '@birchill/jpdict-idb';
import { type VNode } from 'preact';

import { useLocale } from '../../common/i18n';
import { classes } from '../../utils/classes';
import { getMouseCapabilityMql } from '../../utils/device';
import { isFenix } from '../../utils/ua-utils';

import { DisplayMode } from '../popup-state';

import { CloseButton } from './CloseButton';
import { Book } from './Icons/Book';
import { Cog } from './Icons/Cog';
import { KanjiIcon } from './Icons/KanjiIcon';
import { Person } from './Icons/Person';
import { Pin } from './Icons/Pin';

export function TabBar({
  closeShortcuts,
  displayMode,
  enabledTabs,
  onClosePopup,
  onShowSettings,
  onSwitchDictionary,
  onTogglePin,
  pinShortcuts,
  selectedTab,
}: {
  closeShortcuts?: ReadonlyArray<string>;
  displayMode: DisplayMode;
  enabledTabs: Record<MajorDataSeries, boolean>;
  onClosePopup?: () => void;
  onShowSettings?: () => void;
  onSwitchDictionary?: (newDict: MajorDataSeries) => void;
  onTogglePin?: () => void;
  pinShortcuts?: ReadonlyArray<string>;
  selectedTab: MajorDataSeries;
}) {
  const { t, langTag } = useLocale();

  const sections: Array<{ series: MajorDataSeries; icon: VNode }> = [
    { series: 'words', icon: <Book /> },
    { series: 'kanji', icon: <KanjiIcon /> },
    { series: 'names', icon: <Person /> },
  ];

  // We don't want to show the pin on devices that don't have a mouse since it's
  // generally not useful there (and just takes up room).
  //
  // If, however, the user somehow managed to get the popup into a pinned state,
  // we should show the icon just so they don't get confused (and can get out of
  // that state).
  const showPin =
    onTogglePin &&
    (getMouseCapabilityMql()?.matches !== false || displayMode === 'pinned');

  return (
    <div
      class="tab-bar"
      lang={langTag}
      onPointerUp={() => {
        // Dummy event to make Safari not eat clicks on the child links / buttons.
      }}
    >
      <ul class="tabs">
        {sections.map(({ series, icon }) => (
          <li
            key={series}
            class={classes('tab', !enabledTabs[series] && 'disabled')}
            role="presentation"
            aria-selected={series === selectedTab ? true : undefined}
          >
            {/* We use a button because if it's a link there will be a little tooltip
                show in the corner of the browser when the user hovers over the tab. */}
            <button
              onClick={(event: Event) => {
                event.preventDefault();
                if (series !== selectedTab && onSwitchDictionary) {
                  onSwitchDictionary(series);
                }
              }}
            >
              <span class="icon">{icon}</span>
              <span>{t(`tabs_${series}_label`)}</span>
            </button>
          </li>
        ))}
      </ul>

      {showPin && (
        <PinButton
          onTogglePin={onTogglePin}
          pinShortcuts={pinShortcuts || []}
        />
      )}

      {
        // Firefox for Android has a bug that when calling
        // `browser.runtime.openOptionsPage` a new tab is opened but nothing is
        // displayed.
        //
        // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1795449
        //
        // Until that is fixed, we don't show the settings button on Firefox for
        // Android to avoid confusion.
        onShowSettings && !isFenix() && (
          <SettingsButton onShowSettings={onShowSettings} />
        )
      }

      {onClosePopup && (
        <CloseButton
          onClosePopup={onClosePopup}
          closeShortcuts={closeShortcuts || []}
        />
      )}
    </div>
  );
}

function PinButton({
  onTogglePin,
  pinShortcuts,
}: {
  onTogglePin: () => void;
  pinShortcuts: ReadonlyArray<string>;
}) {
  const { t } = useLocale();

  const label = t('popup_pin_label');
  const title = pinShortcuts.length
    ? `${label} (${pinShortcuts.join(' / ')})`
    : label;

  return (
    <div class="pin">
      <button
        class="pin-button"
        type="button"
        title={title}
        aria-label={label}
        onClick={onTogglePin}
      >
        <Pin />
      </button>
    </div>
  );
}

function SettingsButton({ onShowSettings }: { onShowSettings: () => void }) {
  const { t } = useLocale();
  const label = t('popup_settings_label');

  return (
    <div class="settings">
      <button
        class="settings-button"
        type="button"
        title={label}
        aria-label={label}
        onClick={onShowSettings}
      >
        <Cog />
      </button>
    </div>
  );
}
