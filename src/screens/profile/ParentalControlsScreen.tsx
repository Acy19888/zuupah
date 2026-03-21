/**
 * Parental Controls Screen
 */
import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView, Text,
  SafeAreaView, TouchableOpacity, Switch,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useAppTheme } from '@hooks/useAppTheme';
import { COLORS } from '@constants/colors';
import { TYPOGRAPHY } from '@constants/typography';

type AgeGroup  = '2-3' | '4-5' | '6-7' | 'all';
type ReadingTime = '30' | '60' | '90' | '120' | 'unlimited';

const AGE_GROUPS = [
  { value: '2-3' as AgeGroup, label: 'Ages 2–3', desc: 'Toddler basics',  icon: 'baby-face' },
  { value: '4-5' as AgeGroup, label: 'Ages 4–5', desc: 'Early learners',  icon: 'human-child' },
  { value: '6-7' as AgeGroup, label: 'Ages 6–7', desc: 'School ready',    icon: 'school' },
  { value: 'all' as AgeGroup, label: 'All Ages',  desc: 'No age filter',   icon: 'account-group' },
];

const READING_TIME_OPTIONS = [
  { value: '30' as ReadingTime, label: '30 min' },
  { value: '60' as ReadingTime, label: '1 hour' },
  { value: '90' as ReadingTime, label: '1.5 hrs' },
  { value: '120' as ReadingTime, label: '2 hours' },
  { value: 'unlimited' as ReadingTime, label: 'No limit' },
];

const ParentalControlsScreen: React.FC<any> = ({ navigation }) => {
  const { tc } = useAppTheme();
  const [ageGroup, setAgeGroup]             = useState<AgeGroup>('all');
  const [readingTime, setReadingTime]       = useState<ReadingTime>('unlimited');
  const [bedtimeEnabled, setBedtimeEnabled] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); navigation.goBack(); }, 900);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tc.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: tc.text }]}>Parental Controls</Text>
          <Text style={[styles.subtitle, { color: tc.textSecondary }]}>Manage what your child can access in the app.</Text>
        </View>

        {/* Age Filter */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: tc.textSecondary }]}>CONTENT AGE FILTER</Text>
          <View style={styles.ageGrid}>
            {AGE_GROUPS.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.ageCard,
                  { backgroundColor: tc.card, borderColor: tc.border },
                  ageGroup === opt.value && styles.ageCardActive,
                ]}
                onPress={() => setAgeGroup(opt.value)}
              >
                <Icon name={opt.icon as any} size={26} color={ageGroup === opt.value ? COLORS.white : COLORS.beachBlue} />
                <Text style={[styles.ageLabel, { color: tc.text }, ageGroup === opt.value && { color: COLORS.white }]}>{opt.label}</Text>
                <Text style={[styles.ageDesc, { color: tc.textSecondary }, ageGroup === opt.value && { color: 'rgba(255,255,255,0.75)' }]}>{opt.desc}</Text>
                {ageGroup === opt.value && (
                  <View style={styles.checkBadge}><Icon name="check" size={12} color={COLORS.white} /></View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Reading Time */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: tc.textSecondary }]}>DAILY READING TIME LIMIT</Text>
          <View style={styles.chipRow}>
            {READING_TIME_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.chip,
                  { borderColor: tc.border, backgroundColor: tc.card },
                  readingTime === opt.value && { borderColor: COLORS.beachBlue, backgroundColor: COLORS.softPillowBlue },
                ]}
                onPress={() => setReadingTime(opt.value)}
              >
                <Text style={[styles.chipText, { color: tc.textSecondary }, readingTime === opt.value && { color: COLORS.beachBlue }]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Toggles */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: tc.textSecondary }]}>RESTRICTIONS</Text>

          {[
            { icon: 'weather-night', label: 'Bedtime Restrictions', desc: 'Block app after 8:00 PM', value: bedtimeEnabled, setter: setBedtimeEnabled },
          ].map(item => (
            <View key={item.label} style={[styles.toggleRow, { backgroundColor: tc.card, borderColor: tc.border }]}>
              <View style={styles.toggleInfo}>
                <Icon name={item.icon as any} size={22} color={COLORS.beachBlue} style={styles.toggleIcon} />
                <View>
                  <Text style={[styles.toggleLabel, { color: tc.text }]}>{item.label}</Text>
                  <Text style={[styles.toggleDesc, { color: tc.textSecondary }]}>{item.desc}</Text>
                </View>
              </View>
              <Switch value={item.value} onValueChange={item.setter}
                trackColor={{ false: tc.border, true: COLORS.beachBlue }} thumbColor={COLORS.white} />
            </View>
          ))}
        </View>

        {saved && (
          <View style={styles.successBanner}><Text style={styles.successText}>✓ Parental controls saved!</Text></View>
        )}

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingVertical: 24, gap: 24 },
  header: { marginBottom: 4 },
  backBtn: { marginBottom: 12 },
  backText: { fontSize: TYPOGRAPHY.fontSize.base, color: COLORS.beachBlue, fontFamily: 'Nunito-SemiBold' },
  title: { fontSize: TYPOGRAPHY.fontSize['2xl'], fontFamily: 'Nunito-Bold', marginBottom: 6 },
  subtitle: { fontSize: TYPOGRAPHY.fontSize.sm, lineHeight: 20 },
  section: { gap: 12 },
  sectionTitle: { fontSize: TYPOGRAPHY.fontSize.xs, fontFamily: 'Nunito-Bold', letterSpacing: 1 },
  ageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  ageCard: { width: '47%', borderRadius: 12, borderWidth: 2, padding: 14, alignItems: 'center', gap: 6, position: 'relative' },
  ageCardActive: { backgroundColor: COLORS.beachBlue, borderColor: COLORS.beachBlue },
  ageLabel: { fontSize: TYPOGRAPHY.fontSize.sm, fontFamily: 'Nunito-Bold' },
  ageDesc: { fontSize: TYPOGRAPHY.fontSize.xs },
  checkBadge: { position: 'absolute', top: 8, right: 8, width: 18, height: 18, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5 },
  chipText: { fontSize: TYPOGRAPHY.fontSize.sm, fontFamily: 'Nunito-SemiBold' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 12, borderWidth: 1, padding: 14 },
  toggleInfo: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 12 },
  toggleIcon: { marginRight: 12 },
  toggleLabel: { fontSize: TYPOGRAPHY.fontSize.base, fontFamily: 'Nunito-SemiBold' },
  toggleDesc: { fontSize: TYPOGRAPHY.fontSize.xs, marginTop: 2 },
  successBanner: { backgroundColor: COLORS.success, borderRadius: 8, padding: 12 },
  successText: { color: COLORS.white, fontFamily: 'Nunito-SemiBold', textAlign: 'center' },
  saveBtn: { backgroundColor: COLORS.beachBlue, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  saveBtnText: { color: COLORS.white, fontSize: TYPOGRAPHY.fontSize.base, fontFamily: 'Nunito-Bold' },
});

export default ParentalControlsScreen;
