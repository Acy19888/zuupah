/**
 * Notifications Screen
 */
import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView, Text,
  SafeAreaView, TouchableOpacity, Switch,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { COLORS } from '@constants/colors';
import { TYPOGRAPHY } from '@constants/typography';

interface NotifToggle {
  key: string;
  icon: string;
  label: string;
  desc: string;
  group: string;
}

const TOGGLES: NotifToggle[] = [
  // App notifications
  { key: 'newBooks',      icon: 'book-plus',        label: 'New Books',          desc: 'When new books are added to the store',       group: 'App' },
  { key: 'downloads',     icon: 'download',          label: 'Download Complete',  desc: 'When a book finishes downloading',             group: 'App' },
  { key: 'penUpdates',    icon: 'bluetooth',         label: 'Pen Firmware',       desc: 'When a firmware update is available',          group: 'App' },
  // Children & learning
  { key: 'childProgress', icon: 'chart-line',        label: 'Child Progress',     desc: 'Weekly summary of learning activity',          group: 'Learning' },
  { key: 'screenTime',    icon: 'timer',             label: 'Screen Time Alert',  desc: 'When daily limit is about to be reached',      group: 'Learning' },
  { key: 'achievements',  icon: 'trophy',            label: 'Achievements',       desc: 'When your child unlocks a new achievement',    group: 'Learning' },
  // Marketing
  { key: 'promotions',    icon: 'tag',               label: 'Deals & Promotions', desc: 'Special offers and discounts',                 group: 'Email' },
  { key: 'newsletter',    icon: 'email-newsletter',  label: 'Newsletter',         desc: 'Monthly tips for learning with Zuupah',        group: 'Email' },
];

const NotificationsScreen: React.FC<any> = ({ navigation }) => {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    newBooks: true, downloads: true, penUpdates: true,
    childProgress: true, screenTime: true, achievements: true,
    promotions: false, newsletter: false,
  });
  const [saved, setSaved] = useState(false);

  const toggle = (key: string) =>
    setEnabled(prev => ({ ...prev, [key]: !prev[key] }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); navigation.goBack(); }, 900);
  };

  const groups = [...new Set(TOGGLES.map(t => t.group))];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.subtitle}>Choose which notifications you'd like to receive.</Text>
        </View>

        {groups.map(group => (
          <View key={group} style={styles.section}>
            <Text style={styles.sectionTitle}>{group}</Text>
            {TOGGLES.filter(t => t.group === group).map((item, idx, arr) => (
              <View
                key={item.key}
                style={[
                  styles.row,
                  idx === 0 && styles.rowFirst,
                  idx === arr.length - 1 && styles.rowLast,
                ]}
              >
                <View style={styles.rowLeft}>
                  <Icon name={item.icon as any} size={22} color={COLORS.beachBlue} style={styles.icon} />
                  <View style={styles.rowText}>
                    <Text style={styles.rowLabel}>{item.label}</Text>
                    <Text style={styles.rowDesc}>{item.desc}</Text>
                  </View>
                </View>
                <Switch
                  value={!!enabled[item.key]}
                  onValueChange={() => toggle(item.key)}
                  trackColor={{ false: COLORS.border, true: COLORS.beachBlue }}
                  thumbColor={COLORS.white}
                />
              </View>
            ))}
          </View>
        ))}

        {saved && (
          <View style={styles.successBanner}>
            <Text style={styles.successText}>✓ Notification preferences saved!</Text>
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
  section: { gap: 0 },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.xs, fontWeight: '700' as const,
    color: COLORS.lightText, textTransform: 'uppercase', letterSpacing: 1,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.white, paddingHorizontal: 14, paddingVertical: 12,
    borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: COLORS.border,
  },
  rowFirst: { borderTopWidth: 1, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  rowLast: { borderBottomLeftRadius: 12, borderBottomRightRadius: 12 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 12 },
  icon: { marginRight: 12 },
  rowText: { flex: 1 },
  rowLabel: { fontSize: TYPOGRAPHY.fontSize.base, fontWeight: '600' as const, color: COLORS.darkText },
  rowDesc: { fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.lightText, marginTop: 2 },
  successBanner: { backgroundColor: COLORS.success, borderRadius: 8, padding: 12 },
  successText: { color: COLORS.white, fontWeight: '600' as const, textAlign: 'center' },
  saveBtn: {
    backgroundColor: COLORS.beachBlue, borderRadius: 12,
    paddingVertical: 16, alignItems: 'center',
  },
  saveBtnText: { color: COLORS.white, fontSize: TYPOGRAPHY.fontSize.base, fontWeight: '700' as const },
});

export default NotificationsScreen;
