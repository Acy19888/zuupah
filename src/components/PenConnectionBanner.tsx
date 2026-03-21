/**
 * Pen Connection Banner Component
 * Shows pen connection status and battery level
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PenConnectionStatus } from '@types/pen';
import { COLORS } from '@constants/colors';
import { TYPOGRAPHY } from '@constants/typography';

interface PenConnectionBannerProps {
  status: PenConnectionStatus;
  penName?: string;
  batteryLevel?: number;
  onPress?: () => void;
  onDisconnect?: () => void;
}

/**
 * PenConnectionBanner Component
 * Displays pen connection status and allows quick actions
 */
export const PenConnectionBanner: React.FC<PenConnectionBannerProps> = ({
  status,
  penName = 'Zuupah Pen',
  batteryLevel = 0,
  onPress,
  onDisconnect,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case PenConnectionStatus.CONNECTED:
        return COLORS.success;
      case PenConnectionStatus.CONNECTING:
        return COLORS.warning;
      case PenConnectionStatus.ERROR:
        return COLORS.error;
      default:
        return COLORS.lightText;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case PenConnectionStatus.CONNECTED:
        return 'Connected';
      case PenConnectionStatus.CONNECTING:
        return 'Connecting...';
      case PenConnectionStatus.SCANNING:
        return 'Scanning...';
      case PenConnectionStatus.DISCONNECTED:
        return 'Not Connected';
      case PenConnectionStatus.ERROR:
        return 'Connection Error';
      default:
        return 'Idle';
    }
  };

  if (status === PenConnectionStatus.IDLE || status === PenConnectionStatus.DISCONNECTED) {
    return null;
  }

  return (
    <TouchableOpacity
      style={[
        styles.banner,
        {
          backgroundColor:
            status === PenConnectionStatus.CONNECTED
              ? COLORS.surfaceLight
              : COLORS.backgroundAlt,
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <View style={styles.statusIndicator}>
          <View
            style={[
              styles.dot,
              {
                backgroundColor: getStatusColor(),
              },
            ]}
          />
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>

        {status === PenConnectionStatus.CONNECTED && (
          <View style={styles.details}>
            <Text style={styles.penName} numberOfLines={1}>
              {penName}
            </Text>
            <Text style={styles.battery}>
              🔋 {batteryLevel}%
            </Text>
          </View>
        )}
      </View>

      {status === PenConnectionStatus.CONNECTED && onDisconnect && (
        <TouchableOpacity
          style={styles.disconnectButton}
          onPress={onDisconnect}
        >
          <Text style={styles.disconnectText}>✕</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  banner: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 12,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Nunito-SemiBold',
    color: COLORS.darkText,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  penName: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.lightText,
    flex: 1,
  },
  battery: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.darkText,
    fontFamily: 'Nunito-Medium',
    marginLeft: 8,
  },
  disconnectButton: {
    padding: 4,
    marginLeft: 8,
  },
  disconnectText: {
    fontSize: 16,
    color: COLORS.error,
  },
});

export default PenConnectionBanner;
