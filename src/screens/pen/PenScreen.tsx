/**
 * Pen Screen
 * Shows pen illustration, battery & storage bars, connect/disconnect
 */

import React, { useEffect } from 'react';
import {
  View, StyleSheet, ScrollView, Text, SafeAreaView, TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useBluetooth } from '@hooks/useBluetooth';
import { useAppTheme } from '@hooks/useAppTheme';
import Button from '@components/common/Button';
import LoadingSpinner from '@components/common/LoadingSpinner';
import { PenConnectionStatus } from '@types/pen';
import { COLORS } from '@constants/colors';
import { TYPOGRAPHY } from '@constants/typography';

// ─── Pen Illustration ────────────────────────────────────────────────────────
// Drawn with Views — matches the Zuupah smart pen design:
// white barrel, blue accent bands, rounded cap, tapered nib

const PEN_BLUE = COLORS.beachBlue;

const PenIllustration: React.FC<{ connected: boolean }> = ({ connected }) => (
  <View style={penIll.wrapper}>
    {/* Soft glow behind pen when connected */}
    {connected && <View style={penIll.glow} />}

    {/* ── Pen body (vertical) ── */}
    <View style={penIll.pen}>

      {/* Rounded cap */}
      <View style={[penIll.cap, { backgroundColor: PEN_BLUE }]} />

      {/* Clip (offset to the right) */}
      <View style={penIll.clipOuter}>
        <View style={[penIll.clip, { backgroundColor: PEN_BLUE }]} />
      </View>

      {/* Top accent band */}
      <View style={[penIll.topBand, { backgroundColor: PEN_BLUE }]} />

      {/* Main white barrel */}
      <View style={[penIll.barrel, { backgroundColor: '#FFFFFF', borderColor: '#D6E8F5' }]}>
        <Text style={[penIll.brandZ, { color: PEN_BLUE }]}>Z</Text>
      </View>

      {/* Bottom accent band */}
      <View style={[penIll.bottomBand, { backgroundColor: PEN_BLUE + 'CC' }]} />

      {/* Shoulder taper */}
      <View style={[penIll.shoulder, { backgroundColor: '#CBE2F3' }]} />

      {/* Nib */}
      <View style={penIll.nibWrap}>
        <View style={[penIll.nib, { backgroundColor: '#9AC0D8' }]} />
        <View style={penIll.nibTip} />
      </View>
    </View>

    {/* Connection status pill */}
    <View style={[penIll.statusPill, { backgroundColor: connected ? COLORS.success + '18' : '#F3F4F6' }]}>
      <View style={[penIll.statusDot, { backgroundColor: connected ? COLORS.success : '#9CA3AF' }]} />
      <Text style={[penIll.statusText, { color: connected ? COLORS.success : '#6B7280' }]}>
        {connected ? 'Connected' : 'Not connected'}
      </Text>
    </View>
  </View>
);

