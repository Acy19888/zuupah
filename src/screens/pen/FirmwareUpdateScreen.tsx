/**
 * Firmware Update Screen
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, SafeAreaView } from 'react-native';
import { useAppTheme } from '@hooks/useAppTheme';
import Button from '@components/common/Button';
import Card from '@components/common/Card';
import { COLORS } from '@constants/colors';
import { TYPOGRAPHY } from '@constants/typography';

const FirmwareUpdateScreen: React.FC<any> = ({ navigation }) => {
  const [currentVersion] = useState('1.0.0');
  const [latestVersion]  = useState('1.2.0');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const { tc } = useAppTheme();
  const hasUpdate = latestVersion !== currentVersion;

  const handleUpdateFirmware = async () => {
    setIsUpdating(true);
    try {
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setUpdateProgress(i);
      }
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsUpdating(false);
    } catch (error) { console.error('Firmware update failed:', error); setIsUpdating(false); }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tc.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Button title="← Back" onPress={() => navigation.goBack()} variant="outline" size="small" style={styles.backButton} />
          <Text style={[styles.title, { color: tc.text }]}>Firmware Update</Text>
        </View>

        {hasUpdate ? (
          <View style={styles.content}>
            <Card variant="elevated" style={styles.updateCard}>
              <View style={styles.updateHeader}>
                <Text style={styles.updateIcon}>⬆️</Text>
                <View style={styles.updateInfo}>
                  <Text style={[styles.updateTitle, { color: tc.text }]}>Update Available</Text>
                  <Text style={[styles.updateSubtitle, { color: tc.textSecondary }]}>{currentVersion} → {latestVersion}</Text>
                </View>
              </View>
            </Card>

            <Card style={[styles.detailsCard, { backgroundColor: tc.card }]}>
              <Text style={[styles.sectionTitle, { color: tc.text }]}>Release Notes</Text>
              <View style={styles.releaseNotes}>
                {['Improved Bluetooth connectivity and stability','Enhanced battery performance','Fixed audio synchronization issues','Better handling of multiple device connections'].map((note, i) => (
                  <Text key={i} style={[styles.noteItem, { color: tc.textSecondary }]}>• {note}</Text>
                ))}
              </View>
            </Card>

            {isUpdating && (
              <Card style={[styles.progressCard, { backgroundColor: tc.surface }]}>
                <Text style={[styles.progressTitle, { color: tc.text }]}>Updating Firmware...</Text>
                <View style={[styles.progressBar, { backgroundColor: tc.border }]}>
                  <View style={[styles.progressFill, { width: `${updateProgress}%` as any }]} />
                </View>
                <Text style={styles.progressText}>{updateProgress}%</Text>
                <Text style={[styles.progressHint, { color: tc.textSecondary }]}>Do not disconnect your pen during this process</Text>
              </Card>
            )}

            <View style={styles.actions}>
              <Button title={isUpdating ? 'Updating...' : 'Update Firmware'} onPress={handleUpdateFirmware} isLoading={isUpdating} disabled={isUpdating} fullWidth size="large" />
              <Button title="Release Notes" onPress={() => {}} variant="outline" fullWidth size="large" />
            </View>

            <View style={[styles.info, { backgroundColor: tc.surface }]}>
              <Text style={styles.infoIcon}>ℹ️</Text>
              <Text style={[styles.infoText, { color: tc.textSecondary }]}>
                Firmware updates require a stable Bluetooth connection. Ensure your pen is fully charged before proceeding.
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.content}>
            <Card variant="outlined" style={[styles.upToDateCard, { backgroundColor: tc.surface }]}>
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
              <Text style={[styles.upToDateTitle, { color: tc.text }]}>Firmware Up to Date</Text>
              <Text style={[styles.upToDateSubtitle, { color: tc.textSecondary }]}>You're running the latest version {currentVersion}</Text>
            </Card>
            <View style={[styles.info, { backgroundColor: tc.surface }]}>
              <Text style={[styles.infoTitle, { color: tc.textSecondary }]}>Current Version</Text>
              <Text style={[styles.versionText, { color: tc.text }]}>{currentVersion}</Text>
            </View>
            <Button title="Check Again" onPress={() => {}} variant="secondary" fullWidth style={styles.button} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingVertical: 16, gap: 12 },
  backButton: { alignSelf: 'flex-start' },
  title: { fontSize: TYPOGRAPHY.fontSize['2xl'], fontFamily: 'Nunito-Bold' },
  content: { paddingHorizontal: 16, paddingVertical: 12, gap: 16 },
  updateCard: { backgroundColor: COLORS.morningYellow, padding: 16 },
  updateHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  updateIcon: { fontSize: 32 },
  updateInfo: { flex: 1 },
  updateTitle: { fontSize: TYPOGRAPHY.fontSize.base, fontFamily: 'Nunito-Bold' },
  updateSubtitle: { fontSize: TYPOGRAPHY.fontSize.sm, marginTop: 2 },
  detailsCard: { padding: 16 },
  sectionTitle: { fontSize: TYPOGRAPHY.fontSize.base, fontFamily: 'Nunito-SemiBold', marginBottom: 12 },
  releaseNotes: { gap: 8 },
  noteItem: { fontSize: TYPOGRAPHY.fontSize.sm, lineHeight: 18 },
  progressCard: { padding: 16 },
  progressTitle: { fontSize: TYPOGRAPHY.fontSize.base, fontFamily: 'Nunito-SemiBold', marginBottom: 12 },
  progressBar: { height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', backgroundColor: COLORS.beachBlue },
  progressText: { fontSize: TYPOGRAPHY.fontSize.base, fontFamily: 'Nunito-Bold', color: COLORS.beachBlue, marginBottom: 8 },
  progressHint: { fontSize: TYPOGRAPHY.fontSize.xs },
  upToDateCard: { alignItems: 'center', padding: 32 },
  checkmark: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.success, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  checkmarkText: { fontSize: 28, color: COLORS.white, fontFamily: 'Nunito-Bold' },
  upToDateTitle: { fontSize: TYPOGRAPHY.fontSize.lg, fontFamily: 'Nunito-Bold', marginBottom: 4 },
  upToDateSubtitle: { fontSize: TYPOGRAPHY.fontSize.sm, textAlign: 'center' },
  info: { borderRadius: 8, padding: 12, flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  infoIcon: { fontSize: 20 },
  infoText: { flex: 1, fontSize: TYPOGRAPHY.fontSize.sm, lineHeight: 18 },
  infoTitle: { fontSize: TYPOGRAPHY.fontSize.sm, fontFamily: 'Nunito-SemiBold' },
  versionText: { fontSize: TYPOGRAPHY.fontSize.lg, fontFamily: 'Nunito-Bold', marginTop: 4 },
  actions: { gap: 12, marginTop: 8 },
  button: { marginTop: 8 },
});

export default FirmwareUpdateScreen;
