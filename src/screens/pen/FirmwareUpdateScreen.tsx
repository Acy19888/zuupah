/**
 * Firmware Update Screen
 * Check and install pen firmware updates
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  SafeAreaView,
} from 'react-native';
import Button from '@components/common/Button';
import Card from '@components/common/Card';
import { COLORS } from '@constants/colors';
import { TYPOGRAPHY } from '@constants/typography';

/**
 * FirmwareUpdateScreen Component
 * Displays firmware update information and installation options
 */
const FirmwareUpdateScreen: React.FC<any> = ({ navigation }) => {
  const [currentVersion] = useState('1.0.0');
  const [latestVersion] = useState('1.2.0');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);

  const hasUpdate = latestVersion !== currentVersion;

  const handleUpdateFirmware = async () => {
    setIsUpdating(true);

    try {
      // Simulate firmware update progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setUpdateProgress(i);
      }

      // Simulate completion
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsUpdating(false);
    } catch (error) {
      console.error('Firmware update failed:', error);
      setIsUpdating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Button
            title="← Back"
            onPress={() => navigation.goBack()}
            variant="outline"
            size="small"
            style={styles.backButton}
          />
          <Text style={styles.title}>Firmware Update</Text>
        </View>

        {hasUpdate ? (
          <View style={styles.content}>
            <Card variant="elevated" style={styles.updateCard}>
              <View style={styles.updateHeader}>
                <Text style={styles.updateIcon}>⬆️</Text>
                <View style={styles.updateInfo}>
                  <Text style={styles.updateTitle}>Update Available</Text>
                  <Text style={styles.updateSubtitle}>
                    {currentVersion} → {latestVersion}
                  </Text>
                </View>
              </View>
            </Card>

            <Card style={styles.detailsCard}>
              <Text style={styles.sectionTitle}>Release Notes</Text>
              <View style={styles.releaseNotes}>
                <Text style={styles.noteItem}>
                  • Improved Bluetooth connectivity and stability
                </Text>
                <Text style={styles.noteItem}>
                  • Enhanced battery performance
                </Text>
                <Text style={styles.noteItem}>
                  • Fixed audio synchronization issues
                </Text>
                <Text style={styles.noteItem}>
                  • Better handling of multiple device connections
                </Text>
              </View>
            </Card>

            {isUpdating && (
              <Card style={styles.progressCard}>
                <Text style={styles.progressTitle}>Updating Firmware...</Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${updateProgress}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>{updateProgress}%</Text>
                <Text style={styles.progressHint}>
                  Do not disconnect your pen during this process
                </Text>
              </Card>
            )}

            <View style={styles.actions}>
              <Button
                title={isUpdating ? 'Updating...' : 'Update Firmware'}
                onPress={handleUpdateFirmware}
                isLoading={isUpdating}
                disabled={isUpdating}
                fullWidth
                size="large"
              />
              <Button
                title="Release Notes"
                onPress={() => {}}
                variant="outline"
                fullWidth
                size="large"
              />
            </View>

            <View style={styles.info}>
              <Text style={styles.infoIcon}>ℹ️</Text>
              <Text style={styles.infoText}>
                Firmware updates require a stable Bluetooth connection. Ensure
                your pen is fully charged before proceeding.
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.content}>
            <Card variant="outlined" style={styles.upToDateCard}>
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
              <Text style={styles.upToDateTitle}>Firmware Up to Date</Text>
              <Text style={styles.upToDateSubtitle}>
                You're running the latest version {currentVersion}
              </Text>
            </Card>

            <View style={styles.info}>
              <Text style={styles.infoTitle}>Current Version</Text>
              <Text style={styles.versionText}>{currentVersion}</Text>
            </View>

            <Button
              title="Check Again"
              onPress={() => {}}
              variant="secondary"
              fullWidth
              style={styles.button}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: '700' as const,
    color: COLORS.darkText,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16,
  },
  updateCard: {
    backgroundColor: COLORS.morningYellow,
    padding: 16,
  },
  updateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  updateIcon: {
    fontSize: 32,
  },
  updateInfo: {
    flex: 1,
  },
  updateTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: '700' as const,
    color: COLORS.darkText,
  },
  updateSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.lightText,
    marginTop: 2,
  },
  detailsCard: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: '600' as const,
    color: COLORS.darkText,
    marginBottom: 12,
  },
  releaseNotes: {
    gap: 8,
  },
  noteItem: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.lightText,
    lineHeight: 18,
  },
  progressCard: {
    padding: 16,
    backgroundColor: COLORS.surfaceLight,
  },
  progressTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: '600' as const,
    color: COLORS.darkText,
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.beachBlue,
  },
  progressText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: '700' as const,
    color: COLORS.beachBlue,
    marginBottom: 8,
  },
  progressHint: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.lightText,
  },
  upToDateCard: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: COLORS.surfaceLight,
  },
  checkmark: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkmarkText: {
    fontSize: 28,
    color: COLORS.white,
    fontWeight: '700' as const,
  },
  upToDateTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '700' as const,
    color: COLORS.darkText,
    marginBottom: 4,
  },
  upToDateSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.lightText,
    textAlign: 'center',
  },
  info: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  infoIcon: {
    fontSize: 20,
  },
  infoText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.lightText,
    lineHeight: 18,
  },
  infoTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '600' as const,
    color: COLORS.lightText,
  },
  versionText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '700' as const,
    color: COLORS.darkText,
    marginTop: 4,
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
  button: {
    marginTop: 8,
  },
});

export default FirmwareUpdateScreen;