const penIll = StyleSheet.create({
  wrapper:     { alignItems: 'center', paddingVertical: 28, position: 'relative' },
  glow:        { position: 'absolute', width: 80, height: 220, borderRadius: 40, backgroundColor: 'rgba(65,165,205,0.14)', top: 16 },
  pen:         { alignItems: 'center', width: 44, position: 'relative' },
  cap:         { width: 34, height: 20, borderRadius: 10, zIndex: 2 },
  clipOuter:   { position: 'absolute', right: 0, top: 12, zIndex: 3 },
  clip:        { width: 7, height: 28, borderRadius: 3.5 },
  topBand:     { width: 44, height: 12, borderRadius: 2, marginTop: 0 },
  barrel:      { width: 40, height: 114, borderRadius: 6, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' },
  brandZ:      { fontSize: 30, fontFamily: 'Nunito-Bold', letterSpacing: 1 },
  bottomBand:  { width: 44, height: 10, borderRadius: 2 },
  shoulder:    { width: 30, height: 12, borderBottomLeftRadius: 4, borderBottomRightRadius: 4, marginTop: 1 },
  nibWrap:     { alignItems: 'center' },
  nib:         { width: 16, height: 16, borderBottomLeftRadius: 3, borderBottomRightRadius: 3 },
  nibTip:      {
    width: 0, height: 0,
    borderLeftWidth: 8, borderRightWidth: 8, borderTopWidth: 11,
    borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#9AC0D8',
  },
  statusPill:  { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, marginTop: 20 },
  statusDot:   { width: 8, height: 8, borderRadius: 4 },
  statusText:  { fontSize: TYPOGRAPHY.fontSize.xs, fontFamily: 'Nunito-SemiBold' },
});

// ─── Battery Bar ─────────────────────────────────────────────────────────────

const batteryColor = (pct: number) =>
  pct >= 50 ? COLORS.success : pct >= 20 ? '#F59E0B' : '#EF4444';

const batteryIcon = (pct: number, charging?: boolean) => {
  if (charging) return 'battery-charging';
  if (pct >= 80) return 'battery';
  if (pct >= 50) return 'battery-70';
  if (pct >= 20) return 'battery-30';
  return 'battery-10';
};

const BatteryBar: React.FC<{ level: number; isCharging?: boolean; tc: any }> = ({ level, isCharging, tc }) => {
  const color = batteryColor(level);
  return (
    <View style={[barCard.card, { backgroundColor: tc.card, borderColor: tc.border }]}>
      <View style={barCard.headerRow}>
        <View style={[barCard.iconBadge, { backgroundColor: color + '18' }]}>
          <Icon name={batteryIcon(level, isCharging) as any} size={22} color={color} />
        </View>
        <View style={barCard.info}>
          <Text style={[barCard.label, { color: tc.text }]}>Battery</Text>
          {isCharging
            ? <Text style={[barCard.sub, { color: COLORS.success }]}>⚡ Charging</Text>
            : <Text style={[barCard.sub, { color: tc.textSecondary }]}>
                {level >= 50 ? 'Good' : level >= 20 ? 'Low — charge soon' : 'Critical — charge now'}
              </Text>
          }
        </View>
        <Text style={[barCard.bigValue, { color }]}>{level}%</Text>
      </View>
      <View style={[barCard.track, { backgroundColor: tc.border }]}>
        <View style={[barCard.fill, { width: `${level}%` as any, backgroundColor: color }]} />
      </View>
    </View>
  );
};

// ─── Storage Bar ─────────────────────────────────────────────────────────────

const fmtGB = (bytes: number) => (bytes / (1024 ** 3)).toFixed(2);

const StorageBar: React.FC<{ used: number; total: number; tc: any }> = ({ used, total, tc }) => {
  const pct    = Math.min((used / total) * 100, 100);
  const free   = fmtGB(total - used);
  const usedG  = fmtGB(used);
  const totalG = fmtGB(total);
  const color  = pct >= 85 ? '#EF4444' : pct >= 60 ? '#F59E0B' : COLORS.beachBlue;

  return (
    <View style={[barCard.card, { backgroundColor: tc.card, borderColor: tc.border }]}>
      <View style={barCard.headerRow}>
        <View style={[barCard.iconBadge, { backgroundColor: COLORS.beachBlue + '18' }]}>
          <Icon name="harddisk" size={22} color={COLORS.beachBlue} />
        </View>
        <View style={barCard.info}>
          <Text style={[barCard.label, { color: tc.text }]}>Storage</Text>
          <Text style={[barCard.sub, { color: tc.textSecondary }]}>{free} GB free of {totalG} GB</Text>
        </View>
        <Text style={[barCard.bigValue, { color: tc.textSecondary, fontSize: TYPOGRAPHY.fontSize.sm }]}>
          {usedG} GB
        </Text>
      </View>
      <View style={[barCard.track, { backgroundColor: tc.border }]}>
        <View style={[barCard.fill, { width: `${pct}%` as any, backgroundColor: color }]} />
      </View>
      <View style={barCard.legend}>
        <View style={barCard.legendItem}>
          <View style={[barCard.dot, { backgroundColor: color }]} />
          <Text style={[barCard.legendText, { color: tc.textSecondary }]}>Used {usedG} GB</Text>
        </View>
        <View style={barCard.legendItem}>
          <View style={[barCard.dot, { backgroundColor: tc.border }]} />
          <Text style={[barCard.legendText, { color: tc.textSecondary }]}>Free {free} GB</Text>
        </View>
      </View>
    </View>
  );
};

const barCard = StyleSheet.create({
  card:       { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 12 },
  headerRow:  { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconBadge:  { width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  info:       { flex: 1 },
  label:      { fontSize: TYPOGRAPHY.fontSize.base, fontFamily: 'Nunito-SemiBold' },
  sub:        { fontSize: TYPOGRAPHY.fontSize.xs, marginTop: 2 },
  bigValue:   { fontSize: TYPOGRAPHY.fontSize.lg, fontFamily: 'Nunito-Bold' },
  track:      { height: 9, borderRadius: 5, overflow: 'hidden' },
  fill:       { height: '100%', borderRadius: 5 },
  legend:     { flexDirection: 'row', justifyContent: 'space-between', marginTop: 9 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot:        { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: TYPOGRAPHY.fontSize.xs },
});

// ─── Info row ─────────────────────────────────────────────────────────────────

const InfoRow: React.FC<{ icon: string; label: string; value: string; tc: any; last?: boolean }> = ({ icon, label, value, tc, last }) => (
  <View style={[infoRow.row, !last && { borderBottomWidth: 1, borderBottomColor: tc.divider }]}>
    <Icon name={icon as any} size={17} color={COLORS.beachBlue} style={{ marginRight: 10 }} />
    <Text style={[infoRow.label, { color: tc.textSecondary }]}>{label}</Text>
    <Text style={[infoRow.value, { color: tc.text }]}>{value}</Text>
  </View>
);

const infoRow = StyleSheet.create({
  row:   { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  label: { flex: 1, fontSize: TYPOGRAPHY.fontSize.sm },
  value: { fontSize: TYPOGRAPHY.fontSize.sm, fontFamily: 'Nunito-SemiBold' },
});

// ─── Screen ───────────────────────────────────────────────────────────────────

const PenScreen: React.FC<any> = ({ navigation }) => {
  const {
    connectedPen, availableDevices, connectionStatus, isScanning,
    penStatus, transferProgress,
    handleStartScan, handleStopScan, handleConnectToPen, handleDisconnectPen,
  } = useBluetooth();
  const { tc } = useAppTheme();

  const isConnected  = connectionStatus === PenConnectionStatus.CONNECTED;
  const isConnecting = connectionStatus === PenConnectionStatus.CONNECTING;
  const isSearch     = connectionStatus === PenConnectionStatus.SCANNING || isScanning;

  useEffect(() => {
    return () => { if (isScanning) handleStopScan(); };
  }, [isScanning, handleStopScan]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tc.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: tc.text }]}>Zuupah Pen</Text>
          <Text style={[styles.subtitle, { color: tc.textSecondary }]}>Connect & manage your pen</Text>
        </View>

        {/* Pen illustration */}
        <PenIllustration connected={isConnected} />

        {/* ── CONNECTING ── */}
        {isConnecting && (
          <View style={[styles.stateCard, { backgroundColor: tc.card, borderColor: tc.border }]}>
            <LoadingSpinner text="Connecting to pen…" size="small" />
          </View>
        )}

        {/* ── NOT CONNECTED ── */}
        {!isConnected && !isConnecting && (
          <View style={[styles.stateCard, { backgroundColor: tc.card, borderColor: tc.border }]}>
            <Text style={[styles.stateTitle, { color: tc.text }]}>No pen connected</Text>
            <Text style={[styles.stateSub, { color: tc.textSecondary }]}>
              Switch your Zuupah Pen on and keep it nearby, then tap Search.
            </Text>
            <Button
              title={isSearch ? 'Searching…' : 'Search for Pen'}
              onPress={isSearch ? handleStopScan : handleStartScan}
              fullWidth
              style={{ marginTop: 16 }}
            />
            {isSearch && (
              <TouchableOpacity style={{ marginTop: 10 }} onPress={handleStopScan}>
                <Text style={[styles.cancelText]}>Cancel search</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* ── CONNECTED ── */}
        {isConnected && connectedPen && (
          <>
            {/* Pen details */}
            <View style={[styles.section, { backgroundColor: tc.card, borderColor: tc.border }]}>
              <Text style={[styles.sectionLabel, { color: tc.textSecondary }]}>PEN INFO</Text>
              <InfoRow icon="pen"          label="Name"     value={connectedPen.name}            tc={tc} />
              <InfoRow icon="identifier"   label="Serial"   value={connectedPen.serialNumber}    tc={tc} />
              <InfoRow icon="chip"         label="Firmware" value={connectedPen.firmwareVersion} tc={tc} last />
            </View>

            {/* Battery */}
            {penStatus && (
              <BatteryBar level={penStatus.batteryLevel} isCharging={penStatus.isCharging} tc={tc} />
            )}

            {/* Storage */}
            {penStatus && (
              <StorageBar used={penStatus.storageUsed} total={penStatus.storageTotal} tc={tc} />
            )}

            {/* Action rows */}
            <View style={[styles.section, { backgroundColor: tc.card, borderColor: tc.border, gap: 0 }]}>
              <TouchableOpacity
                style={[styles.actionRow, { borderBottomColor: tc.divider, borderBottomWidth: 1 }]}
                onPress={() => navigation.navigate('FirmwareUpdate')}
              >
                <View style={[styles.actionIcon, { backgroundColor: COLORS.beachBlue + '18' }]}>
                  <Icon name="update" size={19} color={COLORS.beachBlue} />
                </View>
                <Text style={[styles.actionText, { color: tc.text }]}>Check for Updates</Text>
                <Icon name="chevron-right" size={18} color={tc.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionRow}
                onPress={handleDisconnectPen}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#EF444418' }]}>
                  <Icon name="bluetooth-off" size={19} color="#EF4444" />
                </View>
                <Text style={[styles.actionText, { color: '#EF4444' }]}>Disconnect Pen</Text>
                <Icon name="chevron-right" size={18} color={tc.textSecondary} />
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Available devices (after scan) */}
        {(isSearch || availableDevices.length > 0) && (
          <View style={[styles.section, { backgroundColor: tc.card, borderColor: tc.border }]}>
            <Text style={[styles.sectionLabel, { color: tc.textSecondary }]}>NEARBY DEVICES</Text>
            {isSearch && availableDevices.length === 0 && (
              <View style={{ paddingVertical: 12, alignItems: 'center' }}>
                <LoadingSpinner text="Searching…" size="small" />
              </View>
            )}
            {availableDevices.map((device, i) => (
              <TouchableOpacity
                key={device.id}
                style={[
                  styles.deviceRow,
                  { borderBottomColor: tc.divider },
                  i < availableDevices.length - 1 && { borderBottomWidth: 1 },
                ]}
                onPress={() => handleConnectToPen(device.id, device.name)}
              >
                <View style={[styles.actionIcon, { backgroundColor: COLORS.beachBlue + '18' }]}>
                  <Icon name="pen" size={18} color={COLORS.beachBlue} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.actionText, { color: tc.text }]}>{device.name}</Text>
                  <Text style={[styles.stateSub, { color: tc.textSecondary, textAlign: 'left', marginTop: 2 }]}>
                    Signal: {device.rssi} dBm
                  </Text>
                </View>
                <Icon name="chevron-right" size={18} color={tc.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Active transfers */}
        {transferProgress.size > 0 && (
          <View style={[styles.section, { backgroundColor: tc.card, borderColor: tc.border }]}>
            <Text style={[styles.sectionLabel, { color: tc.textSecondary }]}>ACTIVE TRANSFERS</Text>
            {Array.from(transferProgress.values()).map(t => (
              <View key={t.bookId} style={[styles.transferItem, { borderBottomColor: tc.divider }]}>
                <Text style={[styles.actionText, { color: tc.text }]}>Book {t.bookId}</Text>
                <View style={[barCard.track, { backgroundColor: tc.border, marginVertical: 6 }]}>
                  <View style={[barCard.fill, { width: `${t.progress}%` as any, backgroundColor: COLORS.beachBlue }]} />
                </View>
                <Text style={[styles.stateSub, { color: tc.textSecondary, textAlign: 'left' }]}>
                  {t.progress}% · {t.status}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container:   { flex: 1 },
  scroll:      { paddingHorizontal: 16, paddingTop: 8 },
  header:      { marginBottom: 4 },
  title:       { fontSize: TYPOGRAPHY.fontSize['2xl'], fontFamily: 'Nunito-Bold' },
  subtitle:    { fontSize: TYPOGRAPHY.fontSize.sm, marginTop: 4 },
  section:     { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 12 },
  sectionLabel:{ fontSize: TYPOGRAPHY.fontSize.xs, fontFamily: 'Nunito-Bold', letterSpacing: 1, marginBottom: 8 },
  stateCard:   { borderRadius: 14, borderWidth: 1, padding: 24, alignItems: 'center', marginBottom: 12 },
  stateTitle:  { fontSize: TYPOGRAPHY.fontSize.lg, fontFamily: 'Nunito-SemiBold', marginBottom: 8 },
  stateSub:    { fontSize: TYPOGRAPHY.fontSize.xs, textAlign: 'center', lineHeight: 18 },
  cancelText:  { fontSize: TYPOGRAPHY.fontSize.sm, fontFamily: 'Nunito-SemiBold', color: '#EF4444', textAlign: 'center' },
  actionRow:   { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  actionIcon:  { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  actionText:  { flex: 1, fontSize: TYPOGRAPHY.fontSize.sm, fontFamily: 'Nunito-SemiBold' },
  deviceRow:   { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  transferItem:{ paddingVertical: 10 },
});

export default PenScreen;
