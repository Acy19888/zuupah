/**
 * Language Screen
 * Choose app language: English, Deutsch, Español, 中文
 */
import React from 'react';
import {
  View, StyleSheet, ScrollView, Text,
  SafeAreaView, TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useLanguageStore, Language, LANGUAGE_LABELS } from '@store/languageStore';
import { useAppTheme } from '@hooks/useAppTheme';
import { useI18n } from '@hooks/useI18n';
import { COLORS } from '@constants/colors';
import { TYPOGRAPHY } from '@constants/typography';

const LANGUAGE_DESCS: Record<Language, string> = {
  en: 'English',
  de: 'German / Deutsch',
  es: 'Spanish / Español',
  zh: 'Chinese / 中文',
};

const LanguageScreen: React.FC<any> = ({ navigation }) => {
  const { language, setLanguage } = useLanguageStore();
  const { tc } = useAppTheme();
  const { t } = useI18n();

  const languages: Language[] = ['en', 'de', 'es', 'zh'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tc.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>{t('back')}</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: tc.text }]}>{t('language')}</Text>
          <Text style={[styles.subtitle, { color: tc.textSecondary }]}>
            Choose the language for the app
          </Text>
        </View>

        <View style={styles.list}>
          {languages.map(lang => {
            const isActive = language === lang;
            return (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.row,
                  { backgroundColor: tc.card, borderColor: isActive ? COLORS.beachBlue : tc.border },
                  isActive && styles.rowActive,
                ]}
                onPress={() => setLanguage(lang)}
                activeOpacity={0.7}
              >
                <View style={styles.rowLeft}>
                  <Text style={styles.flag}>
                    {LANGUAGE_LABELS[lang].split(' ')[0]}
                  </Text>
                  <View style={styles.rowText}>
                    <Text style={[styles.langName, { color: isActive ? COLORS.beachBlue : tc.text }]}>
                      {LANGUAGE_LABELS[lang].split(' ').slice(1).join(' ')}
                    </Text>
                    <Text style={[styles.langDesc, { color: tc.textSecondary }]}>
                      {LANGUAGE_DESCS[lang]}
                    </Text>
                  </View>
                </View>
                {isActive && (
                  <View style={styles.checkCircle}>
                    <Icon name="check" size={16} color={COLORS.white} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingVertical: 24, gap: 24 },
  header: { gap: 6, marginBottom: 8 },
  backBtn: { marginBottom: 12 },
  backText: { fontSize: TYPOGRAPHY.fontSize.base, color: COLORS.beachBlue, fontFamily: 'Nunito-SemiBold' },
  title: { fontSize: TYPOGRAPHY.fontSize['2xl'], fontFamily: 'Nunito-Bold' },
  subtitle: { fontSize: TYPOGRAPHY.fontSize.sm },
  list: { gap: 12 },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 16, paddingHorizontal: 16,
    borderRadius: 12, borderWidth: 2,
  },
  rowActive: { borderColor: COLORS.beachBlue },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  flag: { fontSize: 28 },
  rowText: { gap: 2 },
  langName: { fontSize: TYPOGRAPHY.fontSize.base, fontFamily: 'Nunito-Bold' },
  langDesc: { fontSize: TYPOGRAPHY.fontSize.xs },
  checkCircle: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: COLORS.beachBlue,
    justifyContent: 'center', alignItems: 'center',
  },
});

export default LanguageScreen;
