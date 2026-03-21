/**
 * Profile Screen
 * User profile and settings
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import { useAppTheme } from '@hooks/useAppTheme';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import { COLORS } from '@constants/colors';
import { TYPOGRAPHY } from '@constants/typography';

/**
 * ProfileScreen Component
 * Displays user profile and account settings
 */
const ProfileScreen: React.FC<any> = ({ navigation }) => {
  const { user, handleSignOut } = useAuth();
  const { tc } = useAppTheme();

  const handleLogout = async () => {
    try {
      await handleSignOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }
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
          <Text style={[styles.title, { color: tc.text }]}>Profile</Text>
        </View>

        {user && (
          <View style={styles.content}>
            <Card style={[styles.profileCard, { backgroundColor: tc.card }]}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {initials.toUpperCase()}
                  </Text>
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
                    <Text style={styles.verificationText}>
                      ⚠️ Email not verified
                    </Text>
                  </View>
                )}
              </View>
            </Card>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: tc.textSecondary }]}>Account</Text>

              {[
                { icon: 'account-edit', label: 'Edit Profile', desc: 'Update your information', onPress: () => navigation.navigate('EditProfile') },
                { icon: 'lock-reset',   label: 'Change Password', desc: 'Update your password', onPress: () => navigation.navigate('ChangePassword') },
              ].map(item => (
                <TouchableOpacity key={item.label} style={[styles.settingItem, { backgroundColor: tc.card, borderColor: tc.border }]} onPress={item.onPress}>
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

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: tc.textSecondary }]}>Preferences</Text>

              {[
                { icon: 'bell',           label: 'Notifications',    desc: 'Manage notifications',    onPress: () => navigation.navigate('Notifications') },
                { icon: 'palette',        label: 'Appearance',       desc: 'Light, dark, or auto',    onPress: () => navigation.navigate('Appearance') },
                { icon: 'shield-account', label: 'Parental Controls', desc: 'Manage family settings', onPress: () => navigation.navigate('ParentalControls') },
              ].map(item => (
                <TouchableOpacity key={item.label} style={[styles.settingItem, { backgroundColor: tc.card, borderColor: tc.border }]} onPress={item.onPress}>
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

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: tc.textSecondary }]}>Support</Text>

              {[
                { icon: 'help-circle',   label: 'Help & Support', desc: 'FAQs and contact us' },
                { icon: 'file-document', label: 'Terms & Privacy', desc: 'Our policies' },
                { icon: 'information',   label: 'About', desc: 'Version 0.1.0' },
              ].map(item => (
                <TouchableOpacity key={item.label} style={[styles.settingItem, { backgroundColor: tc.card, borderColor: tc.border }]}>
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

            <View style={styles.section}>
              <Button
                title="Sign Out"
                onPress={handleLogout}
                variant="danger"
                fullWidth
                size="large"
              />
            </View>
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
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontFamily: 'Nunito-Bold',
    color: COLORS.darkText,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.beachBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontFamily: 'Nunito-Bold',
    color: COLORS.white,
  },
  profileInfo: {
    alignItems: 'center',
    gap: 4,
  },
  displayName: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: 'Nunito-Bold',
    color: COLORS.darkText,
  },
  email: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.lightText,
  },
  childName: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Nunito-SemiBold',
    marginBottom: 2,
  },
  verificationBadge: {
    marginTop: 8,
    backgroundColor: COLORS.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  verificationText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.darkText,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Nunito-Bold',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'Nunito-SemiBold',
  },
  settingDesc: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    marginTop: 2,
  },
});

export default ProfileScreen;
