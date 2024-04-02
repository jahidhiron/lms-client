import type { LocaleType, NamespacesType } from 'i18n';
import type { Translate, TranslationQuery } from 'next-translate';
import translationN from 'next-translate/useTranslation';

function useTranslation<K extends NamespacesType>(namespace: K) {
  const { t, lang } = translationN(namespace);
  const customT =
    <K extends NamespacesType>(t: Translate) =>
    (
      i18nKey: LocaleType<K>,
      query?: TranslationQuery | null | undefined,
      options?:
        | {
            returnObjects?: boolean | undefined;
            fallback?: string | string[] | undefined;
            default?: string | undefined;
            ns?: string | undefined;
          }
        | undefined
    ): string =>
      t(i18nKey as string, query, options)!;
  return { t: customT<K>(t), lang };
}

export type CustomTranslate = ReturnType<typeof useTranslation>['t'];
export default useTranslation;
