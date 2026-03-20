/**
 * Parental Controls Screen
 */
import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView, Text,
  SafeAreaView, TouchableOpacity, Switch,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { COLORS } from '@constants/colors';
import { TYPOGRAPHY } from '@constants/typography';

type AgeGroup = '2-3' | '4-5' | '6-7' | 'all';
type ScreenTime = '30' | '60' | '90' | '120' | 'unlimited';

const AGE_GROUPS: { value: AgeGroup; label: string; desc: string; icon: string }[] = [
  { value: '2-3', label: 'Ages 2–3', desc: 'Toddler basics', icon: 'baby-face' },
  { value: '4-5', label: 'Ages 4–5', desc: 'Early learners', icon: 'human-child' },
  { value: '6-7', label: 'Ages 6–7', desc: 'School ready', icon: 'school' },
  { value: 'all',  label: 'All Ages', desc: 'No age filter', icon: 'account-group' },
];

const SCREEN_TIME_OPTIONS: { value: ScreenTime; label: string }[] = [
  { value: '30',       label: '30 min' },
  { value: '60',       label: '1 hour' },
  { value: '90',       label: '1.5 hrs' },
  { value: '120',      label: '2 hours' },
  { value: 'unlimited', label: 'No limit' },
];

const ParentalControlsScreen: React.FC<any> = ({ navigation }) => {
  const [ageGroup, setAgeGroup]           = useState<AgeGroup>('all');
  const [screenTime, setScreenTime]       = useState<ScreenTime>('unlimited');
  const [requireApproval, setRequireApproval] = useState(false);
  const [bedtimeEnabled, setBedtimeEnabled]   = useState(false);
  const [saved, setSaved] = useState(false);

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
          <Text style={styles.title}>Parental Controls</Text>
          <Text style={styles.subtitle}>Manage what your child can access in the app.</Text>
        </View>

        {/* Age Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content Age Filter</Text>
          <View style={styles.ageGrid}>
            {AGE_GROUPS.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.ageCard, ageGroup === opt.value && styles.ageCardActive]}
                onPress={() => setAgeGroup(opt.value)}
              >
                <Icon
                  name={opt.icon as any}
                  size={26}
                  color={ageGroup === opt.value ? COLORS.white : COLORS.beachBlue}
                />
                <Text style={[styles.ageLabel, ageGroup === opt.value && styles.ageLabelActive]}>
                  {opt.label}
                </Text>
                <Text style={[styles.ageDesc, ageGroup === opt.value && { color: 'rgba(255,255,255,0.75)' }]}>
                  {opt.desc}
                </Text>
                {ageGroup === opt.value && (
                  <View style={styles.checkBadge}>
                    <Icon name="check" size={12} color={COLORS.white} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Daily Screen Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Screen Time Limit</Text>
          <View style={styles.chipRow}>
            {SCREEN_TIME_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.chip, screenTime === opt.value && styles.chipActive]}
                onPress={() => setScreenTime(opt.value)}
              >
                <Text style={[styles.chipText, screenTime === opt.value && styles.chipTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Toggles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Restrictions</Text>

          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Icon name="cart-check" size={22} color={COLORS.beachBlue} style={styles.toggleIcon} />
              <View>
                <Text style={styles.toggleLabel}>Require Purchase Approval</Text>
                <Text style={styles.toggleDesc}>Ask parent before downloading paid books</Text>
              </View>
            </View>
            <Switch
              value={requireApproval}
              onValueChange={setRequireApproval}
              trackColor={{ false: COLORS.border, true: COLORS.beachBlue }}
              thumbColor={COLORS.white}
            />
          </View>

          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Icon name="weather-night" size={22} color={COLORS.beachBlue} style={styles.toggleIcon} />
              <View>
                <Text style={styles.toggleLabel}>Bedtime Restrictions</Text>
                <Text style={styles.toggleDesc}>Block app after 8:00 PM</Text>
              </View>
            </View>
            <Switch
              value={bedtimeEnabled}
              onValueChange={setBedtimeEnabled}
              trackColor={{ false: COLORS.border, true: COLORS.beachBlue }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>

        {saved && (
          <View style={styles.successBanner}>
            <Text style={styles.successText}>✓ Parental controls saved!</Text>
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
  header: { marginBottom: 4 },
  backBtn: { marginBottom: 12 },
  backText: { fontSize: TYPOGRAPHY.fontSize.base, color: COLORS.beachBlue, fontWeight: '600' as const },
  title: { fontSize: TYPOGRAPHY.fontSize['2xl'], fontWeight: '700' as const, color: COLORS.darkText, marginBottom: 6 },
  subtitle: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.lightText, lineHeight: 20 },
  section: { gap: 12 },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm, fontWeight: '700' as const,
    color: COLORS.lightText, textTransform: 'uppercase',
  },
  ageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  ageCard: {
    width: '47%', borderRadius: 12, borderWidth: 2, borderColor: COLORS.border,
    backgroundColor: COLORS.white, padding: 14, alignItems: 'center', gap: 6, position: 'relative',
  },
  ageCardActive: { backgroundColor: COLORS.beachBlue, borderColor: COLORS.beachBlue },
  ageLabel: { fontSize: TYPOGRAPHY.fontSize.sm, fontWeight: '700' as const, color: COLORS.darkText },
  ageLabelActive: { color: COLORS.white },
  ageDesc: { fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.lightText },
  checkBadge: {
    position: 'absolute', top: 8, right: 8,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center', alignItems: 'center',
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1.5, borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  chipActive: { borderColor: COLORS.beachBlue, backgroundColor: COLORS.softPillowBlue },
  chipText: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.lightText, fontWeight: '600' as const },
  chipTextActive: { color: COLORS.beachBlue },
  toggleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.white, borderRadius: 12, borderWidth: 1,
    borderColor: COLORS.border, padding: 14,
  },
  toggleInfo: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 12 },
  toggleIcon: { marginRight: 12 },
  toggleLabel: { fontSize: TYPOGRAPHY.fontSize.base, fontWeight: '600' as const, color: COLORS.darkText },
  toggleDesc: { fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.lightText, marginTop: 2 },
  successBanner: { backgroundColor: COLORS.success, borderRadius: 8, padding: 12 },
  successText: { color: COLORS.white, fontWeight: '600' as const, textAlign: 'center' },
  saveBtn: {
    backgroundColor: COLORS.beachBlue, borderRadius: 12,
    paddingVertical: 16, alignItems: 'center',
  },
  saveBtnText: { color: COLORS.white, fontSize: TYPOGRAPHY.fontSize.base, fontWeight: '700' as const },
});

export default ParentalControlsScreen;
