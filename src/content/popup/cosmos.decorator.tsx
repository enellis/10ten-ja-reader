import type { RenderableProps } from 'preact';
import { useEffect, useLayoutEffect } from 'preact/hooks';
import { useFixtureInput, useFixtureSelect } from 'react-cosmos/client';

import { locale } from '../../common/i18n';
import { EmptyProps } from '../../utils/type-helpers';

import { popupOptions } from './popup-options';

export default function PopupDecorator({
  children,
}: RenderableProps<EmptyProps>) {
  const [selectLocale] = useFixtureSelect('locale', {
    options: ['en', 'ja', 'zh_CN'],
  });
  useEffect(() => {
    if (locale !== undefined) {
      locale.value = selectLocale;
    }
  }, [selectLocale]);

  const [themeName] = useFixtureSelect('theme', {
    options: ['black', 'light', 'blue', 'lightblue', 'yellow'],
    defaultValue: 'light',
  });

  const [fontSize] = useFixtureSelect('font size', {
    options: ['normal', 'large', 'xl'],
  });

  // This is here so that we can test that components do not change when the
  // root font size of the document changes (i.e. test that we are NOT using
  // `rem` units).
  const [massivePageFontSize] = useFixtureInput('rem unit check', false);

  // For when the popup is marked as being interactive
  const [interactive] = useFixtureInput('interactive', true);
  useEffect(() => {
    popupOptions.interactive.value = interactive;
  }, [interactive]);

  useLayoutEffect(() => {
    if (massivePageFontSize) {
      window.document.documentElement.style.fontSize = '50px';
    } else {
      window.document.documentElement.style.fontSize = '';
    }
  }, [massivePageFontSize]);

  return (
    <div
      className={`theme-${themeName} window bundled-fonts`}
      style={{
        '--base-font-size': `var(--${fontSize}-font-size)`,
      }}
    >
      {children}
    </div>
  );
}
