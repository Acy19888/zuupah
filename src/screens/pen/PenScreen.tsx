/**
 * Pen Screen
 * Shows pen illustration, battery & storage bars, connect/disconnect
 */

import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, ScrollView, Text, SafeAreaView, TouchableOpacity, Linking, Alert,
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
// Faithful to the real Zuupah pen:
//  • White upper body with speaker grille (dot pattern), power/+/− buttons, LED
//  • Baby-blue lower grip that tapers to a rounded tip
//  • Clean drop shadow

const PEN_W  = 104;   // pen width
const PEN_R  = PEN_W / 2;
const BABY_BLUE = '#7DD0EE';

// Speaker grille — 8 holes arranged in a daisy ring + 1 centre hole
const GRILLE_R = 11; // ring radius in px
const GRILLE_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

const SpeakerGrille: React.FC = () => (
  <View style={grille.wrap}>
    {/* centre hole */}
    <View style={grille.hole} />
    {/* ring holes */}
    {GRILLE_ANGLES.map((deg) => {
      const rad = (deg - 90) * (Math.PI / 180);
      return (
        <View
          key={deg}
          style={[
            grille.hole,
            {
              position: 'absolute',
              left: 22 + Math.round(Math.cos(rad) * GRILLE_R) - 2.5,
              top:  22 + Math.round(Math.sin(rad) * GRILLE_R) - 2.5,
            },
          ]}
        />
      );
    })}
  </View>
);

const grille = StyleSheet.create({
  wrap: { width: 48, height: 48, justifyContent: 'center', alignItems: 'center' },
  hole: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#444' },
});

const PenIllustration: React.FC<{ connected: boolean }> = ({ connected }) => (
  <View style={penIll.wrapper}>
    {/* Ambient glow when connected */}
    {connected && <View style={penIll.glow} />}

    <View style={penIll.shadow}>
      {/* ── White upper body ── */}
      <View style={penIll.whiteBody}>
        {/* USB-C port notch at the very top */}
        <View style={penIll.usbPort} />

        {/* Speaker grille */}
        <SpeakerGrille />

        {/* Buttons row 1: Power (red-orange) + Volume Up (orange) */}
        <View style={penIll.btnRow}>
          <View style={[penIll.btn, { backgroundColor: '#EF6820' }]}>
            <Icon name="power" size={16} color="#fff" />
          </View>
          <View style={[penIll.btn, { backgroundColor: '#F0A030' }]}>
            <Text style={penIll.btnLabel}>+</Text>
          </View>
        </View>

        {/* LED status dot (green = on) */}
        <View style={[penIll.led, { backgroundColor: connected ? '#44EE55' : '#CCCCCC' }]} />

        {/* Volume Down (gold/yellow) centred below */}
        <View style={[penIll.btn, { backgroundColor: '#D4A820' }]}>
          <Text style={penIll.btnLabel}>−</Text>
        </View>
      </View>

      {/* ── Baby-blue lower grip ── */}
      {/* Two-piece: straight rect + tapered rounded bottom */}
      <View style={penIll.blueUpper} />
      <View style={penIll.blueLower} />
    </View>

    {/* Status label */}
    <View style={[penIll.statusPill, { backgroundColor: connected ? '#E8FFF0' : '#F3F4F6' }]}>
      <View style={[penIll.statusDot, { backgroundColor: connected ? COLORS.success : '#9CA3AF' }]} />
      <Text style={[penIll.statusText, { color: connected ? COLORS.success : '#6B7280' }]}>
        {connected ? 'Connected' : 'Not connected'}
      </Text>
    </View>
  </View>
);

