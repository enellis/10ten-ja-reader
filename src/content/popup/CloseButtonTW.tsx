import { useLocale } from '../../common/i18n';

import { Cross } from './Icons/Cross';

export function CloseButton({
  onClosePopup,
  closeShortcuts,
}: {
  onClosePopup: () => void;
  closeShortcuts: ReadonlyArray<string>;
}) {
  const { t } = useLocale();

  const label = t('popup_close_label');
  const title = closeShortcuts.length
    ? `${label} (${closeShortcuts.join(' / ')})`
    : label;

  return (
    <div class="close">
      <button
        class="close-button"
        type="button"
        title={title}
        aria-label={label}
        onClick={(event: MouseEvent) => {
          event.preventDefault();
          onClosePopup();
        }}
      >
        <Cross />
      </button>
    </div>
  );
}
