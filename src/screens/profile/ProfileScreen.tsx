/**
 * Profile Screen
 * User profile and settings — with i18n
 */

import React from 'react';
import {
  View, StyleSheet, ScrollView, Text,
  SafeAreaView, TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import { useAppTheme } from '@hooks/useAppTheme';
import { useI18n } from '@hooks/useI18n';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import { COLORS } from '@constants/colors';
import { TYPOGRAPHY } from '@constants/typography';

const ProfileScreen: React.FC<any> = ({ navigation }) => {
  const { user, handleSignOut } = useAuth();
  const { tc } = useAppTheme();
  const { t } = useI18n();

  const handleLogout = async () => {
    try { await handleSignOut(); }
    catch (error) { console.error('Logout failed:', error); }
  };

  const fullName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(' ') || user.displayName
    : '';
  const initials = user
    ? (user.firstName?.charAt(0) ?? '') + (user.lastName?.charAt(0) ?? '')
      || user.displayName?.charAt(0).toUpperCase()
      || 'U'
    : 'U';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tc.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: tc.text }]}>{t('profile')}</Text>
        </View>

        {user && (
          <View style={styles.content}>
            <Card style={[styles.profileCard, { backgroundColor: tc.card }]}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initials.toUpperCase()}</Text>
                </View>
              </View>
              <View style={styles.profileInfo}>
                <Text style={[styles.displayName, { color: tc.text }]}>{fullName}</Text>
                {user.childName ? (
                  <Text style={[styles.childName, { color: COLORS.beachBlue }]}>👶 {user.childName}</Text>
                ) : null}
                <Text style={[styles.email, { color: tc.textSecondary }]}>{user.email}</Text>
                {!user.isEmailVerified && (
                  <View style={styles.verificationBadge}>
                    <Text style={styles.verificationText}>⚠️ Email not verified</Text>
                  </View>
                )}
              </View>
            </Card>

            {/* Account section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: tc.textSecondary }]}>{t('account').toUpperCase()}</Text>
              {[
                { icon: 'account-edit', label: t('editProfile'),    desc: t('updateInfo'),     screen: 'EditProfile' },
                { icon: 'lock-reset',   label: t('changePassword'),  desc: t('updatePassword'), screen: 'ChangePassword' },
              ].map(item => (
                <TouchableOpacity key={item.label} style={[styles.settingItem, { backgroundColor: tc.card, borderColor: tc.border }]} onPress={() => navigation.navigate(item.screen)}>
                  <View style={styles.settingContent}>
                    <Icon name={item.icon as any} size={24} color={COLORS.beachBlue} />
                    <View style={styles.settingText}>
                      <Text style={[styles.settingLabel, { color: tc.text }]}>{item.label}</Text>
                      <Text style={[styles.settingDesc, { color: tc.textSecondary }]}>{item.desc}</Text>
                    </View>
                  </View>
                  <Icon name="chevron-right" size={24} color={tc.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>

            {/* Preferences section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: tc.textSecondary }]}>{t('preferences').toUpperCase()}</Text>
              {[
                { icon: 'bell',           label: t('notifications'),    desc: t('manageNotif'),       screen: 'Notifications' },
                { icon: 'palette',        label: t('appearance'),        desc: t('appearanceDesc'),    screen: 'Appearance' },
                { icon: 'translate',      label: t('language'),          desc: t('languageDesc'),      screen: 'Language' },
                { icon: 'shield-account', label: t('parentalControls'), desc: t('parentalDesc'),      screen: 'ParentalControls' },
              ].map(item => (
                <TouchableOpacity key={item.label} style={[styles.settingItem, { backgroundColor: tc.card, borderColor: tc.border }]} onPress={() => navigation.navigate(item.screen)}>
                  <View style={styles.settingContent}>
                    <Icon name={item.icon as any} size={24} color={COLORS.beachBlue} />
                    <View style={styles.settingText}>
                      <Text style={[styles.settingLabel, { color: tc.text }]}>{item.label}</Text>
                      <Text style={[styles.settingDesc, { color: tc.textSecondary }]}>{item.desc}</Text>
                    </View>
                  </View>
                  <Icon name="chevron-right" size={24} color={tc.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>

            {/* Support section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: tc.textSecondary }]}>{t('support').toUpperCase()}</Text>
              {[
                { icon: 'help-circle',   label: t('helpSupport'),  desc: 'FAQs and contact',  screen: 'Help' },
                { icon: 'file-document', label: t('termsPrivacy'), desc: 'Terms & Privacy',    screen: 'Terms' },
                { icon: 'information',   label: t('about'),         desc: 'Version 0.1.0',     screen: null },
              ].map(item => (
                <TouchableOpacity
                  key={item.label}
                  style={[styles.settingItem, { backgroundColor: tc.card, borderColor: tc.border }]}
                  onPress={() => item.screen && navigation.navigate(item.screen)}
                  activeOpacity={item.screen ? 0.7 : 1}
                >
                  <View style={styles.settingContent}>
                    <Icon name={item.icon as any} size={24} color={COLORS.beachBlue} />
                    <View style={styles.settingText}>
                      <Text style={[styles.settingLabel, { color: tc.text }]}>{item.label}</Text>
                      <Text style={[styles.settingDesc, { color: tc.textSecondary }]}>{item.desc}</Text>
                    </View>
                  </View>
                  {item.screen && <Icon name="chevron-right" size={24} color={tc.textSecondary} />}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.section}>
              <Button title={t('signOut')} onPress={handleLogout} variant="danger" fullWidth size="large" />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingVertical: 16 },
  title: { fontSize: TYPOGRAPHY.fontSize['2xl'], fontFamily: 'Nunito-Bold' },
  content: { paddingHorizontal: 16, paddingVertical: 12, gap: 16 },
  profileCard: { alignItems: 'center', paddingVertical: 24 },
  avatarContainer: { marginBottom: 12 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.beachBlue, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 32, fontFamily: 'Nunito-Bold', color: COLORS.white },
  profileInfo: { alignItems: 'center', gap: 4 },
  displayName: { fontSize: TYPOGRAPHY.fontSize.lg, fontFamily: 'Nunito-Bold' },
  email: { fontSize: TYPOGRAPHY.fontSize.sm },
  childName: { fontSize: TYPOGRAPHY.fontSize.sm, fontFamily: 'Nunito-SemiBold', marginBottom: 2 },
  verificationBadge: { marginTop: 8, backgroundColor: COLORS.warning, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  verificationText: { fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.darkText },
  section: { gap: 8 },
  sectionTitle: { fontSize: TYPOGRAPHY.fontSize.sm, fontFamily: 'Nunito-Bold', marginBottom: 4 },
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, marginBottom: 8 },
  settingContent: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  settingText: { flex: 1 },
  settingLabel: { fontSize: TYPOGRAPHY.fontSize.base, fontFamily: 'Nunito-SemiBold' },
  settingDesc: { fontSize: TYPOGRAPHY.fontSize.xs, marginTop: 2 },
});

export default ProfileScreen;