const penIll = StyleSheet.create({
  wrapper:    { alignItems: 'center', paddingVertical: 24 },
  glow:       {
    position: 'absolute', width: 130, height: 310, borderRadius: 65, top: 10,
    backgroundColor: 'rgba(125,208,238,0.18)',
  },
  shadow:     {
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18, shadowRadius: 20, elevation: 12,
  },
  // White body — rounded top, straight sides, flat bottom
  whiteBody:  {
    width: PEN_W,
    backgroundColor: '#F3F5F7',
    borderTopLeftRadius: PEN_R,
    borderTopRightRadius: PEN_R,
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    gap: 8,
  },
  usbPort:    {
    width: 26, height: 7, borderRadius: 3.5,
    backgroundColor: '#C8CDD4', marginBottom: 2,
  },
  btnRow:     { flexDirection: 'row', gap: 10 },
  btn:        { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  btnLabel:   { color: '#fff', fontSize: 21, fontFamily: 'Nunito-Bold', lineHeight: 26 },
  led:        { width: 7, height: 7, borderRadius: 3.5, marginTop: -2, marginBottom: -2, alignSelf: 'flex-start', marginLeft: PEN_W / 2 - 26 },
  // Blue grip — upper straight part (same width as body)
  blueUpper:  { width: PEN_W, height: 48, backgroundColor: BABY_BLUE },
  // Blue grip — lower tapered part (max border-radius to taper inward to a round tip)
  blueLower:  {
    width: PEN_W, height: 110,
    backgroundColor: BABY_BLUE,
    borderBottomLeftRadius: PEN_R,
    borderBottomRightRadius: PEN_R,
  },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, marginTop: 20 },
  statusDot:  { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: TYPOGRAPHY.fontSize.xs, fontFamily: 'Nunito-SemiBold' },
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

interface LatestFirmware {
  version: string;
  changelog: string | null;
  downloadUrl: string;
}

const PenScreen: React.FC<any> = ({ navigation }) => {
  const {
    connectedPen, availableDevices, connectionStatus, isScanning,
    penStatus, transferProgress,
    handleStartScan, handleStopScan, handleConnectToPen, handleDisconnectPen,
  } = useBluetooth();
  const { tc } = useAppTheme();

  const [latestFirmware, setLatestFirmware] = useState<LatestFirmware | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const isConnected  = connectionStatus === PenConnectionStatus.CONNECTED;
  const isConnecting = connectionStatus === PenConnectionStatus.CONNECTING;
  const isSearch     = connectionStatus === PenConnectionStatus.SCANNING || isScanning;

  // Check for firmware update when pen is connected
  useEffect(() => {
    if (!isConnected || !connectedPen) return;
    const API = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000';
    fetch(`${API}/api/firmware/latest`)
      .then(r => r.json())
      .then((data: LatestFirmware) => {
        if (data.version && data.version !== connectedPen.firmwareVersion) {
          setLatestFirmware(data);
        } else {
          setLatestFirmware(null);
        }
      })
      .catch(() => setLatestFirmware(null));
  }, [isConnected, connectedPen]);

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

            {/* Firmware update banner */}
            {latestFirmware && (
              <TouchableOpacity
                onPress={() => setShowUpdateModal(true)}
                style={[styles.updateBanner]}
              >
                <View style={styles.updateBannerLeft}>
                  <Icon name="update" size={20} color="#fff" />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.updateBannerTitle}>Update verfügbar: v{latestFirmware.version}</Text>
                    <Text style={styles.updateBannerSub}>Tippe um Details zu sehen</Text>
                  </View>
                </View>
                <Icon name="chevron-right" size={18} color="#fff" />
              </TouchableOpacity>
            )}

            {/* Action rows */}
            <View style={[styles.section, { backgroundColor: tc.card, borderColor: tc.border, gap: 0 }]}>
              <TouchableOpacity
                style={[styles.actionRow, { borderBottomColor: tc.divider, borderBottomWidth: 1 }]}
                onPress={() => latestFirmware ? setShowUpdateModal(true) : Alert.alert('Firmware', 'Dein Stift ist auf dem neusten Stand ✓')}
              >
                <View style={[styles.actionIcon, { backgroundColor: COLORS.beachBlue + '18' }]}>
                  <Icon name="update" size={19} color={COLORS.beachBlue} />
                </View>
                <Text style={[styles.actionText, { color: tc.text }]}>Check for Updates</Text>
                {latestFirmware && (
                  <View style={styles.updateDot} />
                )}
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

      {/* Firmware Update Modal */}
      {showUpdateModal && latestFirmware && (
        <View style={modal.overlay}>
          <View style={[modal.sheet, { backgroundColor: tc.card }]}>
            <View style={modal.iconWrap}>
              <Icon name="update" size={32} color={COLORS.beachBlue} />
            </View>
            <Text style={[modal.title, { color: tc.text }]}>Update verfügbar</Text>
            <Text style={[modal.version, { color: COLORS.beachBlue }]}>Version {latestFirmware.version}</Text>
            {latestFirmware.changelog ? (
              <View style={[modal.changelogBox, { backgroundColor: tc.background, borderColor: tc.border }]}>
                <Text style={[modal.changelogLabel, { color: tc.textSecondary }]}>Was ist neu:</Text>
                <Text style={[modal.changelogText, { color: tc.text }]}>{latestFirmware.changelog}</Text>
              </View>
            ) : null}
            <Text style={[modal.hint, { color: tc.textSecondary }]}>
              Übertrage die Firmware-Datei auf deinen Stift über die offizielle Zuupah App oder via USB.
            </Text>
            <TouchableOpacity
              style={[modal.btn, { backgroundColor: COLORS.beachBlue }]}
              onPress={() => Linking.openURL(latestFirmware.downloadUrl)}
            >
              <Icon name="download" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={modal.btnText}>Firmware herunterladen</Text>
            </TouchableOpacity>
            <TouchableOpacity style={modal.cancelBtn} onPress={() => setShowUpdateModal(false)}>
              <Text style={[modal.cancelText, { color: tc.textSecondary }]}>Schließen</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  deviceRow:      { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  transferItem:   { paddingVertical: 10 },
  updateBanner:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.beachBlue, borderRadius: 14, padding: 14, marginBottom: 12 },
  updateBannerLeft:{ flexDirection: 'row', alignItems: 'center', flex: 1 },
  updateBannerTitle:{ color: '#fff', fontFamily: 'Nunito-Bold', fontSize: TYPOGRAPHY.fontSize.sm },
  updateBannerSub:{ color: 'rgba(255,255,255,0.8)', fontSize: TYPOGRAPHY.fontSize.xs, marginTop: 2 },
  updateDot:      { width: 8, height: 8, borderRadius: 4, backgroundColor: '#F59E0B', marginRight: 4 },
});

const modal = StyleSheet.create({
  overlay:      { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' } as any,
  sheet:        { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  iconWrap:     { width: 60, height: 60, borderRadius: 18, backgroundColor: COLORS.beachBlue + '18', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 12 },
  title:        { fontSize: TYPOGRAPHY.fontSize.xl, fontFamily: 'Nunito-Bold', textAlign: 'center' },
  version:      { fontSize: TYPOGRAPHY.fontSize.base, fontFamily: 'Nunito-SemiBold', textAlign: 'center', marginTop: 4, marginBottom: 16 },
  changelogBox: { borderRadius: 12, borderWidth: 1, padding: 12, marginBottom: 14 },
  changelogLabel:{ fontSize: TYPOGRAPHY.fontSize.xs, fontFamily: 'Nunito-Bold', marginBottom: 4 },
  changelogText: { fontSize: TYPOGRAPHY.fontSize.sm, lineHeight: 20 },
  hint:         { fontSize: TYPOGRAPHY.fontSize.xs, textAlign: 'center', lineHeight: 18, marginBottom: 20 },
  btn:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 12, paddingVertical: 14, marginBottom: 10 },
  btnText:      { color: '#fff', fontFamily: 'Nunito-Bold', fontSize: TYPOGRAPHY.fontSize.base },
  cancelBtn:    { alignItems: 'center', paddingVertical: 10 },
  cancelText:   { fontSize: TYPOGRAPHY.fontSize.sm, fontFamily: 'Nunito-SemiBold' },
});

export default PenScreen;
