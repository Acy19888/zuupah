/**
 * Pen Screen
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { useBluetooth } from '@hooks/useBluetooth';
import { useAppTheme } from '@hooks/useAppTheme';
import Button from '@components/common/Button';
import Card from '@components/common/Card';
import LoadingSpinner from '@components/common/LoadingSpinner';
import { PenConnectionStatus } from '@types/pen';
import { COLORS } from '@constants/colors';
import { TYPOGRAPHY } from '@constants/typography';

const PenScreen: React.FC<any> = ({ navigation }) => {
  const {
    connectedPen, availableDevices, connectionStatus, isScanning,
    penStatus, transferProgress,
    handleStartScan, handleStopScan, handleConnectToPen, handleDisconnectPen,
  } = useBluetooth();
  const { tc } = useAppTheme();

  useEffect(() => {
    return () => { if (isScanning) handleStopScan(); };
  }, [isScanning, handleStopScan]);

  const renderConnectionStatus = () => {
    switch (connectionStatus) {
      case PenConnectionStatus.CONNECTED:
        return (
          <View style={[styles.connectedCard, { backgroundColor: tc.surface }]}>
            <View style={styles.statusIndicator}>
              <View style={styles.activeDot} />
              <Text style={styles.statusText}>Connected</Text>
            </View>
            {connectedPen && (
              <View style={styles.penInfo}>
                <Text style={[styles.penName, { color: tc.text }]}>{connectedPen.name}</Text>
                <Text style={[styles.penSerial, { color: tc.textSecondary }]}>Serial: {connectedPen.serialNumber}</Text>
              </View>
            )}
            {penStatus && (
              <View style={[styles.penStats, { borderColor: tc.border }]}>
                <View style={styles.statItem}>
                  <Text style={[styles.statLabel, { color: tc.textSecondary }]}>Battery</Text>
                  <Text style={[styles.statValue, { color: tc.text }]}>{penStatus.batteryLevel}%</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statLabel, { color: tc.textSecondary }]}>Firmware</Text>
                  <Text style={[styles.statValue, { color: tc.text }]}>{penStatus.firmwareVersion || 'Unknown'}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statLabel, { color: tc.textSecondary }]}>Storage</Text>
                  <Text style={[styles.statValue, { color: tc.text }]}>
                    {Math.round(penStatus.storageUsed / 1024 / 1024)}MB / {Math.round(penStatus.storageTotal / 1024 / 1024)}MB
                  </Text>
                </View>
              </View>
            )}
            <View style={styles.actions}>
              <Button title="Check for Updates" onPress={() => navigation.navigate('FirmwareUpdate')} size="small" variant="secondary" fullWidth style={styles.button} />
              <Button title="Disconnect" onPress={handleDisconnectPen} size="small" variant="danger" fullWidth style={styles.button} />
            </View>
          </View>
        );
      case PenConnectionStatus.SCANNING:
        return (
          <View style={[styles.scanningCard, { backgroundColor: tc.surface }]}>
            <LoadingSpinner text="Searching for Pens..." size="small" />
            <Button title="Cancel Scan" onPress={handleStopScan} size="small" variant="danger" fullWidth style={styles.button} />
          </View>
        );
      case PenConnectionStatus.CONNECTING:
        return (
          <View style={[styles.scanningCard, { backgroundColor: tc.surface }]}>
            <LoadingSpinner text="Connecting..." size="small" />
          </View>
        );
      default:
        return (
          <View style={[styles.notConnectedCard, { backgroundColor: tc.surface }]}>
            <Text style={styles.notConnectedIcon}>📡</Text>
            <Text style={[styles.notConnectedTitle, { color: tc.text }]}>No Pen Connected</Text>
            <Text style={[styles.notConnectedText, { color: tc.textSecondary }]}>
              Make sure your Zuupah Pen is turned on and within range
            </Text>
            <Button title={isScanning ? 'Scanning...' : 'Search for Pen'} onPress={handleStartScan} disabled={isScanning} fullWidth style={styles.button} />
          </View>
        );
    }
  };

  const renderAvailableDevices = () => {
    if (availableDevices.length === 0) return null;
    return (
      <View style={styles.devicesSection}>
        <Text style={[styles.sectionTitle, { color: tc.text }]}>Available Devices</Text>
        {availableDevices.map(device => (
          <TouchableOpacity
            key={device.id}
            style={[styles.deviceItem, { backgroundColor: tc.card, borderColor: tc.border }]}
            onPress={() => handleConnectToPen(device.id, device.name)}
          >
            <View style={styles.deviceInfo}>
              <Text style={[styles.deviceName, { color: tc.text }]}>{device.name}</Text>
              <Text style={[styles.deviceSignal, { color: tc.textSecondary }]}>Signal: {device.rssi} dBm</Text>
            </View>
            <Text style={styles.connectArrow}>→</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderTransfers = () => {
    if (transferProgress.size === 0) return null;
    return (
      <View style={styles.transfersSection}>
        <Text style={[styles.sectionTitle, { color: tc.text }]}>Active Transfers</Text>
        {Array.from(transferProgress.values()).map(transfer => (
          <Card key={transfer.bookId} style={styles.transferCard}>
            <Text style={[styles.transferTitle, { color: tc.text }]}>Book ID: {transfer.bookId}</Text>
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { backgroundColor: tc.border }]}>
                <View style={[styles.progressFill, { width: `${transfer.progress}%` as any }]} />
              </View>
              <Text style={[styles.progressText, { color: tc.text }]}>{transfer.progress}%</Text>
            </View>
            <Text style={[styles.transferStatus, { color: tc.textSecondary }]}>{transfer.status}</Text>
          </Card>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tc.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: tc.text }]}>Zuupah Pen</Text>
          <Text style={[styles.subtitle, { color: tc.textSecondary }]}>Connect & Transfer Books</Text>
        </View>
        {renderConnectionStatus()}
        {renderAvailableDevices()}
        {renderTransfers()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingVertical: 16 },
  title: { fontSize: TYPOGRAPHY.fontSize['2xl'], fontFamily: 'Nunito-Bold' },
  subtitle: { fontSize: TYPOGRAPHY.fontSize.sm, marginTop: 4 },
  connectedCard: { marginHorizontal: 16, marginVertical: 12, borderRadius: 12, padding: 16, borderLeftWidth: 4, borderLeftColor: COLORS.success },
  statusIndicator: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  activeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.success },
  statusText: { fontSize: TYPOGRAPHY.fontSize.base, fontFamily: 'Nunito-SemiBold', color: COLORS.success },
  penInfo: { marginBottom: 12 },
  penName: { fontSize: TYPOGRAPHY.fontSize.base, fontFamily: 'Nunito-SemiBold' },
  penSerial: { fontSize: TYPOGRAPHY.fontSize.xs, marginTop: 2 },
  penStats: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12, borderTopWidth: 1, borderBottomWidth: 1, marginVertical: 12 },
  statItem: { alignItems: 'center' },
  statLabel: { fontSize: TYPOGRAPHY.fontSize.xs, marginBottom: 4 },
  statValue: { fontSize: TYPOGRAPHY.fontSize.base, fontFamily: 'Nunito-SemiBold' },
  actions: { gap: 8, marginTop: 12 },
  button: { marginTop: 8 },
  notConnectedCard: { marginHorizontal: 16, marginVertical: 12, borderRadius: 12, padding: 24, alignItems: 'center' },
  notConnectedIcon: { fontSize: 48, marginBottom: 12 },
  notConnectedTitle: { fontSize: TYPOGRAPHY.fontSize.lg, fontFamily: 'Nunito-SemiBold', marginBottom: 8 },
  notConnectedText: { fontSize: TYPOGRAPHY.fontSize.sm, textAlign: 'center', marginBottom: 16, lineHeight: 20 },
  scanningCard: { marginHorizontal: 16, marginVertical: 12, borderRadius: 12, padding: 24, alignItems: 'center' },
  devicesSection: { marginHorizontal: 16, marginVertical: 12 },
  sectionTitle: { fontSize: TYPOGRAPHY.fontSize.base, fontFamily: 'Nunito-SemiBold', marginBottom: 8 },
  deviceItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 8 },
  deviceInfo: { flex: 1 },
  deviceName: { fontSize: TYPOGRAPHY.fontSize.base, fontFamily: 'Nunito-SemiBold' },
  deviceSignal: { fontSize: TYPOGRAPHY.fontSize.xs, marginTop: 2 },
  connectArrow: { fontSize: TYPOGRAPHY.fontSize.lg, color: COLORS.beachBlue },
  transfersSection: { marginHorizontal: 16, marginVertical: 12 },
  transferCard: { marginBottom: 8 },
  transferTitle: { fontSize: TYPOGRAPHY.fontSize.sm, fontFamily: 'Nunito-SemiBold', marginBottom: 8 },
  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  progressBar: { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.beachBlue },
  progressText: { fontSize: TYPOGRAPHY.fontSize.xs, fontFamily: 'Nunito-SemiBold', minWidth: 40 },
  transferStatus: { fontSize: TYPOGRAPHY.fontSize.xs, marginTop: 4 },
});

export default PenScreen;
