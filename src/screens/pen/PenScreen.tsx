/**
 * Pen Screen
 * Connect to Zuupah Pen and manage transfers
 */

import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useBluetooth } from '@hooks/useBluetooth';
import Button from '@components/common/Button';
import Card from '@components/common/Card';
import LoadingSpinner from '@components/common/LoadingSpinner';
import { PenConnectionStatus } from '@types/pen';
import { COLORS } from '@constants/colors';
import { TYPOGRAPHY } from '@constants/typography';

/**
 * PenScreen Component
 * Manages pen connectivity and book transfers
 */
const PenScreen: React.FC<any> = ({ navigation }) => {
  const {
    connectedPen,
    availableDevices,
    connectionStatus,
    isScanning,
    penStatus,
    transferProgress,
    handleStartScan,
    handleStopScan,
    handleConnectToPen,
    handleDisconnectPen,
  } = useBluetooth();

  useEffect(() => {
    return () => {
      if (isScanning) {
        handleStopScan();
      }
    };
  }, [isScanning, handleStopScan]);

  const renderConnectionStatus = () => {
    switch (connectionStatus) {
      case PenConnectionStatus.CONNECTED:
        return (
          <View style={styles.connectedCard}>
            <View style={styles.statusIndicator}>
              <View style={styles.activeDot} />
              <Text style={styles.statusText}>Connected</Text>
            </View>
            {connectedPen && (
              <View style={styles.penInfo}>
                <Text style={styles.penName}>{connectedPen.name}</Text>
                <Text style={styles.penSerial}>
                  Serial: {connectedPen.serialNumber}
                </Text>
              </View>
            )}
            {penStatus && (
              <View style={styles.penStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Battery</Text>
                  <Text style={styles.statValue}>{penStatus.batteryLevel}%</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Firmware</Text>
                  <Text style={styles.statValue}>
                    {penStatus.firmwareVersion || 'Unknown'}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Storage</Text>
                  <Text style={styles.statValue}>
                    {Math.round(penStatus.storageUsed / 1024 / 1024)}MB /
                    {Math.round(penStatus.storageTotal / 1024 / 1024)}MB
                  </Text>
                </View>
              </View>
            )}
            <View style={styles.actions}>
              <Button
                title="Check for Updates"
                onPress={() => navigation.navigate('FirmwareUpdate')}
                size="small"
                variant="secondary"
                fullWidth
                style={styles.button}
              />
              <Button
                title="Disconnect"
                onPress={handleDisconnectPen}
                size="small"
                variant="danger"
                fullWidth
                style={styles.button}
              />
            </View>
          </View>
        );

      case PenConnectionStatus.SCANNING:
        return (
          <View style={styles.scanningCard}>
            <LoadingSpinner text="Searching for Pens..." size="small" />
            <Button
              title="Cancel Scan"
              onPress={handleStopScan}
              size="small"
              variant="danger"
              fullWidth
              style={styles.button}
            />
          </View>
        );

      case PenConnectionStatus.CONNECTING:
        return (
          <View style={styles.scanningCard}>
            <LoadingSpinner text="Connecting..." size="small" />
          </View>
        );

      default:
        return (
          <View style={styles.notConnectedCard}>
            <Text style={styles.notConnectedIcon}>📡</Text>
            <Text style={styles.notConnectedTitle}>No Pen Connected</Text>
            <Text style={styles.notConnectedText}>
              Make sure your Zuupah Pen is turned on and within range
            </Text>
            <Button
              title={isScanning ? 'Scanning...' : 'Search for Pen'}
              onPress={handleStartScan}
              disabled={isScanning}
              fullWidth
              style={styles.button}
            />
          </View>
        );
    }
  };

  const renderAvailableDevices = () => {
    if (availableDevices.length === 0) return null;

    return (
      <View style={styles.devicesSection}>
        <Text style={styles.sectionTitle}>Available Devices</Text>
        {availableDevices.map(device => (
          <TouchableOpacity
            key={device.id}
            style={styles.deviceItem}
            onPress={() => handleConnectToPen(device.id, device.name)}
          >
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>{device.name}</Text>
              <Text style={styles.deviceSignal}>
                Signal: {device.rssi} dBm
              </Text>
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
        <Text style={styles.sectionTitle}>Active Transfers</Text>
        {Array.from(transferProgress.values()).map(transfer => (
          <Card key={transfer.bookId} style={styles.transferCard}>
            <Text style={styles.transferTitle}>Book ID: {transfer.bookId}</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${transfer.progress}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>{transfer.progress}%</Text>
            </View>
            <Text style={styles.transferStatus}>{transfer.status}</Text>
          </Card>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Zuupah Pen</Text>
          <Text style={styles.subtitle}>Connect & Transfer Books</Text>
        </View>

        {renderConnectionStatus()}
        {renderAvailableDevices()}
        {renderTransfers()}
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
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: '700' as const,
    color: COLORS.darkText,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.lightText,
    marginTop: 4,
  },
  connectedCard: {
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
  statusText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: '600' as const,
    color: COLORS.success,
  },
  penInfo: {
    marginBottom: 12,
  },
  penName: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: '600' as const,
    color: COLORS.darkText,
  },
  penSerial: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.lightText,
    marginTop: 2,
  },
  penStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    marginVertical: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.lightText,
    marginBottom: 4,
  },
  statValue: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: '600' as const,
    color: COLORS.darkText,
  },
  actions: {
    gap: 8,
    marginTop: 12,
  },
  button: {
    marginTop: 8,
  },
  notConnectedCard: {
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  notConnectedIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  notConnectedTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '600' as const,
    color: COLORS.darkText,
    marginBottom: 8,
  },
  notConnectedText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.lightText,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  scanningCard: {
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  devicesSection: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: '600' as const,
    color: COLORS.darkText,
    marginBottom: 8,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: '600' as const,
    color: COLORS.darkText,
  },
  deviceSignal: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.lightText,
    marginTop: 2,
  },
  connectArrow: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.beachBlue,
  },
  transfersSection: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  transferCard: {
    marginBottom: 8,
  },
  transferTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '600' as const,
    color: COLORS.darkText,
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.beachBlue,
  },
  progressText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '600' as const,
    color: COLORS.darkText,
    minWidth: 40,
  },
  transferStatus: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.lightText,
    marginTop: 4,
  },
});

export default PenScreen;
