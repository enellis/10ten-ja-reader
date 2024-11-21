import { type Signal } from '@preact/signals';
import browser from 'webextension-polyfill';

export type TranslateFunctionType = (
  key: string,
  substitutions?: string | Array<string>
) => string;

// This property is used only with the polyfill, as we don't support changing
// the locale dynamically in the browser.
export const locale: Signal<'en' | 'ja' | 'zh_CN'> | undefined = undefined;

const t = browser.i18n.getMessage.bind(browser.i18n);
const langTag = browser.i18n.getMessage('lang_tag');

export function useLocale() {
  return { t, langTag };
}
