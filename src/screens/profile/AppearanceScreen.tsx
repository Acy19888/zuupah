/**
 * Appearance Screen — theme and text size only
 */
import React from 'react';
import {
  View, StyleSheet, ScrollView, Text,
  SafeAreaView, TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useThemeStore, AppTheme, TextSize } from '@store/themeStore';
import { useAppTheme } from '@hooks/useAppTheme';
import { useI18n } from '@hooks/useI18n';
import { COLORS } from '@constants/colors';
import { TYPOGRAPHY } from '@constants/typography';

const AppearanceScreen: React.FC<any> = ({ navigation }) => {
  const { theme, textSize, setTheme, setTextSize } = useThemeStore();
  const [saved, setSaved] = React.useState(false);
  const { tc } = useAppTheme();
  const { t } = useI18n();

  const themeOptions: { value: AppTheme; label: string; icon: string; descKey: 'lightDesc' | 'darkDesc' | 'autoDesc' }[] = [
    { value: 'light', label: t('light'), icon: 'white-balance-sunny',  descKey: 'lightDesc' },
    { value: 'dark',  label: t('dark'),  icon: 'moon-waning-crescent', descKey: 'darkDesc'  },
    { value: 'auto',  label: t('auto'),  icon: 'brightness-auto',      descKey: 'autoDesc'  },
  ];

  const sizeOptions: { value: TextSize; labelKey: 'small' | 'medium' | 'large'; size: number }[] = [
    { value: 'small',  labelKey: 'small',  size: 13 },
    { value: 'medium', labelKey: 'medium', size: 16 },
    { value: 'large',  labelKey: 'large',  size: 20 },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); navigation.goBack(); }, 900);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tc.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>{t('back')}</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: tc.text }]}>{t('appearance')}</Text>
        </View>

        {/* Theme */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: tc.textSecondary }]}>{t('theme').toUpperCase()}</Text>
          <View style={styles.optionGrid}>
            {themeOptions.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.themeCard,
                  { backgroundColor: tc.card, borderColor: tc.border },
                  theme === opt.value && styles.themeCardActive,
                ]}
                onPress={() => setTheme(opt.value)}
              >
                <Icon name={opt.icon as any} size={28} color={theme === opt.value ? COLORS.white : COLORS.beachBlue} />
                <Text style={[styles.themeLabel, { color: tc.text }, theme === opt.value && { color: COLORS.white }]}>
                  {opt.label}
                </Text>
                <Text style={[styles.themeDesc, { color: tc.textSecondary }, theme === opt.value && { color: 'rgba(255,255,255,0.8)' }]}>
                  {t(opt.descKey)}
                </Text>
                {theme === opt.value && (
                  <View style={styles.checkBadge}>
                    <Icon name="check" size={14} color={COLORS.white} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Text size */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: tc.textSecondary }]}>{t('textSize').toUpperCase()}</Text>
          <View style={styles.sizeRow}>
            {sizeOptions.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.sizeBtn,
                  { backgroundColor: tc.card, borderColor: tc.border },
                  textSize === opt.value && styles.sizeBtnActive,
                ]}
                onPress={() => setTextSize(opt.value)}
              >
                <Text style={[styles.sizeBtnText, { fontSize: opt.size, color: tc.textSecondary }, textSize === opt.value && { color: COLORS.beachBlue }]}>
                  Aa
                </Text>
                <Text style={[styles.sizeLabel, { color: tc.textSecondary }, textSize === opt.value && { color: COLORS.beachBlue }]}>
                  {t(opt.labelKey)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Live Preview */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: tc.textSecondary }]}>{t('preview').toUpperCase()}</Text>
          <View style={[styles.previewCard, { backgroundColor: tc.card, borderColor: tc.border }]}>
            <Text style={[styles.previewTitle, { color: tc.text }, textSize === 'small' ? { fontSize: 14 } : textSize === 'large' ? { fontSize: 20 } : { fontSize: 16 }]}>
              Leo the Lion
            </Text>
            <Text style={[styles.previewBody, { color: tc.textSecondary }, textSize === 'small' ? { fontSize: 12 } : textSize === 'large' ? { fontSize: 16 } : { fontSize: 14 }]}>
              Leo lives in the savanna and loves to roar at the sunrise! 🦁
            </Text>
          </View>
        </View>

        {saved && (
          <View style={styles.successBanner}>
            <Text style={styles.successText}>{t('appearanceSaved')}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>{t('saveChanges')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingVertical: 24, gap: 24 },
  header: { marginBottom: 8 },
  backBtn: { marginBottom: 12 },
  backText: { fontSize: TYPOGRAPHY.fontSize.base, color: COLORS.beachBlue, fontFamily: 'Nunito-SemiBold' },
  title: { fontSize: TYPOGRAPHY.fontSize['2xl'], fontFamily: 'Nunito-Bold' },
  section: { gap: 12 },
  sectionTitle: { fontSize: TYPOGRAPHY.fontSize.xs, fontFamily: 'Nunito-Bold', letterSpacing: 1 },
  optionGrid: { gap: 10 },
  themeCard: {
    borderRadius: 12, borderWidth: 2, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 12, position: 'relative',
  },
  themeCardActive: { backgroundColor: COLORS.beachBlue, borderColor: COLORS.beachBlue },
  themeLabel: { fontSize: TYPOGRAPHY.fontSize.base, fontFamily: 'Nunito-SemiBold', flex: 1 },
  themeDesc: { fontSize: TYPOGRAPHY.fontSize.xs },
  checkBadge: {
    position: 'absolute', top: 10, right: 10,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center', alignItems: 'center',
  },
  sizeRow: { flexDirection: 'row', gap: 10 },
  sizeBtn: { flex: 1, borderRadius: 10, borderWidth: 2, padding: 12, alignItems: 'center', gap: 4 },
  sizeBtnActive: { borderColor: COLORS.beachBlue, backgroundColor: COLORS.softPillowBlue },
  sizeBtnText: { fontFamily: 'Nunito-Bold' },
  sizeLabel: { fontSize: 11, fontFamily: 'Nunito-Medium' },
  previewCard: { borderRadius: 12, padding: 16, borderWidth: 1, gap: 6 },
  previewTitle: { fontFamily: 'Nunito-Bold' },
  previewBody: { lineHeight: 20 },
  successBanner: { backgroundColor: COLORS.success, borderRadius: 8, padding: 12 },
  successText: { color: COLORS.white, fontFamily: 'Nunito-SemiBold', textAlign: 'center' },
  saveBtn: { backgroundColor: COLORS.beachBlue, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  saveBtnText: { color: COLORS.white, fontSize: TYPOGRAPHY.fontSize.base, fontFamily: 'Nunito-Bold' },
});

export default AppearanceScreen;
