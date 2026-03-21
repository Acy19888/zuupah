/**
 * useI18n Hook
 * Returns a t() translation function reactive to the current language setting.
 */
import { useLanguageStore, getTranslations, TranslationKey } from '@store/languageStore';

export const useI18n = () => {
  const { language, setLanguage } = useLanguageStore();
  const translations = getTranslations(language);

  const t = (key: TranslationKey): string => {
    return (translations as any)[key] ?? key;
  };

  return { t, language, setLanguage };
};

export default useI18n;
