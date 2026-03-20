/**
 * Appearance Screen
 */
import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView, Text,
  SafeAreaView, TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { COLORS } from '@constants/colors';
import { TYPOGRAPHY } from '@constants/typography';

type Theme = 'light' | 'dark' | 'auto';
type TextSize = 'small' | 'medium' | 'large';

const AppearanceScreen: React.FC<any> = ({ navigation }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [textSize, setTextSize] = useState<TextSize>('medium');
  const [saved, setSaved] = useState(false);

  const themeOptions: { value: Theme; label: string; icon: string; desc: string }[] = [
    { value: 'light', label: 'Light', icon: 'white-balance-sunny', desc: 'Classic bright look' },
    { value: 'dark',  label: 'Dark',  icon: 'moon-waning-crescent', desc: 'Easy on the eyes at night' },
    { value: 'auto',  label: 'Auto',  icon: 'brightness-auto', desc: 'Follows your device setting' },
  ];

  const sizeOptions: { value: TextSize; label: string; size: number }[] = [
    { value: 'small',  label: 'Small',  size: 13 },
    { value: 'medium', label: 'Medium', size: 16 },
    { value: 'large',  label: 'Large',  size: 20 },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      navigation.goBack();
    }, 900);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Appearance</Text>
        </View>

        {/* Theme */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Theme</Text>
          <View style={styles.optionGrid}>
            {themeOptions.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.themeCard, theme === opt.value && styles.themeCardActive]}
                onPress={() => setTheme(opt.value)}
              >
                <Icon
                  name={opt.icon as any}
                  size={28}
                  color={theme === opt.value ? COLORS.white : COLORS.beachBlue}
                />
                <Text style={[styles.themeLabel, theme === opt.value && styles.themeLabelActive]}>
                  {opt.label}
                </Text>
                <Text style={[styles.themeDesc, theme === opt.value && { color: 'rgba(255,255,255,0.8)' }]}>
                  {opt.desc}
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
          <Text style={styles.sectionTitle}>Text Size</Text>
          <View style={styles.sizeRow}>
            {sizeOptions.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.sizeBtn, textSize === opt.value && styles.sizeBtnActive]}
                onPress={() => setTextSize(opt.value)}
              >
                <Text style={[
                  styles.sizeBtnText,
                  { fontSize: opt.size },
                  textSize === opt.value && styles.sizeBtnTextActive,
                ]}>
                  Aa
                </Text>
                <Text style={[styles.sizeLabel, textSize === opt.value && styles.sizeLabelActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preview</Text>
          <View style={[
            styles.previewCard,
            theme === 'dark' && styles.previewCardDark,
          ]}>
            <Text style={[
              styles.previewTitle,
              theme === 'dark' && { color: COLORS.white },
              textSize === 'small' ? { fontSize: 14 } : textSize === 'large' ? { fontSize: 20 } : {},
            ]}>
              Leo the Lion
            </Text>
            <Text style={[
              styles.previewBody,
              theme === 'dark' && { color: 'rgba(255,255,255,0.7)' },
              textSize === 'small' ? { fontSize: 12 } : textSize === 'large' ? { fontSize: 16 } : {},
            ]}>
              Leo lives in the savanna and loves to roar!
            </Text>
          </View>
        </View>

        {saved && (
          <View style={styles.successBanner}>
            <Text style={styles.successText}>✓ Appearance saved!</Text>
          </View>
        )}

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: 20, paddingVertical: 24, gap: 24 },
  header: { marginBottom: 8 },
  backBtn: { marginBottom: 12 },
  backText: { fontSize: TYPOGRAPHY.fontSize.base, color: COLORS.beachBlue, fontWeight: '600' as const },
  title: { fontSize: TYPOGRAPHY.fontSize['2xl'], fontWeight: '700' as const, color: COLORS.darkText },
  section: { gap: 12 },
  sectionTitle: { fontSize: TYPOGRAPHY.fontSize.sm, fontWeight: '700' as const, color: COLORS.lightText, textTransform: 'uppercase' },
  optionGrid: { gap: 10 },
  themeCard: {
    borderRadius: 12, borderWidth: 2, borderColor: COLORS.border,
    backgroundColor: COLORS.white, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 12, position: 'relative',
  },
  themeCardActive: { backgroundColor: COLORS.beachBlue, borderColor: COLORS.beachBlue },
  themeLabel: { fontSize: TYPOGRAPHY.fontSize.base, fontWeight: '600' as const, color: COLORS.darkText, flex: 1 },
  themeLabelActive: { color: COLORS.white },
  themeDesc: { fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.lightText },
  checkBadge: {
    position: 'absolute', top: 10, right: 10,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center', alignItems: 'center',
  },
  sizeRow: { flexDirection: 'row', gap: 10 },
  sizeBtn: {
    flex: 1, borderRadius: 10, borderWidth: 2, borderColor: COLORS.border,
    backgroundColor: COLORS.white, padding: 12, alignItems: 'center', gap: 4,
  },
  sizeBtnActive: { borderColor: COLORS.beachBlue, backgroundColor: COLORS.softPillowBlue },
  sizeBtnText: { fontWeight: '700' as const, color: COLORS.lightText },
  sizeBtnTextActive: { color: COLORS.beachBlue },
  sizeLabel: { fontSize: 11, color: COLORS.lightText, fontWeight: '500' as const },
  sizeLabelActive: { color: COLORS.beachBlue },
  previewCard: {
    backgroundColor: COLORS.white, borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: COLORS.border, gap: 6,
  },
  previewCardDark: { backgroundColor: '#2d3748', borderColor: '#4a5568' },
  previewTitle: { fontSize: 16, fontWeight: '700' as const, color: COLORS.darkText },
  previewBody: { fontSize: 14, color: COLORS.lightText, lineHeight: 20 },
  successBanner: { backgroundColor: COLORS.success, borderRadius: 8, padding: 12 },
  successText: { color: COLORS.white, fontWeight: '600' as const, textAlign: 'center' },
  saveBtn: {
    backgroundColor: COLORS.beachBlue, borderRadius: 12,
    paddingVertical: 16, alignItems: 'center',
  },
  saveBtnText: { color: COLORS.white, fontSize: TYPOGRAPHY.fontSize.base, fontWeight: '700' as const },
});

export default AppearanceScreen;
