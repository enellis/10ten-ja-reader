import type { RenderableProps } from 'preact';
import { useEffect, useLayoutEffect } from 'preact/hooks';
import { useSelect } from 'react-cosmos/client';

import { locale } from '../common/i18n';
import { EmptyProps } from '../utils/type-helpers';

export default function OptionsDecorator({
  children,
}: RenderableProps<EmptyProps>) {
  const [selectLocale] = useSelect('locale', {
    options: ['en', 'ja', 'zh_CN'],
  });
  useEffect(() => {
    if (locale !== undefined) {
      locale.value = selectLocale;
    }
  }, [selectLocale]);

  // This is only temporary until we have converted all options to Preact at
  // which point we should be able to remove the CSS rules that hide the
  // contents until they are initialized.
  useLayoutEffect(() => {
    document.documentElement.classList.add('initialized');
  }, []);

  return children;
}
